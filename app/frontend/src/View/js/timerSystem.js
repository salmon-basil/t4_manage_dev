// ===== グローバル変数 =====
let startTime; // タイマー開始時刻を保存
let elapsedTime = 0; // 累積経過時間（ミリ秒）
let timerInterval; // setIntervalのID
let isRunning = false; // タイマー実行中フラグ
let rankProgress = null; // サーバーから取得したランク進捗の基準値

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

    updateRankProgressDisplay();
}

// ===== ランク進捗取得関数 =====
/**
 * サーバーから現在のランク進捗（昇格/維持の基準値）を取得する
 */
async function loadRankProgress() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/rankings/status/${user.id}`);
        if (!response.ok) {
            throw new Error('ランク状況の取得に失敗しました');
        }
        rankProgress = await response.json();
    } catch (error) {
        console.error(error);
        rankProgress = null;
    }

    updateRankProgressDisplay();
}

// ===== ランク進捗表示更新関数 =====
/**
 * これまでの週間勉強時間＋現在のタイマー経過時間から、
 * 昇格まで／ランク維持まであと何分必要かを表示する
 */
function updateRankProgressDisplay() {
    const el = document.getElementById('rank-progress');
    if (!el) {
        return;
    }

    if (!rankProgress) {
        el.textContent = 'ランク状況を取得できませんでした';
        return;
    }

    const runningMs = isRunning ? Date.now() - startTime : 0;
    const sessionMinutes = Math.floor((elapsedTime + runningMs) / 60000);
    const liveWeeklyMinutes = (rankProgress.weeklyMinutes || 0) + sessionMinutes;

    if (rankProgress.zone === 'bottom') {
        const threshold = rankProgress.maintainThresholdMinutes;
        const needed =
            threshold === null ? 0 : Math.max(0, threshold - liveWeeklyMinutes + 1);
        el.textContent =
            needed > 0
                ? `現在のランクを維持するには、あと${needed}分の勉強が必要です`
                : 'ランク維持圏内に入りました！';
        return;
    }

    if (rankProgress.atMaxRank) {
        el.textContent = '既に最高ランクです';
        return;
    }

    if (rankProgress.zone === 'top') {
        el.textContent = '昇格圏内です！このまま今週を終えれば昇格できます';
        return;
    }

    const threshold = rankProgress.promotionThresholdMinutes;
    const needed =
        threshold === null ? 0 : Math.max(0, threshold - liveWeeklyMinutes + 1);
    el.textContent =
        needed > 0
            ? `上のランクに上がるには、あと${needed}分の勉強が必要です`
            : '昇格圏内に入りました！';
}

// ===== スタートボタンのイベントハンドラー =====
document.getElementById('start').onclick = () => {
    if (!isRunning) {
        startTime = Date.now(); // 開始時刻を記録
        timerInterval = setInterval(updateTime, 1000); // 1秒ごとに表示更新
        isRunning = true;
        saveState();
        updateRankProgressDisplay();
    }
};

// ===== ストップボタンのイベントハンドラー =====
document.getElementById('stop').onclick = () => {
    if (isRunning) {
        clearInterval(timerInterval); // タイマーを停止
        elapsedTime += Date.now() - startTime; // 経過時間を累積に追加
        isRunning = false;
        saveState();
        updateRankProgressDisplay();
    }
};

// ===== リセットボタンのイベントハンドラー =====
document.getElementById('reset').onclick = () => {
    clearInterval(timerInterval); // タイマーを停止
    elapsedTime = 0; // 累積時間をリセット
    isRunning = false;
    localStorage.removeItem('timer');
    document.getElementById('time').textContent = '00:00:00'; // 表示をリセット
    updateRankProgressDisplay();
};

// ===== 登録ボタンのイベントハンドラー =====
document.getElementById('send').onclick = sendStudyTime;

// ===== 初期化：ページ読み込み時に日付時刻を表示 =====
window.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    // 毎分、日付と時刻を更新
    setInterval(updateDateTime, 60000);
    loadRankProgress();
});

// ===== タブ切り替え時の自動停止・再開 =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // タブ離脱 → 停止
        if (isRunning) {
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
            isRunning = false;
            saveState();
        }
    } else {
        // タブ復帰 → 再開
        if (!isRunning && elapsedTime > 0) {
            startTime = Date.now();
            timerInterval = setInterval(updateTime, 1000);
            isRunning = true;
            saveState();
        }
    }
});

// ===== ローカルストレージ保存 =====
function saveState() {
    localStorage.setItem(
        'timer',
        JSON.stringify({
            startTime,
            elapsedTime,
            isRunning,
        })
    );
}

function debugSend() {
    elapsedTime = 60000; // 強制1分
    sendStudyTime();
}
