// routes/ranking.js
const express = require("express");

module.exports = (rankingService) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        try {
            const rank = req.query.rank
                ? parseInt(req.query.rank, 10)
                : undefined;
            const data = rankingService.getRankings(rank);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
