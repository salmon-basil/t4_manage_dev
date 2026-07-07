// services/studyService.js
module.exports = (studyRepository, rankingRepository, userRepository) => {
    return {
        createStudyRecord: (userId, studyDate, studyMinutes) => {
            studyRepository.createStudyRecord(userId, studyDate, studyMinutes);
            const weeklyMinutes = studyRepository.getWeeklyMinutes(userId);
            rankingRepository.updateWeeklyMinutesForUser(userId, weeklyMinutes);
        },

        getStudyHistory: (userId) => {
            return studyRepository.getStudyHistory(userId);
        },

        // 検証用: 全ユーザーにランダムな学習時間を追加する
        addRandomStudyTimeForAllUsers: () => {
            const userIds = userRepository.findAllIds();
            const today = new Date().toISOString().slice(0, 10);

            for (const userId of userIds) {
                const studyMinutes = Math.floor(Math.random() * 90) + 10;
                studyRepository.createStudyRecord(userId, today, studyMinutes);
                const weeklyMinutes = studyRepository.getWeeklyMinutes(userId);
                rankingRepository.updateWeeklyMinutesForUser(
                    userId,
                    weeklyMinutes,
                );
            }

            return { updatedCount: userIds.length };
        },
    };
};
