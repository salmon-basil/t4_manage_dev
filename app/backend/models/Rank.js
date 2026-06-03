/**
 * Rank モデル
 * 勉強アプリのランク情報を管理
 * JavaのRank.javaに対応
 */

class Rank {
    constructor(db) {
        this.db = db;
        this.tableName = "ranks";
    }

    /**
     * ランク情報テーブルを作成
     */
    createTable() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                rankId INTEGER PRIMARY KEY AUTOINCREMENT,
                rankName TEXT NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `;
        this.db.exec(createTableSQL);
    }

    /**
     * 新しいランクを作成
     * @param {string} rankName - ランク名（例：Bronze, Silver, Gold）
     * @returns {object} 作成されたランク情報
     */
    create(rankName) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableName} (rankName, createdAt, updatedAt)
                VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);
            const result = stmt.run(rankName);

            return {
                rankId: result.lastInsertRowid,
                rankName: rankName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        } catch (err) {
            throw new Error(`ランク作成エラー: ${err.message}`);
        }
    }

    /**
     * ランクIDでランク情報を取得
     * @param {number} rankId - ランクID
     * @returns {object} ランク情報
     */
    getById(rankId) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} WHERE rankId = ?
            `);
            return stmt.get(rankId);
        } catch (err) {
            throw new Error(`ランク取得エラー: ${err.message}`);
        }
    }

    /**
     * すべてのランク情報を取得
     * @returns {array} ランク情報の配列
     */
    getAll() {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} ORDER BY rankId ASC
            `);
            return stmt.all();
        } catch (err) {
            throw new Error(`ランク一覧取得エラー: ${err.message}`);
        }
    }

    /**
     * ランク名でランク情報を取得
     * @param {string} rankName - ランク名
     * @returns {object} ランク情報
     */
    getByName(rankName) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} WHERE rankName = ?
            `);
            return stmt.get(rankName);
        } catch (err) {
            throw new Error(`ランク名で検索エラー: ${err.message}`);
        }
    }

    /**
     * ランク情報を更新
     * @param {number} rankId - ランクID
     * @param {string} rankName - 更新するランク名
     * @returns {object} 更新されたランク情報
     */
    update(rankId, rankName) {
        try {
            const stmt = this.db.prepare(`
                UPDATE ${this.tableName}
                SET rankName = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE rankId = ?
            `);
            stmt.run(rankName, rankId);

            return this.getById(rankId);
        } catch (err) {
            throw new Error(`ランク更新エラー: ${err.message}`);
        }
    }

    /**
     * ランク情報を削除
     * @param {number} rankId - ランクID
     * @returns {boolean} 削除成功フラグ
     */
    delete(rankId) {
        try {
            const stmt = this.db.prepare(`
                DELETE FROM ${this.tableName} WHERE rankId = ?
            `);
            stmt.run(rankId);
            return true;
        } catch (err) {
            throw new Error(`ランク削除エラー: ${err.message}`);
        }
    }
}

module.exports = Rank;
