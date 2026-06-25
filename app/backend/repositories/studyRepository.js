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
    };
};
