const express = require("express");

module.exports = (profileService) => {
    const router = express.Router();

    router.get("/:userId", (req, res) => {
        try {
            const { userId } = req.params;
            const profile = profileService.getProfile(userId);
            res.json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.put("/:userId", (req, res) => {
        try {
            const { userId } = req.params;
            const { nickname, goal } = req.body;
            const profile = profileService.updateProfile(
                userId,
                nickname,
                goal,
            );
            res.json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
};
