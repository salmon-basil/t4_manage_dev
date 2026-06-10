// services/rankingService.js
module.exports = (rankingRepository) => {
    return {
        getRankings: (rank) => {
            if (rank !== undefined) {
                return rankingRepository.getRankingsByRank(rank);
            }
            return rankingRepository.getAllRankings();
        },
    };
};
