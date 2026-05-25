// ===== グローバル変数 =====
let startTime; // タイマー開始時刻を保存
let elapsedTime = 0; // 累積経過時間（ミリ秒）
let timerInterval; // setIntervalのID

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
    startTime = Date.now(); // 開始時刻を記録
    timerInterval = setInterval(updateTime, 1000); // 1秒ごとに表示更新
};

// ===== ストップボタンのイベントハンドラー =====
document.getElementById('stop').onclick = () => {
    clearInterval(timerInterval); // タイマーを停止
    elapsedTime += Date.now() - startTime; // 経過時間を累積に追加
};

// ===== リセットボタンのイベントハンドラー =====
document.getElementById('reset').onclick = () => {
    clearInterval(timerInterval); // タイマーを停止
    elapsedTime = 0; // 累積時間をリセット
    document.getElementById('time').textContent = '00:00:00'; // 表示をリセット
};

// ===== 学習時間送信関数 =====
/**
 * 累積された学習時間をサーバーに送信する
 * 経過時間をミリ秒から分に変換してPOST
 */
function sendStudyTime() {
    // ミリ秒を分に変換
    const minutes = Math.floor(elapsedTime / 60000);

    // サーバーのAPIエンドポイントに学習時間を送信
    fetch('/api/study-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            study_time: minutes,
        }),
    });
}
