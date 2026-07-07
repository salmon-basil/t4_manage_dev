// repositories/userRepository.js
module.exports = (db) => {
    const createUserWithInitialRankTx = db.transaction(
        (username, hashedPassword) => {
            const insertUserStmt = db.prepare(
                "INSERT INTO User (username, password) VALUES (?, ?)",
            );
            const result = insertUserStmt.run(username, hashedPassword);
            const userId = result.lastInsertRowid;

            const insertRankStmt = db.prepare(
                "INSERT INTO Rank (userId, weeklyMinutes, rank, league) VALUES (?, ?, ?, ?)",
            );
            insertRankStmt.run(userId, 0, 1, "else");

            return { id: userId, username };
        },
    );

    return {
        createUser: (username, hashedPassword) => {
            const stmt = db.prepare(
                "INSERT INTO User (username, password) VALUES (?, ?)",
            );
            const result = stmt.run(username, hashedPassword);
            return { id: result.lastInsertRowid, username };
        },

        createUserWithInitialRank: (username, hashedPassword) => {
            return createUserWithInitialRankTx(username, hashedPassword);
        },

        findByUsername: (username) => {
            const stmt = db.prepare("SELECT * FROM User WHERE username = ?");
            return stmt.get(username);
        },

        findById: (id) => {
            const stmt = db.prepare(
                "SELECT id, username FROM User WHERE id = ?",
            );
            return stmt.get(id);
        },

        findAllIds: () => {
            return db
                .prepare("SELECT id FROM User")
                .all()
                .map((row) => row.id);
        },
    };
};
