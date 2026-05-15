// Telegram WebApp integratsiyasi
const tg = window.Telegram.WebApp;
tg.expand();

// Til ma'lumotlari
const i18n = {
    uz: {
        nav_cases: "Keyslar", nav_inv: "Inventar", nav_profile: "Profil",
        title_cases: "Keys Tanlang", title_inv: "Mening Inventarim", title_profile: "Sozlamalar",
        label_lang: "Tilni tanlang:", label_stats: "Sizning natijangiz yaqin orada bu yerda bo'ladi.",
        btn_open: "Ochish", btn_sell: "Sotish", btn_close: "Yopish",
        msg_money: "Mablag' yetarli emas!", msg_win: "Tabriklaymiz! Siz yutdingiz: ",
        opening: "Keys ochilmoqda..."
    },
    en: {
        nav_cases: "Cases", nav_inv: "Inventory", nav_profile: "Profile",
        title_cases: "Select Case", title_inv: "My Inventory", title_profile: "Settings",
        label_lang: "Select Language:", label_stats: "Your statistics will be here soon.",
        btn_open: "Open", btn_sell: "Sell", btn_close: "Close",
        msg_money: "Not enough money!", msg_win: "Congratulations! You won: ",
        opening: "Opening case..."
    }
};

let currentLang = localStorage.getItem('lang') || 'uz';
let balance = parseFloat(localStorage.getItem('balance')) || 1000.00;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Skinlar bazasi (PNG rasmlar bilan)
const allSkins = [
    { name: "P250 | Sand", price: 2, rarity: "rarity-blue", img: "assets/weapon/case1/5.png" },
    { name: "AK-47 | Slate", price: 45, rarity: "rarity-darkblue", img: "assets/weapon/case1/6.png" },
    { name: "AWP | Asiimov", price: 280, rarity: "rarity-gold", img: "assets/weapon/case1/7.png" },
    { name: "M9 | Crimson", price: 4500, rarity: "rarity-legendary", img: "assets/weapon/case1/8.png" },
    { name: "AWP | Gungnir", price: 18000, rarity: "rarity-rainbow", img: "assets/weapon/case1/9.png" }
];

// Case ma'lumotlari
const caseData = [
    { name: "Standard", price: 10, skins: allSkins.slice(0, 3) },
    { name: "Elite", price: 100, skins: allSkins.slice(1, 4) },
    { name: "Lucky", price: 1000, skins: allSkins.slice(2, 5) },
    { name: "Legendary", price: 5000, skins: [ allSkins[4] ] }
];

// UI yangilash
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

// Case’larni ko‘rsatish
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

// Case ochish
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
        const item = c.skins[Math.floor(Math.random() * c.skins.length)];
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

    setTimeout(() => {
        inventory.push(winner);
        updateGlobalData();
        document.getElementById('close-modal').classList.remove('hidden');
        alert(i18n[currentLang].msg_win + winner.name);
    }, 5600);
}

// Inventarni ko‘rsatish
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

// Item sotish
function sellItem(i) {
    balance += inventory[i].price;
    inventory.splice(i, 1);
    updateGlobalData();
}

// Tilni almashtirish
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLanguageUI();
    renderInventory();
}

// Balans va inventarni yangilash
function updateGlobalData() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('balance', balance);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
}

// Bo‘limlarni ko‘rsatish
function showSection(name) {
    document.getElementById('cases-section').classList.toggle('hidden', name !== 'cases');
    document.getElementById('inventory-section').classList.toggle('hidden', name !== 'inventory');
    document.getElementById('profile-section').classList.toggle('hidden', name !== 'profile');
}

// Modal yopish
function closeModal() {
    document.getElementById('game-modal').classList.add('hidden');
    document.getElementById('close-modal').classList.add('hidden');
}

// Initial Load
document.getElementById('user-name').innerText = tg.initDataUnsafe.user?.first_name || "User";
if(tg.initDataUnsafe.user?.photo_url) document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
updateLanguageUI();
updateGlobalData();
