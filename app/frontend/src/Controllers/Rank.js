////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ランク管理を行うクラス
//担当：深谷

// 1. 全ユーザー取得＆スコアでソート
const users = await User.find().sort({ score: -1 }); // scoreで降順

const total = users.length;
const quarter = Math.floor(total / 4);

// 2. 上位25%と下位25%を抽出
const topUsers = users.slice(0, quarter);
const bottomUsers = users.slice(-quarter);

// 3. ランク昇格・降格
for (const user of topUsers) {
    if (user.rank < MAX_RANK) {
        user.rank += 1;
        await user.save();
    }
}
for (const user of bottomUsers) {
    if (user.rank > MIN_RANK) {
        user.rank -= 1;
        await user.save();
    }
}
