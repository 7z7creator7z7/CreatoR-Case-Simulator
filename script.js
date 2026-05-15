const tg = window.Telegram.WebApp;
tg.expand();

let balance = 100.00;
let currentLang = 'uz';
let inventory = [];

const translations = {
    uz: { home: "Bosh sahifa", games: "O'yinlar", inv: "Inventar", prof: "Profil", open: "OCHISH" },
    en: { home: "Home", games: "Games", inv: "Inventory", prof: "Profile", open: "OPEN" }
};

// Case configurations: price, skins (max price = 5x case price)
const caseData = [
    { id: 1, name: "Armiya", price: 10, skins: [{n: "Glock-18", p: 2}, {n: "USP-S", p: 15}, {n: "AK-47 Slate", p: 48}] },
    { id: 2, name: "Taqiqlangan", price: 50, skins: [{n: "M4A4", p: 30}, {n: "AWP Atheris", p: 120}, {n: "Desert Eagle", p: 240}] },
    { id: 3, name: "Tasniflangan", price: 100, skins: [{n: "M4A1-S", p: 80}, {n: "AK-47 Aquamarine", p: 250}, {n: "Knife Navaja", p: 490}] },
    { id: 4, name: "Sir", price: 250, skins: [{n: "AWP Asiimov", p: 180}, {n: "Karambit Lore", p: 1200}] },
    { id: 5, name: "Pichoq", price: 500, skins: [{n: "Bayonet", p: 400}, {n: "M9 Crimson", p: 2400}] }
];

window.onload = () => {
    renderCases();
    updateUI();
};

function renderCases() {
    const list = document.getElementById('case-list');
    list.innerHTML = caseData.map(c => `
        <div class="case-card" onclick="openCaseModal(${c.id})">
            <img src="https://bulldrop.uz/static/media/case-preview.png">
            <h3>${c.name}</h3>
            <div class="price-tag">${c.price} $</div>
        </div>
    `).join('');
}

function openCaseModal(id) {
    const c = caseData.find(x => x.id === id);
    if (balance < c.price) return alert("Mablag' yetarli emas!");
    
    document.getElementById('m-title').innerText = c.name;
    const modal = document.getElementById('case-modal');
    modal.classList.remove('hidden');
    
    const inner = document.getElementById('roulette-inner');
    inner.style.transition = 'none';
    inner.style.transform = 'translateX(0)';
    
    let html = "";
    for(let i=0; i<50; i++) {
        const skin = c.skins[Math.floor(Math.random() * c.skins.length)];
        const isExp = skin.p > c.price * 2 ? 'item-expensive' : '';
        html += `<div class="skin-item ${isExp}"><img src="https://img.icons8.com/color/96/pistol.png"><p style="font-size:10px">${skin.n}</p></div>`;
    }
    inner.innerHTML = html;

    document.getElementById('open-btn').onclick = () => {
        balance -= c.price;
        updateUI();
        const winIndex = 40; // Hardcoded win position
        const winner = c.skins[Math.floor(Math.random() * c.skins.length)]; // Logic for low drop rate can be added here
        
        inner.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)';
        inner.style.transform = `translateX(-${(winIndex * 100) - 150}px)`;
        
        setTimeout(() => {
            alert("Siz yutdingiz: " + winner.n + " (" + winner.p + "$)");
            inventory.push(winner);
            closeModal();
        }, 4500);
    };
}

// CRASH GAME LOGIC
function startCrash() {
    let mult = 1.0;
    const area = document.getElementById('game-area');
    area.innerHTML = `<div class="crash-box"><h1 id="crash-mult">1.00x</h1><button onclick="cashOut()">CASHOUT</button></div>`;
    
    let timer = setInterval(() => {
        mult += 0.01;
        document.getElementById('crash-mult').innerText = mult.toFixed(2) + "x";
        
        // Probability logic
        let crashPoint = Math.random();
        if (mult > 1.5 && crashPoint < 0.05) { // Common stop at 1.5-2.4
            clearInterval(timer);
            alert("CRASHED AT " + mult.toFixed(2));
        }
    }, 100);
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id + '-section').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + id).classList.add('active');
}

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
}

function closeModal() {
    document.getElementById('case-modal').classList.add('hidden');
}

function changeLang(lang) {
    currentLang = lang;
    const l = translations[lang];
    document.querySelector('#nav-home p').innerText = l.home;
    document.querySelector('#nav-games p').innerText = l.games;
    document.querySelector('#nav-inventory p').innerText = l.inv;
    document.querySelector('#nav-profile p').innerText = l.prof;
}
// Skinlar bazasi (Rarity va Narxlar bilan)
const skinsBase = {
    armya: [
        { n: "Glock-18", p: 2, r: "rarity-blue", w: 70 },   // w - vazni (qancha ko'p bo'lsa, shuncha ko'p tushadi)
        { n: "USP-S", p: 15, r: "rarity-green", w: 25 },
        { n: "AK-47 Slate", p: 48, r: "rarity-red", w: 5 }
    ],
    sir: [
        { n: "M4A4", p: 180, r: "rarity-red", w: 80 },
        { n: "Dragon Lore", p: 1500, r: "rarity-gold", w: 1 } // Gold juda kam tushadi
    ]
};

// Promo-kod funksiyasi
function openPromo() {
    const code = prompt("Promo-kodni kiriting:");
    if (code === "FREE") {
        if (localStorage.getItem('promo_used')) {
            alert("Siz ushbu koddan foydalanib bo'lgansiz!");
        } else {
            balance += 10000;
            localStorage.setItem('promo_used', 'true');
            updateUI();
            alert("Tabriklaymiz! Balansingizga 10 000$ qo'shildi.");
        }
    } else {
        alert("Noto'g'ri promo-kod!");
    }
}

// Keys ochishda yutuqni aniqlash (Foizga qarab)
function getWeightedRandom(skins) {
    let totalWeight = skins.reduce((sum, skin) => sum + skin.w, 0);
    let random = Math.random() * totalWeight;
    
    for (const skin of skins) {
        if (random < skin.w) return skin;
        random -= skin.w;
    }
}

// Keys tarkibini modalda ko'rsatish
function openPreview(caseKey) {
    const caseSkins = skinsBase[caseKey];
    const grid = document.getElementById('modal-items');
    
    grid.innerHTML = caseSkins.map(skin => `
        <div class="preview-item ${skin.r}">
            <img src="https://img.icons8.com/color/96/pistol.png">
            <p>${skin.n}</p>
            <span class="price">${skin.p} $</span>
        </div>
    `).join('');
}
