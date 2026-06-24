const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();

// DB
const db = new Database("app.db");
require("./db/init");

// Repository
const userRepository = require("./repositories/userRepository")(db);
const rankingRepository = require("./repositories/rankingRepository")(db);
const studyRepository = require("./repositories/studyRepository")(db);
const profileRepository = require("./repositories/profileRepository")(db);

// Service
const userService = require("./services/userService")(userRepository, db);
const rankingService = require("./services/rankingService")(rankingRepository);

// Routes（依存注入）
const userRoutes = require("./routes/user")(userService);
const rankingRoutes = require("./routes/ranking")(rankingService);
const studyRoutes = require("./routes/study")(studyRepository);

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルーティング
app.use("/api/users", userRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/study-records", studyRoutes);

// // ユーザーテーブル確認用
// const users = db.prepare("SELECT * FROM User").all();
// console.log(users);

// // ユーザーテーブル確認用
// const StudyRecord = db.prepare("SELECT * FROM Profile").all();
// console.log(profiles);

// const tables = db
//     .prepare("SELECT name FROM sqlite_master WHERE type='table'")
//     .all();
// console.log(tables);


const rows = db.prepare("SELECT * FROM StudyRecord").all();
console.log("after insert:", rows);

// 起動
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
