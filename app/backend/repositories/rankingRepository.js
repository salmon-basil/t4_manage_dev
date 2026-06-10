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
                LIMIT 100
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
                LIMIT 100
            `);
            return stmt.all(rank);
        },
    };
};
