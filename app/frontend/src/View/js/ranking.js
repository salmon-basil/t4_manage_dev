(() => {
    document.addEventListener('DOMContentLoaded', init);
    const RANKING_API_BASE = 'http://localhost:3000/api/rankings';

    const LEAGUE_INFO = {
        DIAMOND: { cls: 'tier-diamond', img: 'diamond.png', label: 'DIAMOND' },
        PLATINUM: { cls: 'tier-platinum', img: 'platinum.png', label: 'PLATINUM' },
        GOLD: { cls: 'tier-gold', img: 'gold.png', label: 'GOLD' },
        SILVER: { cls: 'tier-silver', img: 'silver.png', label: 'SILVER' },
        BRONZE: { cls: 'tier-bronze', img: 'bronze.png', label: 'BRONZE' },
    };

    async function init() {
        const tbody = document.getElementById('ranking-tbody');
        const userRankEl = document.getElementById('user-rank-value');
        const rankImg = document.querySelector('.user-rank-top-img');
        const countdownEl = document.getElementById('countdown-text');

        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const currentUserId = storedUser && storedUser.id ? storedUser.id : null;

        updateCountdown(countdownEl);
        setInterval(() => updateCountdown(countdownEl), 60000);

        const updateBtn = document.getElementById('rank-update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', async () => {
                updateBtn.disabled = true;
                updateBtn.textContent = '更新中...';
                try {
                    const res = await fetch(`${RANKING_API_BASE}/update`, { method: 'POST' });
                    if (!res.ok) throw new Error('update failed');
                    await init();
                } catch (e) {
                    console.error('ランク更新に失敗しました', e);
                    alert('ランク更新に失敗しました');
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'ランクを更新する';
                }
            });
        }

        if (!currentUserId) {
            if (countdownEl) countdownEl.textContent = 'ログインが必要です';
            return;
        }

        let data = [];
        try {
            const res = await fetch(`${RANKING_API_BASE}?userId=${currentUserId}`);
            if (!res.ok) throw new Error('API error');
            data = await res.json();
        } catch (e) {
            console.error('ランキング取得に失敗しました', e);
        }

        // 自分のエントリからリーグを取得
        const myEntry = data.find((item) => Number(item.userId) === Number(currentUserId));
        const myLeague = myEntry ? myEntry.league : null;
        const info = LEAGUE_INFO[myLeague] || { cls: 'tier-bronze', img: 'bronze.png', label: '---' };

        // バッジ・画像を更新
        Object.values(LEAGUE_INFO).forEach((v) => userRankEl.classList.remove(v.cls));
        userRankEl.textContent = info.label;
        userRankEl.classList.add(info.cls);
        if (rankImg) {
            rankImg.src = `../../../../../public/${info.img}`;
            rankImg.alt = info.label;
        }

        // 上位3名のサマリーカード
        const topClasses = ['gold', 'silver', 'bronze'];
        for (let i = 0; i < 3; i++) {
            const card = document.querySelector(`.summary-card.${topClasses[i]}`);
            if (!card) continue;
            const nameEl = card.querySelector('.top-name');
            const pointsEl = card.querySelector('.top-points');
            const item = data[i];
            if (item) {
                if (nameEl) nameEl.textContent = item.username;
                if (pointsEl) pointsEl.textContent = item.weeklyMinutes + 'pt';
            } else {
                if (nameEl) nameEl.textContent = 'ー';
                if (pointsEl) pointsEl.textContent = 'データなし';
            }
        }

        // ランキングテーブル
        if (!tbody) return;
        tbody.innerHTML = '';
        const n = data.length;
        const topCount = Math.ceil(n * 0.25);
        const bottomStart = n - topCount;

        data.forEach((item, idx) => {
            const tr = document.createElement('tr');

            const rankTd = document.createElement('td');
            rankTd.textContent = `${idx + 1}位`;
            const nameTd = document.createElement('td');
            nameTd.textContent = item.username;
            const pointsTd = document.createElement('td');
            pointsTd.textContent = item.weeklyMinutes;

            if (idx < topCount) tr.classList.add('top-zone');
            else if (idx >= bottomStart) tr.classList.add('bottom-zone');

            if (Number(item.userId) === Number(currentUserId)) {
                tr.classList.add('highlight-row');
            }

            tr.appendChild(rankTd);
            tr.appendChild(nameTd);
            tr.appendChild(pointsTd);
            tbody.appendChild(tr);
        });
    }

    function updateCountdown(el) {
        if (!el) return;
        const now = new Date();
        const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
        const nextMonday = new Date(now);
        nextMonday.setHours(0, 0, 0, 0);
        nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
        const diff = nextMonday - now;
        if (diff <= 0) {
            el.textContent = 'ランク更新: 0日0時間';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        el.textContent = `ランク更新まで: ${days}日${hours}時間`;
    }
})();
