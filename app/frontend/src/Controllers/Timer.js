const API_BASE = 'http://localhost:3000/api';

function sendStudyTime() {
    const studyTag = document.getElementById('studyTag').value;
    if (!studyTag) {
        alert('勉強内容を選択してください');
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const studyDate = `${year}-${month}-${date}`;
    const durationMinutes = Math.floor(elapsedTime / 60000);
    if (durationMinutes === 0) {
        alert('勉強時間が１分未満のため登録できません');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        alert('ログイン情報がありません');
        return;
    }

    const submitData = {
        userId: user.id,
        studyDate: studyDate,
        studyMinutes: durationMinutes,
    };
    fetch(`${API_BASE}/study-records`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
    })
        .then((response) => {
            if (response.ok) {
                alert('学習記録を登録しました！');
                if (rankProgress) {
                    rankProgress.weeklyMinutes =
                        (rankProgress.weeklyMinutes || 0) + durationMinutes;
                }
                document.getElementById('reset').click();
            } else {
                alert('登録に失敗しました。もう一度お試しください。');
            }
        })
        .catch((error) => {
            alert('通信エラーが発生しました。');
        });
}
