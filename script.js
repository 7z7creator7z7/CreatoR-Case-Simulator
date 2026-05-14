const tg = window.Telegram.WebApp;
tg.expand();

// 1. MA'LUMOTLAR
let balance = parseFloat(localStorage.getItem('balance')) || 100.00;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let currentLang = 'uz';

const cases = [
    { name: "Lite", price: 10, max: 50 }, { name: "Basic", price: 50, max: 250 },
    { name: "Common", price: 75, max: 375 }, { name: "Pro", price: 100, max: 500 },
    { name: "Elite", price: 150, max: 750 }, { name: "Ultra", price: 250, max: 1250 },
    { name: "King", price: 500, max: 2500 }, { name: "God", price: 1000, max: 5000 }
];

// 2. INITIAL LOAD
window.onload = () => {
    // Profil rasmini o'rnatish
    if (tg.initDataUnsafe.user?.photo_url) {
        document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
    }
    document.getElementById('user-name').innerText = `『${tg.initDataUnsafe.user?.first_name || "CreatoR"}』`;
    
    renderCases();
    updateUI();
};

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('balance', balance);
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// 3. CASE OPENING LOGIC
function renderCases() {
    const container = document.getElementById('case-list');
    container.innerHTML = cases.map((c, i) => `
        <div class="case-card">
            <h3>${c.name}</h3>
            <p>${c.price} $</p>
            <button onclick="startRoll(${i})">Ochish</button>
        </div>
    `).join('');
}

function startRoll(idx) {
    const c = cases[idx];
    if (balance < c.price) return alert("Mablag' yetarli emas!");
    balance -= c.price;
    updateUI();

    const roller = document.getElementById('roller-items');
    const modal = document.getElementById('case-modal');
    modal.classList.remove('hidden');
    roller.style.transition = 'none';
    roller.style.transform = 'translateX(0)';
    
    // Yutuqni hisoblash (Max 5x)
    const winAmount = (Math.random() * c.max).toFixed(2);
    
    // Karusel uchun itemlar yaratish
    let itemsHTML = '';
    for(let i=0; i<40; i++) {
        const randomVal = (Math.random() * c.max).toFixed(2);
        itemsHTML += `<div class="roll-item" style="background:#1a1d23">
            <span style="color:gold; font-weight:bold">${randomVal}$</span>
        </div>`;
    }
    roller.innerHTML = itemsHTML;

    // Animatsiya
    setTimeout(() => {
        roller.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)';
        const move = (30 * 100) + 50; // 30-item yutuq
        roller.style.transform = `translateX(-${move}px)`;
    }, 100);

    setTimeout(() => {
        inventory.push({ name: "Skin", price: parseFloat(winAmount) });
        alert(`Siz yutdingiz: ${winAmount} $`);
        document.getElementById('close-modal').classList.remove('hidden');
        updateUI();
    }, 4500);
}

// 4. CRASH GAME LOGIC (Avto-to'xtash bilan)
let crashInterval;
let crashRunning = false;
let currentMult = 1.0;

function openMiniGame(game) {
    const area = document.getElementById('minigame-content');
    if (game === 'crash') {
        area.innerHTML = `
            <div class="crash-box">
                <h1 id="crash-multiplier">1.00x</h1>
                <div class="bet-controls">
                    <input type="number" id="crash-bet" placeholder="Tikish miqdori ($)">
                    <input type="number" id="crash-auto" placeholder="Avto-to'xtash (masalan: 2.0)">
                    <button id="crash-btn" onclick="toggleCrash()" style="background:var(--accent); color:white; border:none; padding:15px; border-radius:10px; font-weight:bold">TIKISH</button>
                </div>
            </div>`;
    } else {
        area.innerHTML = `<h3 style="text-align:center; padding:50px">${game} tez kunda...</h3>`;
    }
}

function toggleCrash() {
    if (crashRunning) {
        cashOut();
    } else {
        startCrash();
    }
}

function startCrash() {
    const bet = parseFloat(document.getElementById('crash-bet').value);
    const auto = parseFloat(document.getElementById('crash-auto').value) || 0;
    
    if (isNaN(bet) || balance < bet) return alert("Bet xato!");
    
    balance -= bet;
    updateUI();
    
    crashRunning = true;
    currentMult = 1.0;
    document.getElementById('crash-btn').innerText = "CASH OUT";
    document.getElementById('crash-btn').style.background = "#d73a49";
    
    // Crash nuqtasi (Mantiq: Kamdan kam holatda katta ×)
    const crashPoint = generateCrashPoint();
    
    crashInterval = setInterval(() => {
        currentMult += 0.01;
        document.getElementById('crash-multiplier').innerText = currentMult.toFixed(2) + "x";
        
        // Avto-to'xtash
        if (auto > 1 && currentMult >= auto) {
            cashOut();
        }
        
        // Crash holati
        if (currentMult >= crashPoint) {
            clearInterval(crashInterval);
            crashRunning = false;
            document.getElementById('crash-multiplier').style.color = "red";
            document.getElementById('crash-btn').innerText = "CRASHED!";
            setTimeout(() => {
                document.getElementById('crash-multiplier').style.color = "var(--accent)";
                document.getElementById('crash-btn').innerText = "TIKISH";
                document.getElementById('crash-btn').style.background = "var(--accent)";
            }, 2000);
        }
    }, 100);
}

function cashOut() {
    if (!crashRunning) return;
    clearInterval(crashInterval);
    crashRunning = false;
    
    const bet = parseFloat(document.getElementById('crash-bet').value);
    const win = bet * currentMult;
    balance += win;
    
    alert(`Yutuq: ${win.toFixed(2)} $`);
    document.getElementById('crash-btn').innerText = "TIKISH";
    document.getElementById('crash-btn').style.background = "var(--accent)";
    updateUI();
}

function generateCrashPoint() {
    const r = Math.random();
    if (r < 0.1) return 1.05; // 10% darhol crash
    if (r < 0.7) return 1.1 + Math.random() * 1.4; // 60% 1.1x-2.5x
    if (r < 0.95) return 2.5 + Math.random() * 7.5; // 25% 2.5x-10x
    return 10 + Math.random() * 90; // 5% 10x-100x
}

// 5. NAVIGATSIYA
function showSection(id) {
    ['cases-section', 'games-section', 'profile-section'].forEach(s => {
        document.getElementById(s).classList.add('hidden');
    });
    document.getElementById(id + '-section').classList.remove('hidden');
    if (id === 'games') openMiniGame('crash');
}

function closeModal() {
    document.getElementById('case-modal').classList.add('hidden');
    document.getElementById('close-modal').classList.add('hidden');
}
