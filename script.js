const tg = window.Telegram.WebApp;
tg.expand();

// 1. DATA INITIALIZATION
let balance = parseFloat(localStorage.getItem('balance')) || 100.00;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let usedPromos = JSON.parse(localStorage.getItem('usedPromos')) || [];
let lastDaily = localStorage.getItem('lastDaily') || 0;
let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
let invitedCount = parseInt(localStorage.getItem('invitedCount')) || 0;

// 2. CONFIGURATIONS
const caseConfigs = [
    { name: "Lite", price: 10, max: 50 }, { name: "Basic", price: 50, max: 250 },
    { name: "Common", price: 75, max: 375 }, { name: "Pro", price: 100, max: 500 },
    { name: "Elite", price: 150, max: 750 }, { name: "Ultra", price: 250, max: 1250 },
    { name: "Whale", price: 500, max: 2500 }, { name: "King", price: 750, max: 3750 },
    { name: "Legend", price: 1000, max: 5000 }, { name: "CreatoR", price: 1500, max: 7500 }
];

// 3. CORE FUNCTIONS
function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('user-name').innerText = `『${tg.initDataUnsafe.user?.first_name || "CreatoR"}』`;
    localStorage.setItem('balance', balance);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
    renderLeaderboard();
    renderDaily();
}

// 🛒 CASE OPENING
function renderCases() {
    const list = document.getElementById('case-list');
    list.innerHTML = '';
    caseConfigs.forEach((c, i) => {
        list.innerHTML += `<div class="case-card"><h3>${c.name}</h3><p>${c.price}$</p><button onclick="openCase(${i})">Ochish</button></div>`;
    });
}

function openCase(idx) {
    const c = caseConfigs[idx];
    if (balance < c.price) return alert("Pul yetarli emas!");
    balance -= c.price;
    updateUI();

    const winAmount = (Math.random() * c.max).toFixed(2);
    const item = { name: "Item " + Math.floor(Math.random()*999), price: parseFloat(winAmount), rarity: getRarity(winAmount) };
    
    document.getElementById('game-modal').classList.remove('hidden');
    // Animation simulyatsiyasi
    setTimeout(() => {
        inventory.push(item);
        alert(`Yutdingiz: ${item.price}$`);
        document.getElementById('game-modal').classList.add('hidden');
        updateUI();
    }, 2500);
}

function getRarity(p) {
    if (p < 50) return "rarity-blue";
    if (p < 500) return "rarity-gold";
    return "rarity-legendary";
}

// 🏆 REYTING (TOP 30)
function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    let players = [
        {name: "Admin", balance: 50000}, {name: "Shadow", balance: 12000}, {name: "Boss", balance: 9000},
        {name: tg.initDataUnsafe.user?.first_name || "Siz", balance: balance}
    ];
    players.sort((a,b) => b.balance - a.balance);
    board.innerHTML = players.slice(0, 30).map((p, i) => `
        <div class="leaderboard-item"><span>${i+1}. ${p.name}</span><b>${p.balance.toLocaleString()}$</b></div>
    `).join('');
}

// 🎁 PROMO KODLAR
function activatePromo() {
    const input = document.getElementById('promo-input').value;
    if (usedPromos.includes(input)) return alert("Ishlatilgan!");
    
    if (input === "CreatoR") { balance += 15000; }
    else if (input === "FreeCoin") { balance += 10000; }
    else { return alert("Xato kod!"); }

    usedPromos.push(input);
    localStorage.setItem('usedPromos', JSON.stringify(usedPromos));
    updateUI();
    alert("Muvaffaqiyatli!");
}

// 👥 REFERAL
function inviteFriend() {
    invitedCount++;
    balance += 500;
    localStorage.setItem('invitedCount', invitedCount);
    document.getElementById('ref-status').innerText = `Takliflar: ${invitedCount} ta`;
    updateUI();
    tg.openTelegramLink(`https://t.me/share/url?url=t.me/SizningBot&text=Kir va 500$ ol!`);
}

// 📅 DAILY BONUS
function renderDaily() {
    const grid = document.getElementById('daily-grid');
    grid.innerHTML = Array.from({length: 7}).map((_, i) => `
        <div class="day-box ${i < dailyStreak ? 'active' : ''}">Kun ${i+1}<br>100$</div>
    `).join('');
}

function claimDaily() {
    const now = Date.now();
    if (now - lastDaily < 86400000) return alert("Hali vaqt bor!");
    balance += 100;
    dailyStreak = (dailyStreak >= 7) ? 1 : dailyStreak + 1;
    lastDaily = now;
    localStorage.setItem('lastDaily', lastDaily);
    localStorage.setItem('dailyStreak', dailyStreak);
    updateUI();
}

// 🚀 MINIGAMES (CRASH)
let multiplier = 1.0;
function switchGame(game) {
    const area = document.getElementById('minigame-area');
    if (game === 'crash') {
        area.innerHTML = `
            <div style="text-align:center">
                <h1 id="crash-val" style="font-size:50px;color:var(--accent)">1.00x</h1>
                <button onclick="startCrash()" class="main-btn" style="background:var(--accent);padding:15px 30px;border:none;border-radius:10px;color:white">START</button>
            </div>`;
    } else { area.innerHTML = `<h3>${game} tez kunda...</h3>`; }
}

function startCrash() {
    multiplier = 1.0;
    const target = Math.random() < 0.8 ? (1 + Math.random()*2) : (2 + Math.random()*10);
    const interval = setInterval(() => {
        multiplier += 0.05;
        document.getElementById('crash-val').innerText = multiplier.toFixed(2) + "x";
        if (multiplier >= target) {
            clearInterval(interval);
            alert("Crash! at " + target.toFixed(2));
        }
    }, 100);
}

// 4. NAVIGATION
function showSection(id) {
    ['cases', 'games', 'profile'].forEach(s => document.getElementById(s + '-section').classList.add('hidden'));
    document.getElementById(id + '-section').classList.remove('hidden');
}

function showProfileTab(tab) {
    document.querySelectorAll('.p-tab').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.p-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('p-' + tab).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function renderInventory() {
    const inv = document.getElementById('inventory-list');
    inv.innerHTML = inventory.map((item, i) => `
        <div class="leaderboard-item ${item.rarity}">
            <span>${item.name}</span>
            <button onclick="sellItem(${i})" style="background:#da3633;border:none;color:white;padding:5px;border-radius:5px">${item.price}$ Sotish</button>
        </div>
    `).join('');
}

function sellItem(i) {
    balance += inventory[i].price;
    inventory.splice(i, 1);
    updateUI();
}

window.onload = () => {
    renderCases();
    updateUI();
    switchGame('crash');
};
