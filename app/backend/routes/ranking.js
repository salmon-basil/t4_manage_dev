// routes/ranking.js
const express = require("express");

module.exports = (rankingService) => {
    const router = express.Router();

    router.post("/update", (req, res) => {
        try {
            rankingService.updateRanksByLeague();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get("/", (req, res) => {
        try {
            // If client provides userId, recompute ranks and return same-league & same-rank entries
            const userId = req.query.userId
                ? parseInt(req.query.userId, 10)
                : undefined;
            if (userId) {
                const data = rankingService.getRankingsForUser(userId);
                return res.json(data);
            }

            const rank = req.query.rank
                ? parseInt(req.query.rank, 10)
                : undefined;
            const league =
                typeof req.query.league === "string"
                    ? req.query.league
                    : undefined;
            const data = rankingService.getRankings(rank, league);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
