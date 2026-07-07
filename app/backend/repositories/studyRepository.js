// repositories/studyRepository.js
module.exports = (db) => {
    return {
        createStudyRecord: (userId, studyDate, studyMinutes) => {
            const stmt = db.prepare(`
                INSERT INTO StudyRecord (userId, studyDate, studyMinutes)
                VALUES (?, ?, ?)
            `);
            stmt.run(userId, studyDate, studyMinutes);
        },

        getStudyHistory: (userId) => {
            return db
                .prepare(
                    `
                    SELECT studyDate, studyMinutes FROM StudyRecord
                    WHERE userId = ?
                    ORDER BY studyDate DESC
                `,
                )
                .all(userId);
        },

        getWeeklyMinutes: (userId) => {
            const row = db
                .prepare(
                    `
                    SELECT COALESCE(SUM(studyMinutes), 0) AS total
                    FROM StudyRecord
                    WHERE userId = ?
                      AND studyDate >= date('now', '-' || ((strftime('%w', 'now') + 6) % 7) || ' days')
                `,
                )
                .get(userId);
            return row ? row.total : 0;
        },

        getTotalStudyMinutes: (userId) => {
            const row = db
                .prepare(
                    `
            SELECT COALESCE(SUM(studyMinutes), 0) AS total
            FROM StudyRecord
            WHERE userId = ?
        `,
                )
                .get(userId);

            return row.total;
        },
    };
};
