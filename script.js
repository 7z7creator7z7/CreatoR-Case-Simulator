function showTopPopup(text, color = "red") {
}

// ================= SOUND SYSTEM =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function clickSound() {
    if (!soundEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "square";
    osc.frequency.value = 500;
    gain.gain.value = 0.05;
    osc.start();
    setTimeout(() => { osc.stop(); }, 60);
}

function tickSound(freq = 700) {
    if (!soundEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.value = 0.03;
    osc.start();
    setTimeout(() => { osc.stop(); }, 40);
}

function levelUpSound() {
    if (!soundEnabled) return;
    const notes = [700, 950, 1300];
    notes.forEach((freq, i) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "triangle";
            osc.frequency.value = freq;
            gain.gain.value = 0.05;
            osc.start();
            setTimeout(() => { osc.stop(); }, 120);
        }, i * 140);
    });
}

// ================= TELEGRAM =================
const tg = window.Telegram.WebApp;
tg.expand();

// ================= SOUND SETTINGS =================
let soundEnabled = localStorage.getItem("soundEnabled");
if (soundEnabled === null) {
    soundEnabled = true;
} else {
    soundEnabled = soundEnabled === "true";
}

document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        clickSound();
    }
});

// ================= LANGUAGE =================
const i18n = {
    uz: {
        nav_cases: "🎁Keyslar",
        nav_inv: "🎒Inventar",
        nav_profile: "👤Profil",
        title_inv: "🎒Mening Inventarim",
        title_profile: "⚙️Sozlamalar",
        label_lang: "🇺🇿 Tilni tanlang:",
        label_stats: "📊 Sizning natijangiz yaqin orada bu yerda bo'ladi.⌛",
        btn_open: "✅Ochish",
        btn_sell: "⛔Sotish",
        btn_close: "🚫Yopish",
        msg_money: "❌ Mablag' yetarli emas!",
        opening: "🎁 𐂅Keys ochilmoqda..."
    },
    en: {
        nav_cases: "🎁Cases",
        nav_inv: "🎒Inventory",
        nav_profile: "👤Profile",
        title_inv: "🎒My Inventory",
        title_profile: "⚙️Settings",
        label_lang: "🇬🇧 Select Language:",
        label_stats: "📊 Your statistics will be here soon.⌛",
        btn_open: "✅Open",
        btn_sell: "⛔Sell",
        btn_close: "🚫Close",
        msg_money: "❌ Not enough money!",
        opening: "🎁 𐂅Opening case..."
    }
};

// ================= SAVE DATA =================
let currentLang = localStorage.getItem("lang") || "uz";
let balance = parseFloat(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ================= SKINS =================
const allSkins = [
    { name: "🔵 P250 🔵", price: 0.50, rarity: "rarity-blue", img: "./images/5.png"},
    { name: "🔵 UMP-45 🔵", price: 0.10, rarity: "rarity-blue", img: "./images/6.png"},
    { name: "🔵 FAMAS 🔵", price: 1.50, rarity: "rarity-blue", img: "./images/7.png"},
    { name: "🔵 NOVA 🔵", price: 3.50, rarity: "rarity-blue", img: "./images/8.png"},
    { name: "🔵 GLOCK-18 🔵", price: 4.30, rarity: "rarity-blue", img: "./images/9.png"},
    { name: "🔵 AK-47 🔵", price: 5.10, rarity: "rarity-blue", img: "./images/10.png"},
    { name: "🔵 USP-S 🔵", price: 6.80, rarity: "rarity-blue", img: "./images/11.png"},
    { name: "🔵 M4A4 🔵", price: 7.90, rarity: "rarity-blue", img: "./images/12.png"},
    { name: "🔵 SSG 08 🔵", price: 2.50, rarity: "rarity-blue", img: "./images/13.png"},
    { name: "🔵 P90 🔵", price: 3.90, rarity: "rarity-blue", img: "./images/14.png"},
    { name: "🔵 Desert Eagle 🔵", price: 4.50, rarity: "rarity-blue", img: "./images/15.png"},
    { name: "🔵 AWP 🔵", price: 9.50, rarity: "rarity-blue", img: "./images/16.png"},
    { name: "🔵 AK-47 🔵", price: 8.10, rarity: "rarity-blue", img: "./images/17.png"},
    { name: "💎 | SOMSA | 💎", price: 300, rarity: "rarity-rainbow", img: "./images/18.png"},
    { name: "💎 | Shaftoli | 💎", price: 250, rarity: "rarity-rainbow", img: "./images/19.png"},
    { name: "💎 | GILOS | 💎", price: 150, rarity: "rarity-rainbow", img: "./images/20.png"},
    { name: "💎 | ASM | 💎", price: 5000, rarity: "rarity-rainbow", img: "./images/21.png"},
];

const rarityChances = {
    "rarity-blue": 60,
    "rarity-green": 22,
    "rarity-purple": 11,
    "rarity-yellow": 4,
    "rarity-red": 2,
    "rarity-rainbow": 1
};

function getRandomItem(caseItems) {
    const availableRarities = [...new Set(caseItems.map(i => i.rarity))];
    const filteredChances = {};
    let total = 0;
    availableRarities.forEach(rarity => {
        filteredChances[rarity] = rarityChances[rarity];
        total += rarityChances[rarity];
    });
    let random = Math.random() * total;
    let selectedRarity;
    for (let rarity in filteredChances) {
        random -= filteredChances[rarity];
        if (random <= 0) {
            selectedRarity = rarity;
            break;
        }
    }
    const filteredItems = caseItems.filter(item => item.rarity === selectedRarity);
    return filteredItems[Math.floor(Math.random() * filteredItems.length)];
}

// ================= TOIFALANGAN CASES MA'LUMOTI =================
const caseData = [
    {
        categoryTitle: "💲 Arzon Case",
        cases: [
            { id: "arzon_tun", name: "🌃 Tun", price: 5, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "arzon_kun", name: "🏙️ Kun", price: 15, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "arzon_oy", name: "🌕 Oy", price: 25, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "arzon_quyosh", name: "☀️ Quyosh", price: 35, img: "./images/1.png", skins: allSkins.slice(0, 14) }
        ]
    },
    {
        categoryTitle: "🏆 O'rtacha Case",
        cases: [
            { id: "ortacha_noob", name: "Noob", price: 35, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "ortacha_epic", name: "Epic", price: 50, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "ortacha_pro", name: "Pro", price: 100, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "ortacha_ultra", name: "Ultra", price: 150, img: "./images/1.png", skins: allSkins.slice(0, 14) }
        ]
    },
    {
        categoryTitle: "👑 Qimmat Case",
        cases: [
            { id: "qimmat_rare", name: "💠 Rare", price: 500, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "qimmat_epic", name: "🤑 Epic", price: 1000, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "qimmat_lucky", name: "🎰 Lucky", price: 1500, img: "./images/1.png", skins: allSkins.slice(0, 14) },
            { id: "qimmat_legendary", name: "💎 Legend", price: 2500, img: "./images/1.png", skins: allSkins.slice(0, 14) }
        ]
    }
];


// ================= LANGUAGE UI =================
function updateLanguageUI() {
    const l = i18n[currentLang];
    document.getElementById('nav-cases').innerText = l.nav_cases;
    document.getElementById('nav-inv').innerText = l.nav_inv;
    document.getElementById('nav-profile').innerText = l.nav_profile;
    document.getElementById('title-inv').innerText = l.title_inv;
    document.getElementById('title-profile').innerText = l.title_profile;
    document.getElementById('label-lang').innerText = l.label_lang;
    document.getElementById('label-stats').innerText = l.label_stats;
    document.getElementById('opening-text').innerText = l.opening;
    document.getElementById('close-modal').innerText = l.btn_close;
    renderCases();
}

// ================= RENDER TOIFALANGAN CASES =================
function renderCases() {
    const container = document.getElementById('case-list');
    container.innerHTML = '';

    caseData.forEach((category) => {
        // Toifa sarlavhasi
        const catHeader = document.createElement('h2');
        catHeader.className = 'category-title';
        catHeader.innerText = category.categoryTitle;
        container.appendChild(catHeader);

        const grid = document.createElement('div');
        grid.className = 'case-grid';

        category.cases.forEach((c) => {
            const div = document.createElement('div');
            div.className = 'case-card';
            
            // Rasmdagi dizayn bo'yicha HTML
            div.innerHTML = `
                <img src="${c.img}" alt="${c.name}" class="case-image">
                <h3 class="case-name">${c.name}</h3>
                <button onclick="openCaseById('${c.id}')" class="uc-button">
                    <img src="./images/mc.png" class="uc-icon"> ${c.price.toFixed(1)} MC
                </button>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    });
}


// ================= OPEN CASE BY ID =================
function openCaseById(caseId) {
    let c = null;
    for (let cat of caseData) {
        c = cat.cases.find(item => item.id === caseId);
        if (c) break;
    }
    
    if (!c) return;

    if (balance < c.price) {
        showTopPopup(i18n[currentLang].msg_money, "red");
        return;
    }

    balance -= c.price;
    updateGlobalData();

    const modal = document.getElementById('game-modal');
    const carousel = document.getElementById('carousel');
    modal.classList.remove('hidden');
    carousel.innerHTML = '';
    carousel.style.transition = 'none';
    carousel.style.transform = 'translateX(0)';

    const winIndex = 30;
    let winner;

    for (let i = 0; i < 45; i++) {
        const item = getRandomItem(c.skins);
        const card = document.createElement('div');
        card.className = `skin-card ${item.rarity}`;
        card.innerHTML = `
            <img src="${item.img}">
            <span>${item.name}</span>
            <b>${item.price}$</b>
        `;
        carousel.appendChild(card);
        if (i === winIndex) {
            winner = item;
        }
    }

    setTimeout(() => {
        carousel.style.transition = 'transform 7.3s cubic-bezier(0.1,0,0.1,1)';
        carousel.style.transform = `translateX(-${(winIndex * 112) - 104}px)`;
    }, 100);

    let speed = 60;
    for (let i = 0; i < 35; i++) {
        setTimeout(() => { tickSound(600 + (i * 8)); }, speed);
        speed += i * 12;
    }

    setTimeout(() => {
        inventory.push(winner);
        updateGlobalData();
        document.getElementById('close-modal').classList.remove('hidden');
        levelUpSound();

        const popup = document.createElement("div");
        popup.className = "win-popup";
        popup.innerHTML = `
            <img src="${winner.img}">
            <div class="win-popup-info">
                <div class="win-popup-name">${winner.name}</div>
                <div class="win-popup-price">💰 ${winner.price}$</div>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => { popup.classList.add("show"); }, 50);
        setTimeout(() => {
            popup.classList.remove("show");
            setTimeout(() => { popup.remove(); }, 500);
        }, 4000);
    }, 7600);
}

// ================= INVENTORY =================
function renderInventory() {
    const container = document.getElementById('inventory-list');
    container.innerHTML = '';
    inventory.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `inv-item ${item.rarity}`;
        div.innerHTML = `
            <img src="${item.img}">
            <b>${item.price}$</b>
            <button onclick="sellItem(${i})">
                ${i18n[currentLang].btn_sell}
            </button>
        `;
        container.appendChild(div);
    });
}

function sellItem(i) {
    balance += inventory[i].price;
    inventory.splice(i, 1);
    updateGlobalData();
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLanguageUI();
    renderInventory();
}

function updateGlobalData() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('balance', balance);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
    updateUCBalance();
}

function showSection(name) {
    document.getElementById('cases-section').classList.toggle('hidden', name !== 'cases');
    document.getElementById('inventory-section').classList.toggle('hidden', name !== 'inventory');
    document.getElementById('profile-section').classList.toggle('hidden', name !== 'profile');
}

function closeModal() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('close-modal').classList.add('hidden');
}

// ================= USER =================
document.getElementById('user-name').innerText = tg.initDataUnsafe.user?.first_name || "User";
if (tg.initDataUnsafe.user?.photo_url) {
    document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
}

// ================= PROMO CODES =================
const promoCodes = {
    "FREE100": 100,
    "CREATOR": 500,
    "LUCKY500": 500,
    "NEWYEAR2026": 500,
    "27MART": 500,
    "CHAROS": 500,
    "KING009": 500
};

function usePromoCode() {
    const input = document.getElementById("promo-input");
    const code = input.value.toUpperCase();

    if (localStorage.getItem("promo_" + code)) {
        const popup = document.createElement("div");
        popup.innerHTML = "😑 Bu promo code ishlatilgan!";
        popup.style.color = "#cc6600";
        popup.style.background = "#222";
        popup.style.padding = "15px";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.borderRadius = "10px";
        popup.style.fontSize = "20px";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);
        setTimeout(() => { popup.remove(); }, 5000);
        return;
    }

    if (promoCodes[code]) {
        balance += promoCodes[code];
        updateGlobalData();
        localStorage.setItem("promo_" + code, "used");

        const popup = document.createElement("div");
        popup.innerHTML = "🎉 Muvaffaqiyatli! +" + promoCodes[code] + "$";
        popup.style.color = "lime";
        popup.style.background = "#222";
        popup.style.padding = "15px";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.borderRadius = "10px";
        popup.style.fontSize = "20px";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);
        setTimeout(() => { popup.remove(); }, 5000);
        input.value = "";
    } else {
        const popup = document.createElement("div");
        popup.innerHTML = "❌ Noto'g'ri promo code!";
        popup.style.color = "red";
        popup.style.background = "#222";
        popup.style.padding = "15px";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform = "translateX(-50%)";
        popup.style.borderRadius = "10px";
        popup.style.fontSize = "20px";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);
        setTimeout(() => { popup.remove(); }, 5000);
    }
}

// ================= SOUND TOGGLE =================
const soundToggle = document.getElementById("sound-toggle");
soundToggle.checked = soundEnabled;
soundToggle.addEventListener("change", () => {
    soundEnabled = soundToggle.checked;
    localStorage.setItem("soundEnabled", soundEnabled);
});

// ================= AUTOMATIC UC CALCULATOR =================
function updateUCBalance() {
    const ucElement = document.getElementById("calculated-uc");
    if (!ucElement) return;
    let ucAmount = (balance * 60) / 5000;
    let formattedUC = ucAmount.toFixed(2).replace('.', ',');
    ucElement.innerText = formattedUC;
}

// ================= START =================
updateLanguageUI();
updateGlobalData();
