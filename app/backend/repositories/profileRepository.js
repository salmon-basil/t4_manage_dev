module.exports = (db) => {
    return {
        upsertProfile: (userId, nickname, goal, displayName) => {
            return db
                .prepare(
                    `
                    INSERT INTO Profile (userId, displayName, nickname, goal)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(userId)
                    DO UPDATE SET
                        displayName = excluded.displayName,
                        nickname = excluded.nickname,
                        goal = excluded.goal
                `,
                )
                .run(userId, displayName, nickname, goal);
        },

        findByUserId: (userId) => {
            return db
                .prepare(
                    `
                    SELECT * FROM Profile WHERE userId = ?
                `,
                )
                .get(userId);
        },
    };
};
