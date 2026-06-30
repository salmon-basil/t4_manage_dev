// services/studyService.js
module.exports = (studyRepository, rankingRepository) => {
    return {
        createStudyRecord: (userId, studyDate, studyMinutes) => {
            studyRepository.createStudyRecord(userId, studyDate, studyMinutes);
            const weeklyMinutes = studyRepository.getWeeklyMinutes(userId);
            rankingRepository.updateWeeklyMinutesForUser(userId, weeklyMinutes);
        },

        getStudyHistory: (userId) => {
            return studyRepository.getStudyHistory(userId);
        },
    };
};
