const Database = require("better-sqlite3");

const db = new Database("app.db");

// Userテーブル
db.exec(`
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);
`);

// Rankテーブル
db.exec(`
CREATE TABLE IF NOT EXISTS Rank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    weeklyMinutes INTEGER,
    rank INTEGER,
    league TEXT,
    FOREIGN KEY(userId) REFERENCES User(id)
);
`);

// StudyRecordテーブル
db.exec(`
CREATE TABLE IF NOT EXISTS StudyRecord (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    studyDate TEXT,
    studyMinutes INTEGER,
    FOREIGN KEY(userId) REFERENCES User(id)
);
`);

console.log("DB initialized");
