(() => {
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        const tbody = document.getElementById('ranking-tbody');
        const userRankEl = document.getElementById('user-rank-value');
        const topClasses = ['gold', 'silver', 'bronze'];

        let currentUserId = (window.currentUser && window.currentUser.id) || localStorage.getItem('currentUserId') || null;

        let data = [];
        try {
            const res = await fetch('/api/ranking');
            if (!res.ok) throw new Error('no api');
            data = await res.json();
        } catch (e) {
            // フォールバックのダミーデータ（API未実装時）
            data = [
                { id: 'u1', username: 'alice', points: 3000, rank: 'DIAMOND' },
                { id: 'u2', username: 'bob', points: 2850, rank: 'DIAMOND' },
                { id: 'u3', username: 'charlie', points: 2700, rank: 'DIAMOND' },
                { id: 'u4', username: 'david', points: 2600, rank: 'DIAMOND' },
                { id: 'u5', username: 'emma', points: 2500, rank: 'DIAMOND' },
                { id: 'u6', username: 'fumi', points: 2400, rank: 'DIAMOND' },
                { id: 'u7', username: 'george', points: 2300, rank: 'PLATINUM' },
                { id: 'u8', username: 'hana', points: 2200, rank: 'PLATINUM' },
                { id: 'u9', username: 'ikuto', points: 2100, rank: 'PLATINUM' },
                { id: 'u10', username: 'julia', points: 2000, rank: 'PLATINUM' },
                { id: 'u11', username: 'kaito', points: 1900, rank: 'PLATINUM' },
                { id: 'u12', username: 'lina', points: 1800, rank: 'PLATINUM' },
                { id: 'u13', username: 'mika', points: 1700, rank: 'GOLD' },
                { id: 'u14', username: 'naoki', points: 1600, rank: 'GOLD' },
                { id: 'u15', username: 'ohana', points: 1500, rank: 'GOLD' },
                { id: 'u16', username: 'peter', points: 1400, rank: 'GOLD' },
                { id: 'u17', username: 'rina', points: 1300, rank: 'GOLD' },
                { id: 'u18', username: 'shun', points: 1200, rank: 'GOLD' },
                { id: 'u19', username: 'taku', points: 1100, rank: 'SILVER' },
                { id: 'u20', username: 'umi', points: 1000, rank: 'SILVER' },
                { id: 'u21', username: 'yuki', points: 950, rank: 'SILVER' },
                { id: 'u22', username: 'zara', points: 900, rank: 'SILVER' },
                { id: 'u23', username: 'aki', points: 850, rank: 'SILVER' },
                { id: 'u24', username: 'bari', points: 800, rank: 'SILVER' },
                { id: 'u25', username: 'chika', points: 750, rank: 'BRONZE' },
                { id: 'u26', username: 'dori', points: 700, rank: 'BRONZE' },
                { id: 'u27', username: 'eri', points: 650, rank: 'BRONZE' },
                { id: 'u28', username: 'fumiya', points: 600, rank: 'BRONZE' },
                { id: 'u29', username: 'goro', points: 550, rank: 'BRONZE' },
                { id: 'u30', username: 'hanao', points: 500, rank: 'BRONZE' }
            ];
        }

        // ポイントで降順ソート
        data.sort((a, b) => b.points - a.points);

        // 上位3名を要約カードへ表示
        for (let i = 0; i < 3; i++) {
            const card = document.querySelector(`.summary-card.${topClasses[i]}`);
            const item = data[i];
            if (card) {
                const nameEl = card.querySelector('.top-name');
                const pointsEl = card.querySelector('.top-points');
                if (item) {
                    if (nameEl) nameEl.textContent = item.username;
                    if (pointsEl) pointsEl.textContent = item.points + 'pt';
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
                pointsTd.textContent = item.points;

                tr.appendChild(rankTd);
                tr.appendChild(nameTd);
                tr.appendChild(pointsTd);

                if (idx < topCount) {
                    tr.classList.add('top-zone');
                } else if (idx >= bottomStartIndex) {
                    tr.classList.add('bottom-zone');
                }

                // 現在ユーザーの行をハイライト
                if (currentUserId && (item.id === currentUserId || item.userId === currentUserId)) {
                    tr.classList.add('highlight-row');
                    foundRank = idx + 1;
                    userTier = item.rank || item.tier || 'GOLD';
                }

                tbody.appendChild(tr);
            });

            // `あなたのランク` 表示を更新
            ['tier-bronze', 'tier-silver', 'tier-gold', 'tier-platinum', 'tier-diamond'].forEach(c => userRankEl.classList.remove(c));
            if (foundRank && userTier) {
                userRankEl.textContent = userTier;
                userRankEl.classList.add(`tier-${userTier.toLowerCase()}`);
            } else {
                userRankEl.textContent = 'GOLD';
                userRankEl.classList.add('tier-gold');
            }
        }
    }
})();
