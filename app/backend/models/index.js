/**
 * Database 初期化モジュール
 * すべてのモデルを初期化してエクスポート
 */

const Rank = require("./Rank");
const User = require("./User");
const StudyRecord = require("./StudyRecord");

class Database {
    constructor(db) {
        this.db = db;
        this.rank = new Rank(db);
        this.user = new User(db);
        this.studyRecord = new StudyRecord(db);
    }

    /**
     * すべてのテーブルを作成
     */
    initializeTables() {
        try {
            this.rank.createTable();
            this.user.createTable();
            this.studyRecord.createTable();
            console.log("✓ すべてのテーブルが初期化されました");
        } catch (err) {
            console.error("テーブル初期化エラー:", err);
        }
    }
}

module.exports = Database;
