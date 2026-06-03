// ===== グローバル変数 =====
let startTime; // タイマー開始時刻を保存
let elapsedTime = 0; // 累積経過時間（ミリ秒）
let timerInterval; // setIntervalのID
let isRunning = false; // タイマー実行中フラグ

// ===== 日付と時刻を更新する関数 =====
/**
 * 現在の日付と時刻をページに表示する
 */
function updateDateTime() {
    const now = new Date();

    // 日付をフォーマット（YYYY/MM/DD(曜日)）
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = daysOfWeek[now.getDay()];
    const dateString = `${year}/${month}/${date} ${day}`;

    // 時刻をフォーマット（HH:MM）
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // DOM要素に表示
    document.getElementById('currentDate').textContent = dateString;
    document.getElementById('currentTime').textContent = timeString;
}

// ===== タイマー表示更新関数 =====
/**
 * 経過時間を画面に表示する
 * 1秒ごとに呼ばれて、HH:MM:SS形式で時間を更新
 */
function updateTime() {
    const now = Date.now();
    // 前回の累積時間と現在の経過時間を合計
    const diff = now - startTime + elapsedTime;

    // 経過時間から秒、分、時を計算
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    // DOM要素に時間を表示（2桁のゼロパディング）
    document.getElementById('time').textContent =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;
}

// ===== スタートボタンのイベントハンドラー =====
document.getElementById('start').onclick = () => {
    if (!isRunning) {
        startTime = Date.now(); // 開始時刻を記録
        timerInterval = setInterval(updateTime, 1000); // 1秒ごとに表示更新
        isRunning = true;
    }
};

// ===== ストップボタンのイベントハンドラー =====
document.getElementById('stop').onclick = () => {
    if (isRunning) {
        clearInterval(timerInterval); // タイマーを停止
        elapsedTime += Date.now() - startTime; // 経過時間を累積に追加
        isRunning = false;
    }
};

// ===== リセットボタンのイベントハンドラー =====
document.getElementById('reset').onclick = () => {
    clearInterval(timerInterval); // タイマーを停止
    elapsedTime = 0; // 累積時間をリセット
    isRunning = false;
    document.getElementById('time').textContent = '00:00:00'; // 表示をリセット
};

// ===== 登録ボタンのイベントハンドラー =====
document.getElementById('send').onclick = sendStudyTime;

// ===== 初期化：ページ読み込み時に日付時刻を表示 =====
window.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    // 毎分、日付と時刻を更新
    setInterval(updateDateTime, 60000);
});
