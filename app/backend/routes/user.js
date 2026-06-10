// routes/user.js
const express = require("express");

module.exports = (userService) => {
    const router = express.Router();

    router.post("/", async (req, res) => {
        try {
            const { username, password, displayName } = req.body;
            const user = await userService.register(
                username,
                password,
                displayName,
            );
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await userService.login(username, password);
            res.json({ success: true, user });
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    });

    return router;
};
