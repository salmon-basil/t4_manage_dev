const bcrypt = require("bcrypt");

module.exports = (userRepository) => {
    return {
        register: async (username, password) => {
            if (!username || !password) {
                throw new Error("ユーザー名とパスワードは必須です。");
            }

            const existing = userRepository.findByUsername(username);
            if (existing) {
                throw new Error("既に存在するユーザーです。");
            }

            const hashed = await bcrypt.hash(password, 10);

            const user = userRepository.createUserWithInitialRank(
                username,
                hashed,
            );

            return {
                id: user.id,
                username,
            };
        },

        login: async (username, password) => {
            if (!username || !password) {
                throw new Error("ユーザー名とパスワードは必須です。");
            }

            const user = userRepository.findByUsername(username);
            if (!user) {
                throw new Error("認証失敗");
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error("認証失敗");
            }

            return {
                id: user.id,
                username: user.username,
            };
        },
    };
};
