const Database = require("better-sqlite3");

const db = new Database("app.db");

// Userテーブル
// ユーザー名の被り禁止
db.exec(`
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);
`);

// Profileテーブル
db.exec(`
CREATE TABLE IF NOT EXISTS Profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL UNIQUE,
    displayName TEXT NOT NULL CHECK(length(displayName) <= 30),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE
);
`);

db.exec(`
CREATE TRIGGER IF NOT EXISTS trigger_profile_updatedAt
AFTER UPDATE ON Profile
FOR EACH ROW
BEGIN
    UPDATE Profile
    SET updatedAt = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;
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
