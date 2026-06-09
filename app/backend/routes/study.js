/**
 * 学習記録追加API
 * POST /api/study-records
 * body: { userId, studyDate, studyMinutes }
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/", (req, res) => {
        const { userId, studyDate, studyMinutes } = req.body;

        try {
            const insert = db.prepare(
                "INSERT INTO StudyRecord (userId, studyDate, studyMinutes) VALUES (?, ?, ?)",
            );

            insert.run(userId, studyDate, studyMinutes);

            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
