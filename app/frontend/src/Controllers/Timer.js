// ===== 学習時間送信関数 =====
/**
 * 累積された学習時間をサーバーに送信する
 * 日付、勉強内容、経過時間をまとめてPOST
 */
function sendStudyTime() {
    // バリデーション：勉強内容が選択されているか
    const studyTag = document.getElementById('studyTag').value;
    if (!studyTag) {
        alert('勉強内容を選択してください');
        return;
    }

    // 日付と時刻情報を取得
    const now = new Date();
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = daysOfWeek[now.getDay()];
    const studyDate = `${year}-${month}-${date}`;

    // 時刻を取得
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const studyTime = `${hours}:${minutes}`;

    // 学習時間（ミリ秒を分に変換）
    const durationMinutes = Math.floor(elapsedTime / 60000);

    // データベースに送信するデータ
    const submitData = {
        study_date: studyDate,
        study_time: studyTime,
        duration_minutes: durationMinutes,
        study_tag: studyTag,
        study_time_ms: elapsedTime,
    };

    // サーバーのAPIエンドポイントに学習情報を送信
    fetch('/api/study-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
    })
        .then((response) => {
            if (response.ok) {
                alert('学習記録を登録しました！');
                // 登録後にリセット
                document.getElementById('reset').click();
            } else {
                alert('登録に失敗しました。もう一度お試しください。');
            }
        })
        .catch((error) => {
            console.error('送信エラー:', error);
            alert('通信エラーが発生しました。');
        });
}
