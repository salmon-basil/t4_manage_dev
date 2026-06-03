/**
 * User モデル
 * 勉強アプリのユーザー情報を管理
 * JavaのUser.javaに対応
 */

class User {
    constructor(db) {
        this.db = db;
        this.tableName = "users";
    }

    /**
     * ユーザー情報テーブルを作成
     */
    createTable() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                totalStudyTime INTEGER DEFAULT 0,
                rank_id INTEGER,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (rank_id) REFERENCES ranks(rankId) ON DELETE SET NULL
            )
        `;
        this.db.exec(createTableSQL);
    }

    /**
     * 新しいユーザーを作成
     * @param {string} username - ユーザー名
     * @param {string} password - パスワード
     * @param {number} rank_id - ランクID（オプション）
     * @returns {object} 作成されたユーザー情報
     */
    create(username, password, rank_id = null) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableName} (username, password, rank_id, totalStudyTime, createdAt, updatedAt)
                VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);
            const result = stmt.run(username, password, rank_id);

            return {
                id: result.lastInsertRowid,
                username: username,
                password: password,
                totalStudyTime: 0,
                rank_id: rank_id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        } catch (err) {
            throw new Error(`ユーザー作成エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーIDでユーザー情報を取得
     * @param {number} userId - ユーザーID
     * @returns {object} ユーザー情報
     */
    getById(userId) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} WHERE id = ?
            `);
            return stmt.get(userId);
        } catch (err) {
            throw new Error(`ユーザー取得エラー: ${err.message}`);
        }
    }

    /**
     * ユーザー名でユーザー情報を取得
     * @param {string} username - ユーザー名
     * @returns {object} ユーザー情報
     */
    getByUsername(username) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} WHERE username = ?
            `);
            return stmt.get(username);
        } catch (err) {
            throw new Error(`ユーザー名で検索エラー: ${err.message}`);
        }
    }

    /**
     * すべてのユーザー情報を取得
     * @returns {array} ユーザー情報の配列
     */
    getAll() {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} ORDER BY id ASC
            `);
            return stmt.all();
        } catch (err) {
            throw new Error(`ユーザー一覧取得エラー: ${err.message}`);
        }
    }

    /**
     * ユーザー情報を更新（パスワード変更、ランク変更など）
     * @param {number} userId - ユーザーID
     * @param {object} data - 更新するデータ
     * @returns {object} 更新されたユーザー情報
     */
    update(userId, data) {
        try {
            const allowedFields = [
                "username",
                "password",
                "totalStudyTime",
                "rank_id",
            ];
            const updateFields = [];
            const values = [];

            for (const [key, value] of Object.entries(data)) {
                if (allowedFields.includes(key)) {
                    updateFields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (updateFields.length === 0) {
                throw new Error("更新するフィールドがありません");
            }

            updateFields.push("updatedAt = CURRENT_TIMESTAMP");
            values.push(userId);

            const stmt = this.db.prepare(`
                UPDATE ${this.tableName}
                SET ${updateFields.join(", ")}
                WHERE id = ?
            `);
            stmt.run(...values);

            return this.getById(userId);
        } catch (err) {
            throw new Error(`ユーザー更新エラー: ${err.message}`);
        }
    }

    /**
     * 総勉強時間を増加させる
     * @param {number} userId - ユーザーID
     * @param {number} minutes - 増加させる分数
     * @returns {object} 更新されたユーザー情報
     */
    addStudyTime(userId, minutes) {
        try {
            const stmt = this.db.prepare(`
                UPDATE ${this.tableName}
                SET totalStudyTime = totalStudyTime + ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            stmt.run(minutes, userId);

            return this.getById(userId);
        } catch (err) {
            throw new Error(`勉強時間追加エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーのランクを更新
     * @param {number} userId - ユーザーID
     * @param {number} rank_id - 新しいランクID
     * @returns {object} 更新されたユーザー情報
     */
    updateRank(userId, rank_id) {
        return this.update(userId, { rank_id: rank_id });
    }

    /**
     * ユーザー情報を削除
     * @param {number} userId - ユーザーID
     * @returns {boolean} 削除成功フラグ
     */
    delete(userId) {
        try {
            const stmt = this.db.prepare(`
                DELETE FROM ${this.tableName} WHERE id = ?
            `);
            stmt.run(userId);
            return true;
        } catch (err) {
            throw new Error(`ユーザー削除エラー: ${err.message}`);
        }
    }

    /**
     * 総勉強時間でランキング取得
     * @param {number} limit - 取得件数（デフォルト：10）
     * @returns {array} ランキング情報の配列
     */
    getRanking(limit = 10) {
        try {
            const stmt = this.db.prepare(`
                SELECT id, username, totalStudyTime, rank_id, createdAt, updatedAt
                FROM ${this.tableName}
                ORDER BY totalStudyTime DESC
                LIMIT ?
            `);
            return stmt.all(limit);
        } catch (err) {
            throw new Error(`ランキング取得エラー: ${err.message}`);
        }
    }
}

module.exports = User;
