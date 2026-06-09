// 必要なライブラリの読み込み
const express = require("express"); // サーバーフレームワーク
const Database = require("better-sqlite3"); // SQLite操作
const cors = require("cors"); // CORS対応（別ドメイン通信許可）
const path = require("path"); // パス操作

// Expressアプリ作成
const app = express();

// ミドルウェア設定
app.use(cors()); // フロントからのアクセスを許可
app.use(express.json()); // JSON形式のリクエストを扱えるようにする
// 公開ディレクトリを静的に提供（/public/<file> で参照可能）
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/CSS', express.static(path.join(__dirname, '..', 'frontend', 'src', 'View', 'CSS')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'src', 'View', 'js')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'src', 'View', 'HTML')));

// ==============================
// データベース接続
// ==============================

// data.db ファイルに接続（存在しなければ自動生成）
const db = new Database(path.join(__dirname, "data.db"));

// APIの参照
app.use("/api/user", require("./routes/user")(db));
app.use("/api/study", require("./routes/study")(db));
app.use("/api/ranking", require("./routes/ranking")(db));

// ==============================
// データベース初期化（テーブル作成）
// ==============================

function initDatabase() {
    db.exec(`
    -- ユーザーテーブル
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ユーザーID
      username TEXT UNIQUE NOT NULL,         -- ユーザー名（重複不可）
      password TEXT NOT NULL,                -- パスワード（※本来はハッシュ化必須）
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 学習記録テーブル
    CREATE TABLE IF NOT EXISTS StudyRecord (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,              -- ユーザーID（外部キー）
      studyDate DATE NOT NULL,              -- 学習日
      studyMinutes INTEGER NOT NULL,        -- 学習時間（分）
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );

    -- ランキングテーブル
    CREATE TABLE IF NOT EXISTS Rank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,                
      weeklyMinutes INTEGER DEFAULT 0,        
      rank INTEGER,                           -- ランク(1-5)
      league TEXT NOT NULL,                   -- リーグ名（未定義）
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
);
  `);

    console.log("✅ データベーステーブルが作成されました");
}

// ==============================
// サーバー起動
// ==============================

const PORT = 3000;

// 起動時にテーブル作成
initDatabase();

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
});
