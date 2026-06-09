/**
 * ランキング取得API
 * GET /api/rankings
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.get("/", (req, res) => {
        // Rank テーブルの weeklyMinutes でソート
        const rankParam = parseInt(req.query.rank, 10);
        let select;

        if (!Number.isNaN(rankParam)) {
            select = db.prepare(`
                SELECT
                    r.id,
                    u.id AS userId,
                    u.username,
                    r.weeklyMinutes,
                    r.rank,
                    r.league
                FROM Rank r
                JOIN User u ON u.id = r.userId
                WHERE r.rank = ?
                ORDER BY r.weeklyMinutes DESC
            `);
            const rankings = select.all(rankParam);
            return res.json(rankings);
        }

        select = db.prepare(`
            SELECT
                r.id,
                u.id AS userId,
                u.username,
                r.weeklyMinutes,
                r.rank,
                r.league
            FROM Rank r
            JOIN User u ON u.id = r.userId
            ORDER BY r.weeklyMinutes DESC
        `);

        const rankings = select.all();

        res.json(rankings);
    });

    return router;
};
