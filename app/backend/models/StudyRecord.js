/**
 * StudyRecord モデル
 * 勉強アプリの勉強記録を管理
 * JavaのStudyRecord.javaに対応
 */

class StudyRecord {
    constructor(db) {
        this.db = db;
        this.tableName = "study_records";
    }

    /**
     * 勉強記録テーブルを作成
     */
    createTable() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                recordId INTEGER PRIMARY KEY AUTOINCREMENT,
                subject TEXT,
                studyTime INTEGER NOT NULL,
                studyDate DATE NOT NULL,
                category TEXT,
                user_id INTEGER NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        this.db.exec(createTableSQL);
    }

    /**
     * 新しい勉強記録を作成
     * @param {number} user_id - ユーザーID
     * @param {string} subject - 科目（数学、英語など）
     * @param {number} studyTime - 勉強時間（分）
     * @param {string} studyDate - 勉強日（YYYY-MM-DD形式）
     * @param {string} category - 学習カテゴリ
     * @returns {object} 作成された勉強記録
     */
    create(user_id, subject, studyTime, studyDate, category = null) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableName} (user_id, subject, studyTime, studyDate, category, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);
            const result = stmt.run(
                user_id,
                subject,
                studyTime,
                studyDate,
                category,
            );

            return {
                recordId: result.lastInsertRowid,
                user_id: user_id,
                subject: subject,
                studyTime: studyTime,
                studyDate: studyDate,
                category: category,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        } catch (err) {
            throw new Error(`勉強記録作成エラー: ${err.message}`);
        }
    }

    /**
     * 記録IDで勉強記録を取得
     * @param {number} recordId - 記録ID
     * @returns {object} 勉強記録
     */
    getById(recordId) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName} WHERE recordId = ?
            `);
            return stmt.get(recordId);
        } catch (err) {
            throw new Error(`勉強記録取得エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーのすべての勉強記録を取得
     * @param {number} user_id - ユーザーID
     * @param {object} options - オプション（limit, offset, orderBy）
     * @returns {array} 勉強記録の配列
     */
    getByUserId(user_id, options = {}) {
        try {
            const limit = options.limit || 100;
            const offset = options.offset || 0;
            const orderBy = options.orderBy || "studyDate DESC";

            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ?
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?
            `);
            return stmt.all(user_id, limit, offset);
        } catch (err) {
            throw new Error(`ユーザーの勉強記録取得エラー: ${err.message}`);
        }
    }

    /**
     * 日付範囲で勉強記録を取得
     * @param {number} user_id - ユーザーID
     * @param {string} startDate - 開始日（YYYY-MM-DD形式）
     * @param {string} endDate - 終了日（YYYY-MM-DD形式）
     * @returns {array} 勉強記録の配列
     */
    getByDateRange(user_id, startDate, endDate) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ? AND studyDate BETWEEN ? AND ?
                ORDER BY studyDate DESC
            `);
            return stmt.all(user_id, startDate, endDate);
        } catch (err) {
            throw new Error(`日付範囲での検索エラー: ${err.message}`);
        }
    }

    /**
     * カテゴリで勉強記録を取得
     * @param {number} user_id - ユーザーID
     * @param {string} category - カテゴリ
     * @returns {array} 勉強記録の配列
     */
    getByCategory(user_id, category) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ? AND category = ?
                ORDER BY studyDate DESC
            `);
            return stmt.all(user_id, category);
        } catch (err) {
            throw new Error(`カテゴリでの検索エラー: ${err.message}`);
        }
    }

    /**
     * 科目で勉強記録を取得
     * @param {number} user_id - ユーザーID
     * @param {string} subject - 科目
     * @returns {array} 勉強記録の配列
     */
    getBySubject(user_id, subject) {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ? AND subject = ?
                ORDER BY studyDate DESC
            `);
            return stmt.all(user_id, subject);
        } catch (err) {
            throw new Error(`科目での検索エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーの勉強記録を更新
     * @param {number} recordId - 記録ID
     * @param {object} data - 更新するデータ
     * @returns {object} 更新された勉強記録
     */
    update(recordId, data) {
        try {
            const allowedFields = [
                "subject",
                "studyTime",
                "studyDate",
                "category",
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
            values.push(recordId);

            const stmt = this.db.prepare(`
                UPDATE ${this.tableName}
                SET ${updateFields.join(", ")}
                WHERE recordId = ?
            `);
            stmt.run(...values);

            return this.getById(recordId);
        } catch (err) {
            throw new Error(`勉強記録更新エラー: ${err.message}`);
        }
    }

    /**
     * 勉強記録を削除
     * @param {number} recordId - 記録ID
     * @returns {boolean} 削除成功フラグ
     */
    delete(recordId) {
        try {
            const stmt = this.db.prepare(`
                DELETE FROM ${this.tableName} WHERE recordId = ?
            `);
            stmt.run(recordId);
            return true;
        } catch (err) {
            throw new Error(`勉強記録削除エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーの総勉強時間を計算
     * @param {number} user_id - ユーザーID
     * @returns {number} 総勉強時間（分）
     */
    getTotalStudyTime(user_id) {
        try {
            const stmt = this.db.prepare(`
                SELECT SUM(studyTime) as total FROM ${this.tableName}
                WHERE user_id = ?
            `);
            const result = stmt.get(user_id);
            return result.total || 0;
        } catch (err) {
            throw new Error(`総勉強時間計算エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーの日別勉強時間を取得（集計）
     * @param {number} user_id - ユーザーID
     * @returns {array} 日別の勉強時間
     */
    getDailyStudyTime(user_id) {
        try {
            const stmt = this.db.prepare(`
                SELECT studyDate, SUM(studyTime) as totalTime, COUNT(*) as recordCount
                FROM ${this.tableName}
                WHERE user_id = ?
                GROUP BY studyDate
                ORDER BY studyDate DESC
            `);
            return stmt.all(user_id);
        } catch (err) {
            throw new Error(`日別勉強時間取得エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーのカテゴリ別勉強時間を取得（集計）
     * @param {number} user_id - ユーザーID
     * @returns {array} カテゴリ別の勉強時間
     */
    getCategoryStudyTime(user_id) {
        try {
            const stmt = this.db.prepare(`
                SELECT category, SUM(studyTime) as totalTime, COUNT(*) as recordCount
                FROM ${this.tableName}
                WHERE user_id = ? AND category IS NOT NULL
                GROUP BY category
                ORDER BY totalTime DESC
            `);
            return stmt.all(user_id);
        } catch (err) {
            throw new Error(`カテゴリ別勉強時間取得エラー: ${err.message}`);
        }
    }

    /**
     * ユーザーの科目別勉強時間を取得（集計）
     * @param {number} user_id - ユーザーID
     * @returns {array} 科目別の勉強時間
     */
    getSubjectStudyTime(user_id) {
        try {
            const stmt = this.db.prepare(`
                SELECT subject, SUM(studyTime) as totalTime, COUNT(*) as recordCount
                FROM ${this.tableName}
                WHERE user_id = ? AND subject IS NOT NULL
                GROUP BY subject
                ORDER BY totalTime DESC
            `);
            return stmt.all(user_id);
        } catch (err) {
            throw new Error(`科目別勉強時間取得エラー: ${err.message}`);
        }
    }
}

module.exports = StudyRecord;
