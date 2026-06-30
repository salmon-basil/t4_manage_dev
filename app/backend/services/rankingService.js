// services/rankingService.js
module.exports = (rankingRepository) => {
    return {
        getRankingsForUser: (userId) => {
            const userRank = rankingRepository.getRankByUserId(userId);
            if (!userRank) return [];
            return rankingRepository.getRankingsByLeagueAndRank(
                userRank.league,
                userRank.rank,
            );
        },

        getRankings: (rank, league) => {
            if (rank !== undefined && league !== undefined) {
                return rankingRepository.getRankingsByLeagueAndRank(
                    league,
                    rank,
                );
            }
            if (rank !== undefined) {
                return rankingRepository.getRankingsByRank(rank);
            }
            return rankingRepository.getAllRankings();
        },

        updateRanksByLeague: () => {
            const leagues = rankingRepository.getAllLeagues();
            const updates = [];

            for (const league of leagues) {
                const users = rankingRepository.getUsersByLeague(league);
                const n = users.length;
                if (n === 0) continue;

                const topCount = Math.ceil(n * 0.25);
                const bottomStart = Math.max(topCount, n - Math.ceil(n * 0.25));

                for (let i = 0; i < n; i++) {
                    const user = users[i];
                    let newRank = user.rank;
                    if (i < topCount) {
                        newRank = Math.min(user.rank + 1, 5);
                    } else if (i >= bottomStart) {
                        newRank = Math.max(user.rank - 1, 1);
                    }
                    if (newRank !== user.rank) {
                        updates.push({ userId: user.userId, newRank });
                    }
                }
            }

            if (updates.length > 0) {
                rankingRepository.batchUpdateRanks(updates);
            }
        },

        // Recompute rankings based on weeklyMinutes and adjust user.rank for top/bottom 25%
        // Then return rankings that match the given user's league and rank.
        recomputeAndGetForUser: (userId) => {
            const all = rankingRepository.getAllRankings();
            if (!all || all.length === 0) return [];

            // Sort by weeklyMinutes desc (already sorted but ensure)
            all.sort((a, b) => (b.weeklyMinutes || 0) - (a.weeklyMinutes || 0));

            const n = all.length;
            const topCount = Math.max(1, Math.ceil(n * 0.25));
            const bottomStart = n - topCount;

            // Apply promotion/demotion: top +1, bottom -1
            for (let i = 0; i < n; i++) {
                const item = all[i];
                let newRank = item.rank || 0;
                if (i < topCount) newRank = (newRank || 0) + 1;
                else if (i >= bottomStart)
                    newRank = Math.max(0, (newRank || 0) - 1);

                if (newRank !== item.rank) {
                    rankingRepository.updateRankForUser(item.userId, newRank);
                    item.rank = newRank;
                }
            }

            // Get the (possibly updated) target user's rank & league
            const target = rankingRepository.getRankByUserId(userId);
            if (!target) return [];

            // Return entries with same league and same rank
            return rankingRepository.getRankingsByLeagueAndRank(
                target.league,
                target.rank,
            );
        },
    };
};
