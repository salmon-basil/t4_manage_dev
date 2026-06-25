// repositories/rankingRepository.js
module.exports = (db) => {
    return {
        getAllRankings: () => {
            const stmt = db.prepare(`
                SELECT
                    r.id,
                    u.id AS userId,
                    u.username,
                    r.weeklyMinutes,
                    r.rank,
                    r.league
                FROM Rank r
                JOIN User u ON u.id = r.userId
                ORDER BY r.weeklyMinutes DESC
                LIMIT 1000
            `);
            return stmt.all();
        },

        getRankingsByRank: (rank) => {
            const stmt = db.prepare(`
                SELECT
                    r.id,
                    u.id AS userId,
                    u.username,
                    r.weeklyMinutes,
                    r.rank,
                    r.league
                FROM Rank r
                JOIN User u ON u.id = r.userId
                WHERE r.rank = ?
                ORDER BY r.weeklyMinutes DESC
                LIMIT 1000
            `);
            return stmt.all(rank);
        },

        getRankingsByLeagueAndRank: (league, rank) => {
            const stmt = db.prepare(`
                SELECT
                    r.id,
                    u.id AS userId,
                    u.username,
                    r.weeklyMinutes,
                    r.rank,
                    r.league
                FROM Rank r
                JOIN User u ON u.id = r.userId
                WHERE r.league = ? AND r.rank = ?
                ORDER BY r.weeklyMinutes DESC
                LIMIT 1000
            `);
            return stmt.all(league, rank);
        },

        getRankByUserId: (userId) => {
            const stmt = db.prepare(
                `SELECT r.* FROM Rank r WHERE r.userId = ? LIMIT 1`,
            );
            return stmt.get(userId);
        },

        updateRankForUser: (userId, newRank) => {
            const stmt = db.prepare(
                `UPDATE Rank SET rank = ? WHERE userId = ?`,
            );
            return stmt.run(newRank, userId);
        },
    };
};
