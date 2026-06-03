/**
 * server.js 改善版
 * モデルを使用した新しいサーバー実装例
 */

const express = require("express");
const cors = require("cors");
const Database = require("./models");
const Database3 = require("better-sqlite3");

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース初期化
const db = new Database3("./data.db");
const database = new Database(db);

// テーブル作成
database.initializeTables();

// ===== Rank API =====
app.post("/api/ranks", (req, res) => {
    try {
        const { rankName } = req.body;
        if (!rankName) {
            return res.status(400).json({ error: "rankName は必須です" });
        }
        const rank = database.rank.create(rankName);
        res.json(rank);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/ranks", (req, res) => {
    try {
        const ranks = database.rank.getAll();
        res.json(ranks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/ranks/:rankId", (req, res) => {
    try {
        const rank = database.rank.getById(req.params.rankId);
        if (!rank) {
            return res.status(404).json({ error: "ランクが見つかりません" });
        }
        res.json(rank);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/ranks/:rankId", (req, res) => {
    try {
        const { rankName } = req.body;
        if (!rankName) {
            return res.status(400).json({ error: "rankName は必須です" });
        }
        const rank = database.rank.update(req.params.rankId, rankName);
        res.json(rank);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/ranks/:rankId", (req, res) => {
    try {
        database.rank.delete(req.params.rankId);
        res.json({ message: "ランクが削除されました" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== User API =====
app.post("/api/users", (req, res) => {
    try {
        const { username, password, rank_id } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "username と password は必須です" });
        }
        const user = database.user.create(username, password, rank_id || null);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/users", (req, res) => {
    try {
        const users = database.user.getAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/users/:userId", (req, res) => {
    try {
        const user = database.user.getById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/users/username/:username", (req, res) => {
    try {
        const user = database.user.getByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/users/:userId", (req, res) => {
    try {
        const user = database.user.update(req.params.userId, req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/users/:userId/study-time", (req, res) => {
    try {
        const { minutes } = req.body;
        if (!minutes) {
            return res.status(400).json({ error: "minutes は必須です" });
        }
        const user = database.user.addStudyTime(req.params.userId, minutes);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/users/:userId/rank/:rankId", (req, res) => {
    try {
        const user = database.user.updateRank(
            req.params.userId,
            req.params.rankId,
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/users/ranking/top", (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const ranking = database.user.getRanking(limit);
        res.json(ranking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/users/:userId", (req, res) => {
    try {
        database.user.delete(req.params.userId);
        res.json({ message: "ユーザーが削除されました" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== StudyRecord API =====
app.post("/api/study-records", (req, res) => {
    try {
        const { user_id, subject, studyTime, studyDate, category } = req.body;
        if (!user_id || !studyTime || !studyDate) {
            return res.status(400).json({
                error: "user_id, studyTime, studyDate は必須です",
            });
        }
        const record = database.studyRecord.create(
            user_id,
            subject,
            studyTime,
            studyDate,
            category,
        );

        // ユーザーの総勉強時間を更新
        database.user.addStudyTime(user_id, studyTime);

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId", (req, res) => {
    try {
        const options = {
            limit: req.query.limit || 100,
            offset: req.query.offset || 0,
            orderBy: req.query.orderBy || "studyDate DESC",
        };
        const records = database.studyRecord.getByUserId(
            req.params.userId,
            options,
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/:recordId", (req, res) => {
    try {
        const record = database.studyRecord.getById(req.params.recordId);
        if (!record) {
            return res.status(404).json({ error: "記録が見つかりません" });
        }
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/date-range", (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: "startDate と endDate は必須です",
            });
        }
        const records = database.studyRecord.getByDateRange(
            req.params.userId,
            startDate,
            endDate,
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/category/:category", (req, res) => {
    try {
        const records = database.studyRecord.getByCategory(
            req.params.userId,
            req.params.category,
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/subject/:subject", (req, res) => {
    try {
        const records = database.studyRecord.getBySubject(
            req.params.userId,
            req.params.subject,
        );
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/study-records/:recordId", (req, res) => {
    try {
        const record = database.studyRecord.update(
            req.params.recordId,
            req.body,
        );
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/stats/daily", (req, res) => {
    try {
        const stats = database.studyRecord.getDailyStudyTime(req.params.userId);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/stats/category", (req, res) => {
    try {
        const stats = database.studyRecord.getCategoryStudyTime(
            req.params.userId,
        );
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/study-records/user/:userId/stats/subject", (req, res) => {
    try {
        const stats = database.studyRecord.getSubjectStudyTime(
            req.params.userId,
        );
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/study-records/:recordId", (req, res) => {
    try {
        database.studyRecord.delete(req.params.recordId);
        res.json({ message: "記録が削除されました" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== Health Check =====
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "サーバーが稼働中です" });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`✓ サーバーがポート ${PORT} で起動しました`);
    console.log(`✓ URL: http://localhost:${PORT}`);
});
