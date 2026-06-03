# Node.js モデル使用ガイド

JavaのエンティティクラスをNode.js（SQLite）に変換しました。

## 📦 モデル一覧

- **Rank.js** - ランク情報管理（Java: Rank.java）
- **User.js** - ユーザー情報管理（Java: User.java）
- **StudyRecord.js** - 勉強記録管理（Java: StudyRecord.java）
- **index.js** - データベース初期化モジュール

---

## 🚀 セットアップ方法

### server.jsで初期化

```javascript
const Database = require('./models');
const db = require('better-sqlite3')('data.db');

// データベース初期化
const database = new Database(db);
database.initializeTables();

// 各モデルにアクセス
const rankModel = database.rank;
const userModel = database.user;
const recordModel = database.studyRecord;
```

---

## 🔍 各モデルの使用例

### Rank モデル

```javascript
// ランクを作成
const newRank = rankModel.create('Gold');
// { rankId: 1, rankName: 'Gold', createdAt: '...', updatedAt: '...' }

// ランクIDで取得
const rank = rankModel.getById(1);

// すべてのランクを取得
const allRanks = rankModel.getAll();

// ランク名で取得
const goldRank = rankModel.getByName('Gold');

// ランクを更新
const updated = rankModel.update(1, 'Platinum');

// ランクを削除
rankModel.delete(1);
```

### User モデル

```javascript
// ユーザーを作成
const newUser = userModel.create('john_doe', 'hashedPassword', 1);
// { id: 1, username: 'john_doe', password: '...', totalStudyTime: 0, rank_id: 1, ... }

// ユーザーIDで取得
const user = userModel.getById(1);

// ユーザー名で取得
const user = userModel.getByUsername('john_doe');

// すべてのユーザーを取得
const allUsers = userModel.getAll();

// ユーザー情報を更新
const updated = userModel.update(1, { 
    password: 'newPassword', 
    rank_id: 2 
});

// 総勉強時間を増加
const updated = userModel.addStudyTime(1, 60); // 60分追加

// ランクを更新
const updated = userModel.updateRank(1, 2);

// ランキングを取得（上位10名）
const ranking = userModel.getRanking(10);

// ユーザーを削除
userModel.delete(1);
```

### StudyRecord モデル

```javascript
// 勉強記録を作成
const record = recordModel.create(
    1,                      // user_id
    '数学',                 // subject
    60,                     // studyTime (分)
    '2026-06-03',          // studyDate
    ' プログラミング'       // category
);
// { recordId: 1, user_id: 1, subject: '数学', studyTime: 60, ... }

// 記録IDで取得
const record = recordModel.getById(1);

// ユーザーのすべての記録を取得
const records = recordModel.getByUserId(1);

// ページング付きで取得
const records = recordModel.getByUserId(1, {
    limit: 20,
    offset: 0,
    orderBy: 'studyDate DESC'
});

// 日付範囲で取得
const records = recordModel.getByDateRange(1, '2026-05-01', '2026-06-03');

// カテゴリで検索
const records = recordModel.getByCategory(1, 'プログラミング');

// 科目で検索
const records = recordModel.getBySubject(1, '数学');

// 記録を更新
const updated = recordModel.update(1, {
    studyTime: 90,
    category: '英語'
});

// 総勉強時間を計算
const totalTime = recordModel.getTotalStudyTime(1); // 150

// 日別の勉強時間（集計）
const dailyStats = recordModel.getDailyStudyTime(1);
// [
//   { studyDate: '2026-06-03', totalTime: 150, recordCount: 2 },
//   { studyDate: '2026-06-02', totalTime: 120, recordCount: 1 }
// ]

// カテゴリ別の勉強時間（集計）
const categoryStats = recordModel.getCategoryStudyTime(1);
// [
//   { category: 'プログラミング', totalTime: 150, recordCount: 2 },
//   { category: null, totalTime: 120, recordCount: 1 }
// ]

// 科目別の勉強時間（集計）
const subjectStats = recordModel.getSubjectStudyTime(1);
// [
//   { subject: '数学', totalTime: 150, recordCount: 2 },
//   { subject: '英語', totalTime: 120, recordCount: 1 }
// ]

// 記録を削除
recordModel.delete(1);
```

---

## 📊 データベーススキーマ

### Ranks テーブル

```sql
CREATE TABLE ranks (
    rankId INTEGER PRIMARY KEY AUTOINCREMENT,
    rankName TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
)
```

### Users テーブル

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    totalStudyTime INTEGER DEFAULT 0,
    rank_id INTEGER,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (rank_id) REFERENCES ranks(rankId)
)
```

### StudyRecords テーブル

```sql
CREATE TABLE study_records (
    recordId INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT,
    studyTime INTEGER NOT NULL,
    studyDate DATE NOT NULL,
    category TEXT,
    user_id INTEGER NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

---

## 🔗 リレーション

```
Ranks (1) ←→ (Many) Users
Users (1) ←→ (Many) StudyRecords
```

---

## ✨ 主な特徴

✅ **自動タイムスタンプ** - createdAt, updatedAt は自動管理  
✅ **エラーハンドリング** - すべての操作がエラーハンドリング対応  
✅ **集計機能** - 日別、カテゴリ別、科目別の勉強時間集計  
✅ **ランキング機能** - 総勉強時間でランキング取得  
✅ **検索機能** - 日付範囲、カテゴリ、科目での検索  
✅ **ページング対応** - 大量データのページング対応  

---

## 🎯 Java との対応表

| Java | Node.js | 説明 |
|------|---------|------|
| Rank | Rank.js | ランク管理 |
| User | User.js | ユーザー管理 |
| StudyRecord | StudyRecord.js | 勉強記録管理 |
| @PrePersist/@PreUpdate | SQLite DEFAULT CURRENT_TIMESTAMP | 自動タイムスタンプ |
| JpaRepository |各モデルのメソッド | CRUD操作 |

---

## 📝 使用上の注意

- すべてのモデルはインスタンスベースです
- エラーはthrow されるので、try-catchで対応してください
- パスワードは必ずハッシュ化してください
- 日付はYYYY-MM-DD形式で統一してください
