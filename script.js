// ================= 1. 完整牌組資料庫 =================
const tarotCards = [
    { id: 0, name: "愚者", filename: "00-TheFool.jpg", upright: "冒險、純真", reversed: "魯莽、疏忽" },
    { id: 1, name: "魔術師", filename: "01-TheMagician.jpg", upright: "創造力、行動", reversed: "溝通不良" },
    { id: 2, name: "女祭司", filename: "02-TheHighPriestess.jpg", upright: "直覺、神秘", reversed: "隱藏動機" },
    { id: 3, name: "女皇", filename: "03-TheEmpress.jpg", upright: "豐饒、母性", reversed: "依賴、受阻" },
    { id: 4, name: "皇帝", filename: "04-TheEmperor.jpg", upright: "權威、結構", reversed: "暴政、剛愎" },
    { id: 5, name: "教皇", filename: "05-TheHierophant.jpg", upright: "傳統、信仰", reversed: "叛逆、挑戰" },
    { id: 6, name: "戀人", filename: "06-TheLovers.jpg", upright: "愛、選擇", reversed: "失和、失衡" },
    { id: 7, name: "戰車", filename: "07-TheChariot.jpg", upright: "意志、行動", reversed: "失控、侵略" },
    { id: 8, name: "力量", filename: "08-Strength.jpg", upright: "勇氣、耐性", reversed: "軟弱、自疑" },
    { id: 9, name: "隱士", filename: "09-TheHermit.jpg", upright: "內省、真理", reversed: "孤立、偏執" },
    { id: 10, name: "命運之輪", filename: "10-WheelOfFortune.jpg", upright: "運氣、變化", reversed: "厄運、中斷" },
    { id: 11, name: "正義", filename: "11-Justice.jpg", upright: "公平、真相", reversed: "不公正、偏見" },
    { id: 12, name: "倒吊人", filename: "12-TheHangedMan.jpg", upright: "暫停、換位", reversed: "拖延、徒勞" },
    { id: 13, name: "死神", filename: "13-Death.jpg", upright: "結束、轉化", reversed: "抗拒、停滯" },
    { id: 14, name: "節制", filename: "14-Temperance.jpg", upright: "平衡、中庸", reversed: "失衡、過度" },
    { id: 15, name: "惡魔", filename: "15-TheDevil.jpg", upright: "束縛、物質", reversed: "覺醒、釋放" },
    { id: 16, name: "高塔", filename: "16-TheTower.jpg", upright: "劇變、崩解", reversed: "避災、恐懼" },
    { id: 17, name: "星星", filename: "17-TheStar.jpg", upright: "希望、靈感", reversed: "絕望、幻滅" },
    { id: 18, name: "月亮", filename: "18-TheMoon.jpg", upright: "不安、恐懼", reversed: "真相大白" },
    { id: 19, name: "太陽", filename: "19-TheSun.jpg", upright: "成功、活力", reversed: "低潮、虛榮" },
    { id: 20, name: "審判", filename: "20-Judgement.jpg", upright: "重生、評估", reversed: "自責、逃避" },
    { id: 21, name: "世界", filename: "21-TheWorld.jpg", upright: "完成、統合", reversed: "未完成、延遲" },

    // 小阿爾克那快速生成（11=侍者 12=騎士 13=皇后 14=國王）
    ...Array.from({length: 14}, (_, i) => ({ id: 22 + i, name: i < 10 ? `聖杯 ${i + 1}` : `聖杯${'侍者騎士皇后國王'.match(/.{2}/g)[i - 10]}`, filename: `Cups${String(i + 1).padStart(2, '0')}.jpg`, upright: "情感", reversed: "冷漠" })),
    ...Array.from({length: 14}, (_, i) => ({ id: 36 + i, name: i < 10 ? `權杖 ${i + 1}` : `權杖${'侍者騎士皇后國王'.match(/.{2}/g)[i - 10]}`, filename: `Wands${String(i + 1).padStart(2, '0')}.jpg`, upright: "行動", reversed: "拖延" })),
    ...Array.from({length: 14}, (_, i) => ({ id: 50 + i, name: i < 10 ? `寶劍 ${i + 1}` : `寶劍${'侍者騎士皇后國王'.match(/.{2}/g)[i - 10]}`, filename: `Swords${String(i + 1).padStart(2, '0')}.jpg`, upright: "理智", reversed: "混亂" })),
    ...Array.from({length: 14}, (_, i) => ({ id: 64 + i, name: i < 10 ? `錢幣 ${i + 1}` : `錢幣${'侍者騎士皇后國王'.match(/.{2}/g)[i - 10]}`, filename: `Pentacles${String(i + 1).padStart(2, '0')}.jpg`, upright: "物質", reversed: "不穩" }))
];

const spreadLibrary = {
    "single": {
        name: "單牌啟示",
        count: 1,
        desc: "適合針對特定問題尋求快速的建議。",
        positions: ["核心啟示"]
    },
    "triangle": {
        name: "聖三角牌陣",
        count: 3,
        desc: "針對目前卡關的狀態，看到事件的真相。",
        positions: ["我以為的狀況", "真實的狀況", "建言"]
    },
    "timeflow": {
        name: "時間之流",
        count: 3,
        desc: "用來分析事情的前因後果。",
        positions: ["過去", "現在", "未來"]
    },
    "core_analysis": {
        name: "直指核心牌陣",
        count: 4,
        desc: "深入分析問題關鍵、阻礙、對策與優勢。",
        positions: ["問題核心", "障礙", "對策", "資源/長處"]
    },
    "choice": {
        name: "二選一牌陣",
        count: 5,
        desc: "當你在兩個選項間猶豫不決時使用。",
        positions: ["現況", "選項 A 的發展", "選項 A 的結果", "選項 B 的發展", "選項 B 的結果"]
    },
    "universal": {
        name: "萬用牌陣",
        count: 3,
        desc: "直覺式三張牌，適用於任何想快速釐清的主題。",
        positions: ["第一張", "第二張", "第三張"]
    }
};

// ================= 2. 變數與狀態管理 =================
let targetCount = 0;
let selectedCards = [];
let shuffledDeck = [];
let currentSpreadKey = "";

function ensureQuestionFilled() {
    const textarea = document.getElementById('user-question');
    if (!textarea) return true;
    const value = textarea.value.trim();
    if (!value) {
        alert("請先輸入你此刻最在意的問題，再開始占卜。");
        textarea.focus();
        return false;
    }
    return true;
}

function spawnMagicBurstAtElement(el, count = 18, radius = 60) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const p = document.createElement('div');
        p.className = 'magic-particle';
        const size = Math.floor(Math.random() * 6) + 4; // 4~9px
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${cx - size / 2}px`;
        p.style.top = `${cy - size / 2}px`;
        p.style.setProperty('--dx', `${dx}px`);
        p.style.setProperty('--dy', `${dy}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 750);
    }
}

// ================= 3. AI 推薦功能 =================
async function askAIForSpread() {
    if (!ensureQuestionFilled()) return;

    const question = document.getElementById('user-question').value.trim();
    const recommendReason = document.getElementById('recommend-reason'); // 需在 HTML 增加此 ID
    
    recommendReason.innerText = "✨ 正在為您分析最適合的牌陣...";

    try {
        const response = await fetch('/api/recommend_spread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        const data = await response.json();
        recommendReason.innerHTML = `✨ AI 建議：<strong>${data.recommendation}</strong>`;
    } catch (error) {
        recommendReason.innerText = "連線失敗，請手動選擇牌陣。";
    }
}

// ================= 4. 頁面控制與初始化 =================
function initMagicStarfield() {
    const canvas = document.getElementById('magic-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    // 自動調整畫布大小
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 建立星塵粒子
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1, // 💡 流動速度
            opacity: Math.random(),
            blink: Math.random() * 0.02
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            // 繪製粒子
            ctx.fillStyle = `rgba(183, 148, 244, ${star.opacity})`; // 使用你的主題紫
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // 💡 讓星空流動：緩慢向下移動
            star.y += star.speed;
            if (star.y > canvas.width) star.y = 0; // 超出邊界回到頂部

            // 💡 讓星星閃爍
            star.opacity += star.blink;
            if (star.opacity > 1 || star.opacity < 0) star.blink *= -1;
        });

        requestAnimationFrame(animate);
    }
    animate();
}
// 在頁面載入後啟動
window.addEventListener('DOMContentLoaded', initMagicStarfield);

function showStage(stageId) {
    document.querySelectorAll('.stage').forEach(stage => stage.classList.add('hidden'));
    const target = document.getElementById(stageId);
    if (target) target.classList.remove('hidden');
}

// --- 修改 startDrawing 增加生成格子的邏輯 ---
function startDrawing(key) {
    if (!ensureQuestionFilled()) return;

    currentSpreadKey = key; // 💡 關鍵：儲存當前牌陣 key
    const spread = spreadLibrary[key];
    if (!spread) return;

    targetCount = spread.count;
    selectedCards = [];

    // 💡 升級：動態切換佈局 Class
    const slotsContainer = document.getElementById('slots-container');
    slotsContainer.className = 'slots-grid'; // 重置
    slotsContainer.classList.add(`layout-${key}`); // 例如 layout-triangle

    // 生成洗牌後的牌組
    shuffledDeck = tarotCards.map(c => c.id).sort(() => Math.random() - 0.5);

    // 生成物理格子
    slotsContainer.innerHTML = ''; 
    spread.positions.forEach((posName, index) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot-${index}`;
        slot.innerHTML = `<span class="slot-label">${posName}</span>`;
        slotsContainer.appendChild(slot);
    });

    // UI 更新
    document.getElementById('active-spread-name').innerText = spread.name;
    document.getElementById('target-count').innerText = targetCount;
    document.getElementById('current-count').innerText = 0;
    const stepEl = document.getElementById('step-number');
    if (stepEl) stepEl.innerText = `STEP 1 / ${targetCount}`;
    const firstPos = spread.positions[0] || "第一張牌";
    document.getElementById('position-description').innerText = `準備抽取：${firstPos}`;

    initDeck();
    showStage('draw-stage');

    // 進入抽牌模式：隱藏標題、縮減版面邊距
    document.body.classList.add('drawing-mode');
    document.querySelector('.container').classList.add('drawing-mode');
}
// ================= 5. 抽牌邏輯與提示更新 =================
function initDeck() {
    const deckContainer = document.getElementById('deck-container');
    deckContainer.innerHTML = ''; 
    const isMobile = window.innerWidth <= 680;
    const cardCount = isMobile ? 28 : 78;
    for (let i = 0; i < cardCount; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-back';
        cardDiv.style.transform = 'rotate(0deg)';
        
        cardDiv.onclick = function() {
            // 💡 修正 1：點擊瞬間就判斷計數，並「預約」下一個格子
            if (selectedCards.length < targetCount) {
                const currentIndex = selectedCards.length;
                
                // 💡 修正 2：立即預先推入資料，避免重複抽同一個格子
                reserveCardSlot(currentIndex); 
                
                // 執行飛行
                animateProxy(this, currentIndex);
            }
        };
        deckContainer.appendChild(cardDiv);
    }

    const cards = deckContainer.querySelectorAll('.card-back');
    performShuffleAnimation(cards, () => {
        fanOutDeck(cards);
        // 洗牌並攤牌完成後，在牌堆中心施放一次魔法粒子
        spawnMagicBurstAtElement(deckContainer, 26, 80);
    });
}

function performShuffleAnimation(cards, onComplete) {
    const rounds = 3;
    let round = 0;
    const doRound = () => {
        cards.forEach(card => {
            const dx = (Math.random() - 0.5) * 22;
            const dy = (Math.random() - 0.5) * 12;
            const angle = (Math.random() - 0.5) * 12;
            card.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}deg)`;
        });
        setTimeout(() => {
            cards.forEach(card => {
                card.style.transform = 'translate(0px, 0px) rotate(0deg)';
            });
            round++;
            if (round < rounds) {
                setTimeout(doRound, 140);
            } else if (onComplete) {
                setTimeout(onComplete, 180);
            }
        }, 180);
    };
    doRound();
}

function fanOutDeck(cards) {
    const total = cards.length;
    if (!total) return;
    const isMobile = window.innerWidth <= 680;
    const maxAngle = isMobile ? 70 : 90;
    cards.forEach((card, index) => {
        const t = total === 1 ? 0.5 : index / (total - 1);
        const angle = (t - 0.5) * maxAngle;
        card.style.transform = `rotate(${angle}deg)`;
    });
}
// 新增：預先佔位邏輯
function reserveCardSlot(index) {
    const cardId = shuffledDeck.pop(); 
    const isReversed = Math.random() > 0.5;
    const spread = spreadLibrary[currentSpreadKey];
    
    selectedCards.push({ 
        id: cardId, 
        isReversed: isReversed, 
        positionName: spread.positions[index] 
    });

    // 立即更新 UI 計數
    document.getElementById('current-count').innerText = selectedCards.length;
    
    // 更新「正在抽取」的提示
    const hintBox = document.getElementById('position-description');
    if (hintBox && selectedCards.length < targetCount) {
        const nextPos = spread.positions[selectedCards.length] || `第 ${selectedCards.length + 1} 張牌`;
        hintBox.innerText = `正在抽取：${nextPos}`;
    }

    const stepEl = document.getElementById('step-number');
    if (stepEl) {
        const nextStep = Math.min(selectedCards.length + 1, targetCount);
        stepEl.innerText = `STEP ${nextStep} / ${targetCount}`;
    }
}
// --- 新增：處理動畫飛行的函數 ---
function animateProxy(originalCard, index) {
    const targetSlot = document.getElementById(`slot-${index}`);
    if (!targetSlot) return;

    originalCard.style.pointerEvents = 'none';
    const startRect = originalCard.getBoundingClientRect();
    const endRect = targetSlot.getBoundingClientRect();

    originalCard.style.visibility = 'hidden';

    const proxy = document.createElement('div');
    proxy.className = 'card-proxy';
    
    // 💡 直接使用 getBoundingClientRect 的絕對值
    proxy.style.left = startRect.left + 'px';
    proxy.style.top = startRect.top + 'px';
    proxy.style.transform = originalCard.style.transform;
    document.body.appendChild(proxy);

    // 強制瀏覽器重繪
    proxy.offsetHeight; 

    requestAnimationFrame(() => {
        proxy.style.left = endRect.left + 'px';
        proxy.style.top = endRect.top + 'px';
        proxy.style.transform = 'rotate(0deg)';
    });

    proxy.addEventListener('transitionend', () => {
        targetSlot.classList.add('is-filled'); 
        proxy.remove(); 
        // 卡片落位時，在目標格子中心施放魔法粒子
        spawnMagicBurstAtElement(targetSlot, 20, 50);
        
        if (selectedCards.length === targetCount) {
            setTimeout(showResults, 800);
        }
    }, { once: true });
}
// --- 修改原有的 drawACard (移除原本的 positionHint) ---
function drawACard() {
    const cardId = shuffledDeck.pop(); 
    const isReversed = Math.random() > 0.5;
    const spread = spreadLibrary[currentSpreadKey];
    
    selectedCards.push({ 
        id: cardId, 
        isReversed: isReversed, 
        positionName: spread.positions[selectedCards.length] 
    });

    document.getElementById('current-count').innerText = selectedCards.length;

    if (selectedCards.length === targetCount) {
    // 讓牌先停留一下，營造儀式感，再淡出
    setTimeout(() => {
        const flyingCards = document.querySelectorAll('.card-back');
        flyingCards.forEach(card => card.classList.add('fade-out'));
        
        // 等淡出完成後再切換到結果頁
        setTimeout(showResults, 500);
    }, 800);
    }
}
// ================= 6. 結果顯示與 AI 呼叫 =================

function showResults() {
    const flyingCards = document.querySelectorAll('.card-back');
    flyingCards.forEach(card => card.remove());

    // 離開抽牌模式，恢復正常版面
    document.body.classList.remove('drawing-mode');
    document.querySelector('.container').classList.remove('drawing-mode');

    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = ''; 

    selectedCards.forEach(item => {
        const cardData = tarotCards.find(c => c.id === item.id);
        const cardEl = document.createElement('div');
        cardEl.className = `card-item ${item.isReversed ? 'is-reversed' : ''}`;
        
        cardEl.innerHTML = `
        <div class="position-label">${item.positionName}</div>
        <div class="card-img-wrapper">
            <img src="assets/cards/${cardData.filename}" alt="${cardData.name}">
        </div>
        <h4>${cardData.name}</h4>
        <p class="position-tag">${item.isReversed ? '逆位' : '正位'}</p>
    `   ;
        resultArea.appendChild(cardEl);

        // 翻牌顯示時，在每張牌的圖片上施放一次魔法粒子
        const imgWrapper = cardEl.querySelector('.card-img-wrapper');
        setTimeout(() => spawnMagicBurstAtElement(imgWrapper, 16, 40), 150);
    });

    showStage('result-stage');
    callAIInterpretation();
}

async function callAIInterpretation() {
    const responseBox = document.getElementById('ai-response');
    responseBox.innerText = "🔮 占卜師正在針對牌位邏輯進行深度解讀...";

    const payload = {
        question: document.getElementById('user-question').value.trim(),
        spreadName: spreadLibrary[currentSpreadKey].name,
        cards: selectedCards.map(item => {
            const data = tarotCards.find(c => c.id === item.id);
            return { 
                positionName: item.positionName, // 傳給後端：問題核心、障礙...
                name: data.name, 
                position: item.isReversed ? '逆位' : '正位' 
            };
        })
    };

    try {
        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.success) {
            displayAIResponse(data.reply); 
        } else {
            responseBox.innerText = "解讀失敗：" + data.error;
        }
    } catch (error) {
        responseBox.innerText = "後端伺服器未啟動";
    }
}

function displayAIResponse(text) {
    const responseBox = document.getElementById('ai-response');
    responseBox.innerText = "";
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            responseBox.innerText += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 25);
}

function restart() {
    // 清除格子填滿狀態
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('is-filled');
        slot.style.background = "";
    });
    // 清空問題欄與 AI 推薦文字
    document.getElementById('user-question').value = "";
    document.getElementById('recommend-reason').innerText = "";
    // 離開抽牌模式
    document.body.classList.remove('drawing-mode');
    document.querySelector('.container').classList.remove('drawing-mode');
    showStage('setup-stage');
}