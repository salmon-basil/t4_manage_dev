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

const seedTestData = () => {
    const row = db.prepare('SELECT COUNT(*) AS cnt FROM User').get();
    if (row && row.cnt > 0) {
        return;
    }

    const users = [
        { username: 'alice', password: 'alice123', displayName: 'Alice', weeklyMinutes: 3000, rank: 7, league: 'DIAMOND' },
        { username: 'bob', password: 'bob123', displayName: 'Bob', weeklyMinutes: 2850, rank: 7, league: 'DIAMOND' },
        { username: 'charlie', password: 'charlie123', displayName: 'Charlie', weeklyMinutes: 2700, rank: 7, league: 'DIAMOND' },
        { username: 'david', password: 'david123', displayName: 'David', weeklyMinutes: 2600, rank: 7, league: 'DIAMOND' },
        { username: 'emma', password: 'emma123', displayName: 'Emma', weeklyMinutes: 2500, rank: 7, league: 'DIAMOND' },
        { username: 'george', password: 'george123', displayName: 'George', weeklyMinutes: 2300, rank: 6, league: 'PLATINUM' },
        { username: 'hana', password: 'hana123', displayName: 'Hana', weeklyMinutes: 2200, rank: 6, league: 'PLATINUM' },
        { username: 'ikuto', password: 'ikuto123', displayName: 'Ikuto', weeklyMinutes: 2100, rank: 6, league: 'PLATINUM' },
        { username: 'julia', password: 'julia123', displayName: 'Julia', weeklyMinutes: 2000, rank: 6, league: 'PLATINUM' },
        { username: 'kaito', password: 'kaito123', displayName: 'Kaito', weeklyMinutes: 1900, rank: 6, league: 'PLATINUM' },
        { username: 'mika', password: 'mika123', displayName: 'Mika', weeklyMinutes: 1700, rank: 5, league: 'GOLD' },
        { username: 'naoki', password: 'naoki123', displayName: 'Naoki', weeklyMinutes: 1600, rank: 5, league: 'GOLD' },
        { username: 'ohana', password: 'ohana123', displayName: 'Ohana', weeklyMinutes: 1500, rank: 5, league: 'GOLD' },
        { username: 'peter', password: 'peter123', displayName: 'Peter', weeklyMinutes: 1400, rank: 5, league: 'GOLD' },
        { username: 'rina', password: 'rina123', displayName: 'Rina', weeklyMinutes: 1300, rank: 5, league: 'GOLD' },
        { username: 'taku', password: 'taku123', displayName: 'Taku', weeklyMinutes: 1100, rank: 4, league: 'SILVER' },
        { username: 'umi', password: 'umi123', displayName: 'Umi', weeklyMinutes: 1000, rank: 4, league: 'SILVER' },
        { username: 'yuki', password: 'yuki123', displayName: 'Yuki', weeklyMinutes: 950, rank: 4, league: 'SILVER' },
        { username: 'zara', password: 'zara123', displayName: 'Zara', weeklyMinutes: 900, rank: 4, league: 'SILVER' },
        { username: 'aki', password: 'aki123', displayName: 'Aki', weeklyMinutes: 850, rank: 4, league: 'SILVER' },
        { username: 'chika', password: 'chika123', displayName: 'Chika', weeklyMinutes: 750, rank: 3, league: 'BRONZE' },
        { username: 'dori', password: 'dori123', displayName: 'Dori', weeklyMinutes: 700, rank: 3, league: 'BRONZE' },
        { username: 'eri', password: 'eri123', displayName: 'Eri', weeklyMinutes: 650, rank: 3, league: 'BRONZE' },
        { username: 'fumiya', password: 'fumiya123', displayName: 'Fumiya', weeklyMinutes: 600, rank: 3, league: 'BRONZE' },
        { username: 'goro', password: 'goro123', displayName: 'Goro', weeklyMinutes: 550, rank: 3, league: 'BRONZE' }
    ];

    const insertUser = db.prepare('INSERT OR IGNORE INTO User (username, password) VALUES (?, ?)');
    const insertProfile = db.prepare('INSERT OR IGNORE INTO Profile (userId, displayName) VALUES ((SELECT id FROM User WHERE username = ?), ?)');
    const insertRank = db.prepare('INSERT OR IGNORE INTO Rank (userId, weeklyMinutes, rank, league) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?, ?)');

    const insertStudy = db.prepare('INSERT OR IGNORE INTO StudyRecord (userId, studyDate, studyMinutes) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?)');

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    for (const user of users) {
        insertUser.run(user.username, user.password);
        insertProfile.run(user.username, user.displayName);
        insertRank.run(user.username, user.weeklyMinutes, user.rank, user.league);
        insertStudy.run(user.username, today, Math.max(30, Math.floor(user.weeklyMinutes / 7)));
    }
};

seedTestData();

