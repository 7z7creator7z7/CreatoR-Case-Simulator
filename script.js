const tg = window.Telegram.WebApp;
tg.expand();

let balance = parseFloat(localStorage.getItem('balance')) || 16324.05;
let usedPromos = JSON.parse(localStorage.getItem('usedPromos')) || [];

// INITIALIZATION
window.onload = () => {
    updateUI();
    renderCases();
    switchGame('crash');
    if (tg.initDataUnsafe.user?.photo_url) {
        document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
    }
};

function updateUI() {
    document.getElementById('balance').innerText = balance.toLocaleString('en-US', {minimumFractionDigits: 2});
    localStorage.setItem('balance', balance);
}

// 🏠 CASES
const cases = [
    { name: "Armiya", price: 4768, rarity: "armiya" },
    { name: "Taqiqlangan", price: 16115, rarity: "taqiqlangan" },
    { name: "Tasniflangan", price: 62489, rarity: "tasniflangan" },
    { name: "Sir", price: 132415, rarity: "sir" }
];

function renderCases() {
    const list = document.getElementById('case-list');
    list.innerHTML = cases.map(c => `
        <div class="case-card" onclick="openCase(${c.price})">
            <div class="glow" style="background: ${getRarityColor(c.rarity)}"></div>
            <img src="https://bulldrop.uz/static/media/case-preview.png" width="100%">
            <h3>${c.name}</h3>
            <div class="price-tag">${c.price.toLocaleString()} UZS</div>
        </div>
    `).join('');
}

function getRarityColor(r) {
    const colors = { armiya: "#4ade80", taqiqlangan: "#8b5cf6", tasniflangan: "#ec4899", sir: "#ef4444" };
    return colors[r];
}

function openCase(price) {
    if (balance < (price / 12600)) return alert("Mablag' yetarli emas!");
    balance -= (price / 12600);
    updateUI();
    const win = (Math.random() * (price / 12600) * 2).toFixed(2);
    alert(`Siz yutdingiz: ${win} $!`);
    balance += parseFloat(win);
    updateUI();
}

// 🎮 GAMES SWITCHER
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id + '-section').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + id).classList.add('active');
}

function switchGame(game) {
    const area = document.getElementById('game-area');
    document.querySelectorAll('.game-btn-tab').forEach(b => b.classList.remove('active'));
    if (game === 'crash') renderCrash(area);
    if (game === 'mines') renderMines(area);
    if (game === 'upgrade') renderUpgrade(area);
}

// 🚀 CRASH GAME
let crashInt;
function renderCrash(area) {
    area.innerHTML = `
        <div class="game-container">
            <h1 id="mult" style="font-size: 50px; color: var(--accent);">1.00x</h1>
            <input type="number" id="c-bet" placeholder="Tikish ($)">
            <input type="number" id="c-auto" placeholder="Avto-stop (Masalan: 2.0)">
            <button id="c-btn" onclick="startCrash()">TIKISH</button>
        </div>`;
}

function startCrash() {
    const bet = parseFloat(document.getElementById('c-bet').value);
    const auto = parseFloat(document.getElementById('c-auto').value) || 0;
    if (balance < bet) return;
    
    balance -= bet; updateUI();
    let m = 1.0;
    const crashAt = (Math.random() * 5 + 1).toFixed(2);
    document.getElementById('c-btn').innerText = "CASH OUT";
    document.getElementById('c-btn').onclick = () => {
        clearInterval(crashInt);
        balance += bet * m; updateUI();
        alert(`Yutdingiz: ${(bet * m).toFixed(2)}$`);
        resetCrash();
    };

    crashInt = setInterval(() => {
        m += 0.01;
        document.getElementById('mult').innerText = m.toFixed(2) + "x";
        if (auto > 1 && m >= auto) document.getElementById('c-btn').click();
        if (m >= crashAt) {
            clearInterval(crashInt);
            document.getElementById('mult').style.color = "red";
            alert("Crash!");
            resetCrash();
        }
    }, 100);
}

function resetCrash() {
    document.getElementById('c-btn').innerText = "TIKISH";
    document.getElementById('c-btn').onclick = startCrash;
    document.getElementById('mult').style.color = "var(--accent)";
}

// 💣 MINES GAME
function renderMines(area) {
    area.innerHTML = `<div class="mines-grid" id="m-grid"></div><button onclick="startMines()">Boshlash</button>`;
    const g = document.getElementById('m-grid');
    for(let i=0; i<25; i++) g.innerHTML += `<div class="cell" onclick="hitMine(${i}, this)">?</div>`;
}

let minePos = [];
function startMines() {
    minePos = [];
    while(minePos.length < 5) {
        let r = Math.floor(Math.random()*25);
        if(!minePos.includes(r)) minePos.push(r);
    }
    alert("O'yin boshlandi! 5 ta bomba yashirildi.");
}

function hitMine(i, el) {
    if(minePos.includes(i)) { el.classList.add('bomb'); el.innerText="💣"; alert("Yutqazdingiz!"); renderMines(document.getElementById('game-area')); }
    else { el.classList.add('open'); el.innerText="💎"; }
}

// 🎁 PROMO SYSTEM
function openPromo() { document.getElementById('promo-modal').classList.remove('hidden'); }
function closePromo() { document.getElementById('promo-modal').classList.add('hidden'); }

function applyPromo() {
    const code = document.getElementById('promo-input').value;
    if (usedPromos.includes(code)) return alert("Ishlatilgan!");
    if (code === "CreatoR") { balance += 15000; }
    else if (code === "FreeCoin") { balance += 10000; }
    else { return alert("Xato!"); }
    
    usedPromos.push(code);
    localStorage.setItem('usedPromos', JSON.stringify(usedPromos));
    updateUI();
    alert("Bonus qo'shildi!");
    closePromo();
}
