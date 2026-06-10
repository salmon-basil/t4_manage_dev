// routes/study.js
const express = require("express");

module.exports = (studyRepository) => {
    const router = express.Router();

    router.post("/", (req, res) => {
        try {
            const { userId, studyDate, studyMinutes } = req.body;

            if (!userId || !studyDate || typeof studyMinutes !== "number") {
                return res.status(400).json({ error: "不正な入力です。" });
            }

            studyRepository.createStudyRecord(userId, studyDate, studyMinutes);

            res.json({ success: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
