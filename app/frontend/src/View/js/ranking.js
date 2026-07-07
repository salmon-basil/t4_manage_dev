(() => {
    const RANKING_API_BASE = 'http://localhost:3000/api/rankings';
    const STUDY_API_BASE = 'http://localhost:3000/api/study-records';

    const RANK_INFO = {
        1: { cls: 'tier-bronze',   img: 'bronze.png',   label: 'BRONZE' },
        2: { cls: 'tier-silver',   img: 'silver.png',   label: 'SILVER' },
        3: { cls: 'tier-gold',     img: 'gold.png',     label: 'GOLD' },
        4: { cls: 'tier-platinum', img: 'platinum.png', label: 'PLATINUM' },
        5: { cls: 'tier-diamond',  img: 'diamond.png',  label: 'DIAMOND' },
    };

    // 自分のリーグ・現在のrank（初回のランキング取得時に設定される）
    let myLeague = null;
    let myRank = null;

    document.addEventListener('DOMContentLoaded', () => {
        const countdownEl = document.getElementById('countdown-text');
        updateCountdown(countdownEl);
        setInterval(() => updateCountdown(countdownEl), 60000);

        // admin以外には検証用ボタン（ランク更新・ランダム学習時間追加）を見せない
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const isAdmin = storedUser && storedUser.username === 'admin';
        if (isAdmin) {
            document.querySelectorAll('.admin-only').forEach((el) => {
                el.classList.remove('admin-only');
            });
        }

        const updateBtn = document.getElementById('rank-update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', async () => {
                updateBtn.disabled = true;
                updateBtn.textContent = '更新中...';
                try {
                    const res = await fetch(`${RANKING_API_BASE}/update`, { method: 'POST' });
                    if (!res.ok) throw new Error('update failed');
                    await renderRanking();
                } catch (e) {
                    console.error('ランク更新に失敗しました', e);
                    alert('ランク更新に失敗しました');
                } finally {
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'ランクを更新する';
                }
            });
        }

        const randomStudyBtn = document.getElementById('random-study-btn');
        if (randomStudyBtn) {
            randomStudyBtn.addEventListener('click', async () => {
                randomStudyBtn.disabled = true;
                randomStudyBtn.textContent = '追加中...';
                try {
                    const res = await fetch(`${STUDY_API_BASE}/random-all`, { method: 'POST' });
                    if (!res.ok) throw new Error('random study add failed');
                    await renderRanking();
                } catch (e) {
                    console.error('ランダム学習時間の追加に失敗しました', e);
                    alert('ランダム学習時間の追加に失敗しました');
                } finally {
                    randomStudyBtn.disabled = false;
                    randomStudyBtn.textContent = '勉強時間をランダムで追加';
                }
            });
        }

        document.querySelectorAll('.rank-tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                const rank = Number(btn.dataset.rank);
                setActiveTab(rank);
                loadRankTable(rank);
            });
        });

        renderRanking();
    });

    function setActiveTab(rank) {
        document.querySelectorAll('.rank-tab').forEach((btn) => {
            btn.classList.toggle('active', Number(btn.dataset.rank) === rank);
        });
    }

    // 「あなたのランク: ◯◯◯」の文字表示は常に自分の実際のrankを示す（タブでは変わらない）
    function updateMyRankText(rank) {
        const userRankEl = document.getElementById('user-rank-value');
        if (!userRankEl) return;
        const info = RANK_INFO[rank] || { cls: 'tier-bronze', img: 'bronze.png', label: '---' };
        Object.values(RANK_INFO).forEach((v) => userRankEl.classList.remove(v.cls));
        userRankEl.textContent = info.label;
        userRankEl.classList.add(info.cls);
    }

    // バッジ画像は今見ているランキングのrankに合わせて変わる
    function updateRankImage(rank) {
        const rankImg = document.querySelector('.user-rank-top-img');
        if (!rankImg) return;
        const info = RANK_INFO[rank] || { cls: 'tier-bronze', img: 'bronze.png', label: '---' };
        rankImg.src = `../../../../../public/${info.img}`;
        rankImg.alt = info.label;
    }

    // ページ全体の配色を、今見ているランキングのrankに合わせて変える
    function applyRankTheme(rank) {
        const page = document.querySelector('.ranking-page');
        if (!page) return;
        for (let r = 1; r <= 5; r++) {
            page.classList.remove(`rank-theme-${r}`);
        }
        if (RANK_INFO[rank]) {
            page.classList.add(`rank-theme-${rank}`);
        }
    }

    async function renderRanking() {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const currentUserId = storedUser && storedUser.id ? storedUser.id : null;

        if (!currentUserId) return;

        let data = [];
        try {
            const res = await fetch(`${RANKING_API_BASE}?userId=${currentUserId}`);
            if (!res.ok) throw new Error('API error');
            data = await res.json();
        } catch (e) {
            console.error('ランキング取得に失敗しました', e);
        }

        // 自分のエントリから league・rank（1〜5）を取得しておく
        const myEntry = data.find((item) => Number(item.userId) === Number(currentUserId));
        myLeague = myEntry ? myEntry.league : null;
        myRank = myEntry ? myEntry.rank : null;

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

        // タブは自分のrankを初期選択にして、まず自分のランキングを描画
        setActiveTab(myRank);
        updateMyRankText(myRank);
        updateRankImage(myRank);
        applyRankTheme(myRank);
        renderTable(data, currentUserId);
    }

    // 他のrankのボタンが押された時に、そのrankのランキングを取得して表示する
    async function loadRankTable(rank) {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const currentUserId = storedUser && storedUser.id ? storedUser.id : null;

        let data = [];
        try {
            const params = new URLSearchParams({ rank: String(rank) });
            if (myLeague) params.set('league', myLeague);
            const res = await fetch(`${RANKING_API_BASE}?${params.toString()}`);
            if (!res.ok) throw new Error('API error');
            data = await res.json();
        } catch (e) {
            console.error('ランキング取得に失敗しました', e);
        }

        updateRankImage(rank);
        applyRankTheme(rank);
        renderTable(data, currentUserId);
    }

    // ランキングテーブルの描画（自分のrank／他のrankどちらでも共通で使う）
    function renderTable(data, currentUserId) {
        const tbody = document.getElementById('ranking-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const n = data.length;
        const topCount = Math.ceil(n * 0.25);
        const bottomStart = Math.max(topCount, n - Math.ceil(n * 0.25));

        // このテーブルは「同じリーグ・同じrank」のユーザーのみで構成されているため、
        // 全行が同じrank値を持つ。rank=5は昇格しても頭打ち、rank=1は降格しても底打ちで
        // 実際には何も起きないため、その場合は昇格圏・降格圏の色を付けない。
        const cohortRank = n > 0 ? Number(data[0].rank) : null;
        const promotionIsNoOp = cohortRank !== null && cohortRank >= 5;
        const demotionIsNoOp = cohortRank !== null && cohortRank <= 1;

        if (n === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = 'データがありません';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        data.forEach((item, idx) => {
            const tr = document.createElement('tr');

            const rankTd = document.createElement('td');
            rankTd.textContent = `${idx + 1}位`;
            const nameTd = document.createElement('td');
            nameTd.textContent = item.username;
            const pointsTd = document.createElement('td');
            pointsTd.textContent = item.weeklyMinutes;

            if (!promotionIsNoOp && idx < topCount) tr.classList.add('top-zone');
            else if (!demotionIsNoOp && idx >= bottomStart) tr.classList.add('bottom-zone');

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
