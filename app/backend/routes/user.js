// app/backend/routes/users.js
/**
 * ユーザー作成API
 * POST /api/users
 * body: { username, password }
 */
// routes/user.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    router.post("/", (req, res) => {
        const { username, password } = req.body;

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

    return router;
};
