// repositories/userRepository.js
module.exports = (db) => {
    return {
        createUser: (username, hashedPassword) => {
            const stmt = db.prepare(
                "INSERT INTO User (username, password) VALUES (?, ?)"
            );
            const result = stmt.run(username, hashedPassword);
            return { id: result.lastInsertRowid, username };
        },

        findByUsername: (username) => {
            const stmt = db.prepare(
                "SELECT * FROM User WHERE username = ?"
            );
            return stmt.get(username);
        },

        findById: (id) => {
            const stmt = db.prepare(
                "SELECT id, username FROM User WHERE id = ?"
            );
            return stmt.get(id);
        },
    };
};