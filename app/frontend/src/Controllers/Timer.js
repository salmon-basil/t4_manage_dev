const API_BASE = 'http://localhost:3000/api/study';
function sendStudyTime() {
    console.log('=== sendStudyTime start ===');

    const now = new Date();

    const studyDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const durationMinutes = Math.floor(elapsedTime / 60000);
    console.log('durationMinutes:', durationMinutes);

    if (durationMinutes === 0) {
        console.warn('1分未満で弾かれた');
        alert('勉強時間が１分未満のため登録できません');
        return;
    }

    const userStr = localStorage.getItem('user');
    console.log('localStorage user:', userStr);

    if (!userStr) {
        console.error('userがlocalStorageに存在しない');
        alert('ログイン情報がありません');
        return;
    }

    const user = JSON.parse(userStr);
    console.log('parsed user:', user);

    if (!user.id) {
        console.error('user.idが存在しない');
        alert('ユーザーIDが取得できません');
        return;
    }

    const submitData = {
        userId: user.id,
        studyDate: studyDate,
        studyMinutes: durationMinutes,
    };

    console.log('送信データ:', submitData);

    fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
    })
        .then(async (response) => {
            console.log('response status:', response.status);

            const data = await response.json().catch(() => null);
            console.log('response body:', data);

            if (response.ok) {
                alert('学習記録を登録しました！');
                document.getElementById('reset').click();
            } else {
                console.error('サーバエラー:', data);
                alert('登録に失敗しました。');
            }
        })
        .catch((err) => {
            console.error('通信エラー:', err);
            alert('通信エラーが発生しました。');
        });
}
