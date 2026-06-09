// routes/user.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/", (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "ユーザー名とパスワードは必須です。" });
        }

        try {
            const insert = db.prepare(
                "INSERT INTO User (username, password) VALUES (?, ?)",
            );
            const result = insert.run(username, password);

            res.json({ id: result.lastInsertRowid, username });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post("/login", (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "ユーザー名とパスワードは必須です。" });
        }

        try {
            const select = db.prepare(
                "SELECT id, username FROM User WHERE username = ? AND password = ?",
            );
            const user = select.get(username, password);

            if (!user) {
                return res.status(401).json({ error: "ユーザー名またはパスワードが正しくありません。" });
            }

            res.json({ success: true, user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
