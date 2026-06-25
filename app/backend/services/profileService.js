module.exports = (profileRepository, userRepository) => {
    const getProfile = (userId) => {
        const user = userRepository.findById(userId);
        if (!user) {
            throw new Error("ユーザーが見つかりません。");
        }

        const profile = profileRepository.findByUserId(userId);

        return {
            userId: user.id,
            username: user.username,
            nickname: profile?.nickname || "",
            goal: profile?.goal || "",
            displayName: profile?.displayName || user.username,
        };
    };

    const updateProfile = (userId, nickname, goal) => {
        const user = userRepository.findById(userId);
        if (!user) {
            throw new Error("ユーザーが見つかりません。");
        }

        profileRepository.upsertProfile(
            userId,
            nickname || "",
            goal || "",
            user.username,
        );

        return getProfile(userId);
    };

    return {
        getProfile,
        updateProfile,
    };
};
