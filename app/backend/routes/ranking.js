/**
 * ランキング取得API
 * GET /api/rankings
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/", (req, res) => {
        // ユーザーごとの合計学習時間を集計
        const select = db.prepare(`
        SELECT 
            u.id,
            u.username,
            SUM(sr.studyMinutes) as totalMinutes
        FROM User u
        LEFT JOIN StudyRecord sr ON u.id = sr.userId
        GROUP BY u.id
        ORDER BY totalMinutes DESC
    `);

        const rankings = select.all();

        res.json(rankings);
    });
};
