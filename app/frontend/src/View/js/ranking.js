(() => {
    document.addEventListener('DOMContentLoaded', init);
    const RANKING_API_BASE = 'http://localhost:3000/api/rankings';

    async function init() {
        const tbody = document.getElementById('ranking-tbody');
        const userRankEl = document.getElementById('user-rank-value');
        const countdownEl = document.getElementById('countdown-text');
        const topClasses = ['gold', 'silver', 'bronze'];

        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const currentUserId =
            (window.currentUser && window.currentUser.id) ||
            (storedUser && storedUser.id) ||
            localStorage.getItem('currentUserId') ||
            null;

        // 月曜0:00までのカウントダウンを表示
        function updateCountdown() {
            const now = new Date();
            const currentDay = now.getDay(); // 0 = 日曜, 1 = 月曜, ...
            
            let nextMonday = new Date(now);
            nextMonday.setHours(0, 0, 0, 0);
            
            // 月曜日まで何日か計算
            const daysUntilMonday = (1 - currentDay + 7) % 7 || 7;
            nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
            
            const diff = nextMonday - now;
            if (diff <= 0) {
                countdownEl.textContent = 'ランク更新: 0日0時間';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            countdownEl.textContent = `ランク更新まで: ${days}日${hours}時間`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // 1分ごとに更新

        let data = [];
        try {
            const url = `${RANKING_API_BASE}?league=else&rank=1`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('no api');
            data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                const fallbackRes = await fetch(RANKING_API_BASE);
                if (!fallbackRes.ok) throw new Error('no fallback api');
                const fallbackData = await fallbackRes.json();
                data = Array.isArray(fallbackData)
                    ? fallbackData.filter((item) => item.rank === 1 || item.league === 'else')
                    : [];
            }
        } catch (e) {
            console.error('ランキング取得に失敗しました。app.db から取得できるようにサーバーを確認してください。', e);
            data = [];
        }

        // weeklyMinutesで降順ソート
        data.sort((a, b) => (b.weeklyMinutes || b.points || 0) - (a.weeklyMinutes || a.points || 0));

        // 上位3名を要約カードへ表示
        for (let i = 0; i < 3; i++) {
            const card = document.querySelector(`.summary-card.${topClasses[i]}`);
            const item = data[i];
            if (card) {
                const nameEl = card.querySelector('.top-name');
                const pointsEl = card.querySelector('.top-points');
                if (item) {
                    if (nameEl) nameEl.textContent = item.username;
                    if (pointsEl) pointsEl.textContent = (item.weeklyMinutes ?? item.points) + 'pt';
                } else {
                    if (nameEl) nameEl.textContent = 'ー';
                    if (pointsEl) pointsEl.textContent = 'データなし';
                }
            }
        }

        // テーブルに全件表示
        if (tbody) {
            tbody.innerHTML = '';
            let foundRank = null;
            let userTier = null;

            const n = data.length;
            const topCount = Math.ceil(n * 0.25);
            const bottomStartIndex = n - topCount;

            data.forEach((item, idx) => {
                const tr = document.createElement('tr');
                const rankTd = document.createElement('td');
                rankTd.textContent = (idx + 1) + '位';
                const nameTd = document.createElement('td');
                nameTd.textContent = item.username;
                const pointsTd = document.createElement('td');
                pointsTd.textContent = item.weeklyMinutes ?? item.points;

                if (idx < topCount) {
                    tr.classList.add('top-zone');
                } else if (idx >= bottomStartIndex) {
                    tr.classList.add('bottom-zone');
                }

                tr.appendChild(rankTd);
                tr.appendChild(nameTd);
                tr.appendChild(pointsTd);

                // 現在ユーザーの行をハイライト
                if (currentUserId && Number(item.userId) === Number(currentUserId)) {
                    tr.classList.add('highlight-row');
                    foundRank = idx + 1;
                    userTier = item.league || item.rank || item.tier || 'else';
                }

                tbody.appendChild(tr);
            });

            // `あなたのランク` 表示を更新（画像は使わずテキストで表示）
            ['tier-bronze', 'tier-silver', 'tier-gold', 'tier-platinum', 'tier-diamond'].forEach(c => userRankEl.classList.remove(c));
            userRankEl.textContent = 'BRONZE';
            userRankEl.classList.add('tier-bronze');
        }
    }
})();
