module.exports = (db) => {
    return {
        upsertProfile: (userId, displayName) => {
            return db
                .prepare(
                    `
                    INSERT INTO profiles (user_id, display_name)
                    VALUES (?, ?)
                    ON CONFLICT(user_id)
                    DO UPDATE SET display_name = excluded.display_name
                `,
                )
                .run(userId, displayName);
        },

        findByUserId: (userId) => {
            return db
                .prepare(
                    `
                    SELECT * FROM profiles WHERE user_id = ?
                `,
                )
                .get(userId);
        },
    };
};
