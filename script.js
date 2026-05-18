// SOUND SYSTEM
const audioCtx = new (
    window.AudioContext ||
    window.webkitAudioContext
)();

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

    setTimeout(() => {

        osc.stop();

    }, 60);

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

    setTimeout(() => {

        osc.stop();

    }, 40);

}
const tg = window.Telegram.WebApp;
tg.expand();
// SOUND SETTINGS
let soundEnabled =
    localStorage.getItem("soundEnabled");

if (soundEnabled === null) {

    soundEnabled = true;

} else {

    soundEnabled =
        soundEnabled === "true";

}
// BUTTON CLICK SOUND
document.addEventListener("click", (e) => {

    if (e.target.tagName === "BUTTON") {

        clickSound();

    }

});

// Til ma'lumotlari
const i18n = {
    uz: {
        nav_cases: "🎁Keyslar", nav_inv: "🎒Inventar", nav_profile: "👤Profil",
        title_cases: "👑 Keys Tanlang", title_inv: "🎒Mening Inventarim", title_profile: "⚙️Sozlamalar",
        label_lang: "🇺🇿 Tilni tanlang:", label_stats: "📊 Sizning natijangiz yaqin orada bu yerda bo'ladi.⌛",
        btn_open: "✅Ochish", btn_sell: "⛔Sotish", btn_close: "🚫Yopish",
        msg_money: "Mablag' yetarli emas!😥", msg_win: "🔰Tabriklaymiz! Siz yutdingiz 🎉: ",
        opening: "🎁 𐂅Keys ochilmoqda..."
    },
    en: {
        nav_cases: "🎁Cases", nav_inv: "🎒Inventory", nav_profile: "👤Profile",
        title_cases: "👑Select Case", title_inv: "🎒My Inventory", title_profile: "⚙️Settings",
        label_lang: "🇬🇧 Select Language:", label_stats: "📊 Your statistics will be here soon.⌛",
        btn_open: "Open", btn_sell: "⛔Sell", btn_close: "🚫Close",
        msg_money: "Not enough money!😥", msg_win: "🔰Congratulations! You won 🎉: ",
        opening: "🎁 𐂅Opening case..."
    }
};

let currentLang = localStorage.getItem('lang') || 'uz';
let balance = parseFloat(localStorage.getItem('balance')) || 100.00;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Skinlar bazasi
const allSkins = [
    { name: "🔵 P250 🔵", price: 0.50, rarity: "rarity-blue", img: "./images/5.png"},
    { name: "🔵 UMP-45 🔵 ", price: 1, rarity: "rarity-blue", img: "./images/6.png"},
    { name: "🔵 FAMAS 🔵 ", price: 1.50, rarity: "rarity-blue", img: "./images/7.png"},
    { name: "🔵 AWP 🔵 ", price: 2, rarity: "rarity-blue", img: "./images/8.png"},
    { name: "🔵 NOVA 🔵 ", price: 3, rarity: "rarity-blue", img: "./images/9.png"},
    { name: "🔵 GLOCK-18 🔵", price: 4, rarity: "rarity-blue", img: "./images/10.png"},
    { name: "🔵 AK-47 🔵", price: 5, rarity: "rarity-blue", img: "./images/11.png"},
    { name: "🔵 USP-S 🔵", price: 6, rarity: "rarity-blue", img: "./images/12.png"},
    { name: "🔵 M4A4-1 🔵", price: 7, rarity: "rarity-blue", img: "./images/13.png"},
    { name: "🔵 SSG 08 🔵", price: 8, rarity: "rarity-blue", img: "./images/14.png"},
    { name: "🔵 P90 🔵", price: 10, rarity: "rarity-blue", img: "./images/15.png"},
    { name: "🔵 Desert Eagle 🔵", price: 15, rarity: "rarity-blue", img: "./images/16.png"},
    { name: "🔵 AWP 🔵", price: 30, rarity: "rarity-blue", img: "./images/17.png"},
    { name: "🔵 AK-47 🔵", price: 40, rarity: "rarity-blue", img: "./images/18.png"},
    { name: "💎 | ASM | 💎", price: 500, rarity: "rarity-rainbow", img: "./images/19.png"}
];

// AUTO RARITY SYSTEM
const rarityChances = {
    "rarity-blue": 50,
    "rarity-green": 25,
    "rarity-purple": 13,
    "rarity-yellow": 8,
    "rarity-red": 3,
    "rarity-rainbow": 1
};

function getRandomItem(caseItems) {

    const availableRarities =
        [...new Set(caseItems.map(i => i.rarity))];

    const filteredChances = {};

    let total = 0;

    availableRarities.forEach(rarity => {

        filteredChances[rarity] =
            rarityChances[rarity];

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

    const filteredItems =
        caseItems.filter(
            item => item.rarity === selectedRarity
        );

    return filteredItems[
        Math.floor(
            Math.random() * filteredItems.length
        )
    ];
}

const caseData = [
    { name: "🔰 Oddiy", price: 10, skins: allSkins.slice(0, 14) },
    { name: "💎 Elite", price: 25, skins: allSkins.slice(5, 14) },
    { name: "🎰 Lucky", price: 50, skins: allSkins.slice(6, 14) }, 
    { name: "🏆 Best Lucky", price: 75, skins: allSkins.slice(7, 15) },
    { name: "💩 𐂅Case Ochma", price: 15, skins: allSkins.slice(0, 8) }
];

function updateLanguageUI() {
    const l = i18n[currentLang];
    document.getElementById('nav-cases').innerText = l.nav_cases;
    document.getElementById('nav-inv').innerText = l.nav_inv;
    document.getElementById('nav-profile').innerText = l.nav_profile;
    document.getElementById('title-cases').innerText = l.title_cases;
    document.getElementById('title-inv').innerText = l.title_inv;
    document.getElementById('title-profile').innerText = l.title_profile;
    document.getElementById('label-lang').innerText = l.label_lang;
    document.getElementById('label-stats').innerText = l.label_stats;
    document.getElementById('opening-text').innerText = l.opening;
    document.getElementById('close-modal').innerText = l.btn_close;
    renderCases();
}

function renderCases() {
    const container = document.getElementById('case-list');
    container.innerHTML = '';
    caseData.forEach((c, idx) => {
        const div = document.createElement('div');
        div.className = 'case-card';
        div.innerHTML = `<h3>${c.name}</h3><p>${c.price} $</p><button onclick="openCase(${idx})">${i18n[currentLang].btn_open}</button>`;
        container.appendChild(div);
    });
}

function openCase(idx) {
    const c = caseData[idx];
    if (balance < c.price) return alert(i18n[currentLang].msg_money);

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
        card.innerHTML = `<img src="${item.img}"><span>${item.name}</span><b>${item.price}$</b>`;
        carousel.appendChild(card);

        if (i === winIndex) winner = item;
    }

    setTimeout(() => {
        carousel.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)';
        carousel.style.transform = `translateX(-${(winIndex * 112) - 104}px)`;
    }, 100);
    // TICK SOUND ANIMATION
let speed = 60;

for (let i = 0; i < 35; i++) {

    setTimeout(() => {

        tickSound(
            600 + (i * 8)
        );

    }, speed);

    speed += i * 12;

}

    setTimeout(() => {
        inventory.push(winner);
        updateGlobalData();
        document.getElementById('close-modal').classList.remove('hidden');
        alert(i18n[currentLang].msg_win + winner.name);
    }, 5600);
}

function renderInventory() {
    const container = document.getElementById('inventory-list');
    container.innerHTML = '';
    inventory.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `inv-item ${item.rarity}`;
        div.innerHTML = `<img src="${item.img}"><b>${item.price}$</b><button onclick="sellItem(${i})">${i18n[currentLang].btn_sell}</button>`;
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

// Initial Load
document.getElementById('user-name').innerText = tg.initDataUnsafe.user?.first_name || "User";

if(tg.initDataUnsafe.user?.photo_url)
document.getElementById('user-photo').src =
tg.initDataUnsafe.user.photo_url;

updateLanguageUI();
updateGlobalData();
const promoCodes = {

    "FREE100": 100,

    "CREATOR": 500,

    "LUCKY500": 500,
        
    "NEWYEAR2026": 500,

    "27MART": 500,

    "CHAROS": 500,
    
    "King009": 500,

};

function usePromoCode() {

    const input =
        document.getElementById("promo-input");

    const code =
        input.value.toUpperCase();

    // Oldin ishlatilganmi
    if (localStorage.getItem("promo_" + code)) {

        alert("❌ Bu promo code ishlatilgan!");

        return;
    }

    // Promo mavjudmi
    if (promoCodes[code]) {

        balance += promoCodes[code];

        updateGlobalData();

        localStorage.setItem(
            "promo_" + code,
            "used"
        );

        alert(
            "🎉 Promo code activated! +" +
            promoCodes[code] +
            "$"
        );

        input.value = "";

    } else {

        alert("❌ Noto'g'ri promo code!");

    }
     }
// SOUND TOGGLE
const soundToggle =
    document.getElementById(
        "sound-toggle"
    );

soundToggle.checked =
    soundEnabled;

soundToggle.addEventListener(
    "change",
    () => {

        soundEnabled =
            soundToggle.checked;

        localStorage.setItem(
            "soundEnabled",
            soundEnabled
        );

    }
);
