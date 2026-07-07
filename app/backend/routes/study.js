// routes/study.js
const express = require("express");

module.exports = (studyService) => {
    const router = express.Router();

    router.post("/", (req, res) => {
        try {
            const { userId, studyDate, studyMinutes } = req.body;

            if (!userId || !studyDate || typeof studyMinutes !== "number") {
                return res.status(400).json({ error: "不正な入力です。" });
            }

            studyService.createStudyRecord(userId, studyDate, studyMinutes);

            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post("/random-all", (req, res) => {
        try {
            const result = studyService.addRandomStudyTimeForAllUsers();
            res.json({ success: true, ...result });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get("/:userId", (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "不正な入力です。" });
            }

            const history = studyService.getStudyHistory(userId);

            res.json(history || []);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
