(() => {
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        const tbody = document.getElementById('ranking-tbody');
        const userRankEl = document.getElementById('user-rank-value');
        const countdownEl = document.getElementById('countdown-text');
        const topClasses = ['gold', 'silver', 'bronze'];

        let currentUserId = (window.currentUser && window.currentUser.id) || localStorage.getItem('currentUserId') || null;

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
            const res = await fetch('/api/ranking');
            if (!res.ok) throw new Error('no api');
            data = await res.json();
        } catch (e) {
            // フォールバックのダミーデータ（API未実装時）
            data = [
                { id: 'u1', username: 'alice', weeklyMinutes: 3000, league: 'DIAMOND' },
                { id: 'u2', username: 'bob', weeklyMinutes: 2850, league: 'DIAMOND' },
                { id: 'u3', username: 'charlie', weeklyMinutes: 2700, league: 'DIAMOND' },
                { id: 'u4', username: 'david', weeklyMinutes: 2600, league: 'DIAMOND' },
                { id: 'u5', username: 'emma', weeklyMinutes: 2500, league: 'DIAMOND' },
                { id: 'u6', username: 'fumi', weeklyMinutes: 2400, league: 'DIAMOND' },
                { id: 'u7', username: 'george', weeklyMinutes: 2300, league: 'PLATINUM' },
                { id: 'u8', username: 'hana', weeklyMinutes: 2200, league: 'PLATINUM' },
                { id: 'u9', username: 'ikuto', weeklyMinutes: 2100, league: 'PLATINUM' },
                { id: 'u10', username: 'julia', weeklyMinutes: 2000, league: 'PLATINUM' },
                { id: 'u11', username: 'kaito', weeklyMinutes: 1900, league: 'PLATINUM' },
                { id: 'u12', username: 'lina', weeklyMinutes: 1800, league: 'PLATINUM' },
                { id: 'u13', username: 'mika', weeklyMinutes: 1700, league: 'GOLD' },
                { id: 'u14', username: 'naoki', weeklyMinutes: 1600, league: 'GOLD' },
                { id: 'u15', username: 'ohana', weeklyMinutes: 1500, league: 'GOLD' },
                { id: 'u16', username: 'peter', weeklyMinutes: 1400, league: 'GOLD' },
                { id: 'u17', username: 'rina', weeklyMinutes: 1300, league: 'GOLD' },
                { id: 'u18', username: 'shun', weeklyMinutes: 1200, league: 'GOLD' },
                { id: 'u19', username: 'taku', weeklyMinutes: 1100, league: 'SILVER' },
                { id: 'u20', username: 'umi', weeklyMinutes: 1000, league: 'SILVER' },
                { id: 'u21', username: 'yuki', weeklyMinutes: 950, league: 'SILVER' },
                { id: 'u22', username: 'zara', weeklyMinutes: 900, league: 'SILVER' },
                { id: 'u23', username: 'aki', weeklyMinutes: 850, league: 'SILVER' },
                { id: 'u24', username: 'bari', weeklyMinutes: 800, league: 'SILVER' },
                { id: 'u25', username: 'chika', weeklyMinutes: 750, league: 'BRONZE' },
                { id: 'u26', username: 'dori', weeklyMinutes: 700, league: 'BRONZE' },
                { id: 'u27', username: 'eri', weeklyMinutes: 650, league: 'BRONZE' },
                { id: 'u28', username: 'fumiya', weeklyMinutes: 600, league: 'BRONZE' },
                { id: 'u29', username: 'goro', weeklyMinutes: 550, league: 'BRONZE' },
                { id: 'u30', username: 'hanao', weeklyMinutes: 500, league: 'BRONZE' }
            ];
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
                if (currentUserId && (item.id === currentUserId || item.userId === currentUserId)) {
                    tr.classList.add('highlight-row');
                    foundRank = idx + 1;
                    userTier = item.league || item.rank || item.tier || 'GOLD';
                }

                tbody.appendChild(tr);
            });

            // `あなたのランク` 表示を更新（画像は使わずテキストで表示）
            ['tier-bronze', 'tier-silver', 'tier-gold', 'tier-platinum', 'tier-diamond'].forEach(c => userRankEl.classList.remove(c));
            const displayTier = (foundRank && userTier) ? userTier : 'GOLD';
            const tierKey = displayTier.toLowerCase();
            userRankEl.textContent = displayTier;
            userRankEl.classList.add(`tier-${tierKey}`);
        }
    }
})();
