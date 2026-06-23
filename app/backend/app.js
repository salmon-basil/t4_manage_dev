const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

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
app.use("/public", express.static(path.join(__dirname, "..", "..", "public")));

// ルーティング
app.use("/api/users", userRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/study-records", studyRoutes);

// // ユーザーテーブル確認用
// const users = db.prepare("SELECT * FROM User").all();
// console.log(users);

// // ユーザーテーブル確認用
// const profiles = db.prepare("SELECT * FROM Profile").all();
// console.log(profiles);

// 起動
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
