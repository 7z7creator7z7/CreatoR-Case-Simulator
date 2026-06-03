function showTopPopup(text, color = "red") {
    // Agar avvalgi popup bo'lsa, uni o'chiramiz
    const oldPopup = document.querySelector('.top-popup');
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement("div");
    popup.className = "top-popup";
    popup.innerText = text;
    popup.style.borderColor = color;
    popup.style.color = color;
    document.body.appendChild(popup);

    // Animatsiya uchun biroz kutamiz
    setTimeout(() => { popup.classList.add("show"); }, 50);

    // 3 soniyadan keyin yopamiz
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => { popup.remove(); }, 500);
    }, 3000);
}


// ================= SOUND SYSTEM =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function sellSound() {
    if (!audioCtx || !soundEnabled) return;

    const now = audioCtx.currentTime;

    // 1. "Ka" qismi (pastroq, zarbli)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = "square";
    osc1.frequency.setValueAtTime(400, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // 2. "Ching" qismi (balandroq, jarangdor)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = "sine"; // "Ching" uchun sine yaxshiroq
    osc2.frequency.setValueAtTime(1200, now + 0.05); // "Ka"dan keyinroq
    osc2.frequency.exponentialRampToValueAtTime(2000, now + 0.25);
    gain2.gain.setValueAtTime(0.15, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.3);

    // Xotirani tozalash
    osc1.onended = () => { osc1.disconnect(); gain1.disconnect(); };
    osc2.onended = () => { osc2.disconnect(); gain2.disconnect(); };
}


function clickSound() {
    if (!soundEnabled) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.type = "triangle";
    osc2.type = "sine";

    osc1.frequency.value = 700;
    osc2.frequency.value = 1200;

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.08
    );

    osc1.start();
    osc2.start();

    osc1.stop(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.08);
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

    if (
        e.target.closest(".sell-btn")
    ) {
        return;
    }

    if (
        e.target.tagName === "BUTTON" ||
        e.target.closest("button")
    ) {
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
        opening: "🎁 Keys ochilmoqda 𓃹 ..."
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
        opening: "🎁 Opening case..."
    }
};

// ================= SAVE DATA =================
let currentLang = localStorage.getItem("lang") || "uz";
let balance = parseFloat(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ================= SKINS =================
const allSkins = [
    { name: "Boxerbolt Hoverboard", price: 35.28,chance: 4.1,rarity: "rarity-red", img: "./images/5.avif"},
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
     { name: "🟢AK-47|WOLF🟢", price: 17.9, rarity: "rarity-green", img: "./images/18.png"},
    { name: "💎 | SOMSA | 💎", price: 300, rarity: "rarity-rainbow", img: "./images/20.png"},
    { name: "💎 | Shaftoli | 💎", price: 250, rarity: "rarity-rainbow", img: "./images/21.png"},
    { name: "💎 | GILOS | 💎", price: 150, rarity: "rarity-rainbow", img: "./images/22.png"},
    { name: "💎 | ASM | 💎", price: 500, rarity: "rarity-rainbow", img: "./images/19.png"},
    { name: "❄️ | LEDNIK | ❄️", price: 500, rarity: "rarity-rainbow", img: "./images/23.png"},
    { name: "Mercuriy Soldier Set", price: 8025.87, rarity: "rarity-yellow", img: "./images/24.avif"},
];

function getRandomItem(caseItems) {

    const items = [...caseItems];

    let fixedChance = 0;

    items.forEach(item => {
        if (item.chance) {
            fixedChance += item.chance;
        }
    });

    let remainingChance = 100 - fixedChance;

    const autoItems = items.filter(item => item.chance == null);

    if (autoItems.length > 0) {

        let totalWeight = 0;

        autoItems.forEach(item => {
            item._weight = 1 / Math.max(item.price, 0.01);
            totalWeight += item._weight;
        });

        autoItems.forEach(item => {
            item._finalChance =
                (item._weight / totalWeight) * remainingChance;
        });
    }

    items.forEach(item => {
        if (item.chance != null) {
            item._finalChance = item.chance;
        }
    });

    let rand = Math.random() * 100;

    for (const item of items) {

        rand -= item._finalChance;

        if (rand <= 0) {
            return item;
        }
    }

    return items[0];
}
function calculateChance(item, caseItems) {

    if (item.chance != null) {
        return item.chance;
    }

    let fixedChance = 0;

    caseItems.forEach(i => {
        if (i.chance != null) {
            fixedChance += i.chance;
        }
    });

    let remaining = Math.max(0, 100 - fixedChance);

    const autoItems = caseItems.filter(i => i.chance == null);

    let totalWeight = 0;

    autoItems.forEach(i => {
        i._weight = 1 / Math.max(i.price, 0.01);
        totalWeight += i._weight;
    });

    const weight = 1 / Math.max(item.price, 0.01);

    let chance = (weight / totalWeight) * remaining;

    return chance;
}
// ================= TOIFALANGAN CASES MA'LUMOTI =================
const caseData = [
    {
        categoryTitle: '<img src="./images/noob.avif" class="cat-icon"> Sehrgar gunohlari',
        cases: [
            { id: "Lanatlangan Aralashma", name: "Lanatlangan Aralashma", price: 19.13, img: "./images/1000.avif", skins: allSkins.slice(0, 10) },
            { id: "Oltin Halokat", name: "Oltin Halokat", price: 39.23, img: "./images/1001.avif", skins: allSkins.slice(0, 12) },
            { id: "Songgi Kelishuv", name: "So'nggi Kelishuv", price: 59.82, img: "./images/1002.avif", skins: allSkins.slice(0, 14) },
            { id: "Birinchi Damlama", name: "Birinchi Damlama", price: 35, img: "./images/1003.avif", skins: allSkins.slice(0, 14) },
            { id: "Shisha Bashorat", name: "Shisha Bashorat", price: 35, img: "./images/1004.avif", skins: allSkins.slice(0, 14) },
            { id: "Lyumenxaym", name: "Lyumenxaym", price: 35, img: "./images/1005.avif", skins: allSkins.slice(0, 14) },
            { id: "Arximagning Sovgasi", name: "Arximagning Sovg'asi", price: 35, img: "./images/1006.avif", skins: allSkins.slice(0, 14) },
            { id: "Arkess", name: "Arkess", price: 35, img: "./images/1007.avif", skins: allSkins.slice(0, 14) },
        ]
    },
    {
        categoryTitle: '<img src="./images/pro.avif" class="cat-icon"> Bepul Case',
        cases: [
            { id: "telegram", name: "Telegram", price: 10, img: "./images/1008.avif", skins: allSkins.slice(0, 14) },
            { id: "vk", name: "VK", price: 10, img: "./images/1009.avif", skins: allSkins.slice(0, 14) }
        ]
    },
        {
        categoryTitle: '<img src="./images/elite.avif" class="cat-icon"> Faqat toplar uchun',
        cases: [
            { id: "viktor", name: "VIKTOR",rarity: "rarity-yellow", price: 35, img: "./images/1010.avif", skins: allSkins.slice(0, 14) },
            { id: "sara", name: "SARA", price: 50, img: "./images/1011.avif", skins: allSkins.slice(0, 14) },
            { id: "andy", name: "ANDY", price: 100, img: "./images/1012.avif", skins: allSkins.slice(0, 14) },
            { id: "karlo", name: "KARLO", price: 150, img: "./images/1013.avif", skins: allSkins.slice(0, 14) }
        ]
    },
    {
        categoryTitle: '<img src="./images/aura.avif" class="cat-icon"> Oyinchilar tanlovi',
        cases: [
            { id: "faraun_case", name: "FARAUN",rarity: "rarity-yellow", price: 5000, img: "./images/1014.avif", skins: allSkins.slice(19, 50)},
            { id: "avtomobil", name: "Avtomobillar", price: 7500, img: "./images/1015.avif", skins: allSkins.slice(0, 14) },
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
        
        // 1. Toifa sarlavhasini yaratish
        const catHeader = document.createElement('h2');
        catHeader.className = 'category-title';
        catHeader.innerHTML = category.categoryTitle;
        container.appendChild(catHeader);

        // Matrix effektini qo'shish
        initMatrixEffect(catHeader); 

        // 2. Grid yaratish
        const grid = document.createElement('div');
        grid.className = 'case-grid';

        // 3. Har bir case'ni render qilish
        category.cases.forEach((c) => {
            const div = document.createElement('div');
            
            // rarity klassini qo'shish (agar rarity bo'lmasa, default bo'ladi)
            const rarityClass = c.rarity || 'rarity-blue'; 
            div.className = `case-card ${rarityClass}`;
            
            div.innerHTML = `
                <img src="${c.img}" alt="${c.name}" class="case-image">
                <h3 class="case-name">${c.name}</h3>
                <button onclick="showCasePreview('${c.id}')" class="uc-button">
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
        carousel.style.transform = `translateX(-${(winIndex * 114) - 104}px)`;
    }, 100);

    // Ovozlar uchun
    let speed = 60;
    for (let i = 0; i < 35; i++) {
        setTimeout(() => { tickSound(600 + (i * 8)); }, speed);
        speed += i * 12;
    }

    // YUTUQNI KO'RSATISH (Faqat bitta blok qoldiring)
    setTimeout(() => {
        inventory.push(winner);
        updateGlobalData();
        document.getElementById('close-modal').classList.remove('hidden');
        levelUpSound();

        const popup = document.createElement("div");
        popup.className = `win-popup ${winner.rarity}`; 
        
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
            <button class="sell-btn" onclick="sellItem(${i})">
               ${i18n[currentLang].btn_sell}
            </button>
        `;
        container.appendChild(div);
        
    });
}

function sellItem(i) {

    sellSound();

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
    "KING009": 500,
    "SEVGI": 100000,
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
    let ucAmount = (balance * 60) / 98;
    let formattedUC = ucAmount.toFixed(2).replace('.', ',');
    ucElement.innerText = formattedUC;
}
let selectedCase = null;
// ================= RENDER TOIFALANGAN CASES =================
function renderCases() {
    const container = document.getElementById('case-list');
    container.innerHTML = '';

    caseData.forEach((category) => {
        
        // 1. Toifa sarlavhasini yaratish
        const catHeader = document.createElement('h2');
        catHeader.className = 'category-title';
        catHeader.innerHTML = category.categoryTitle;
        container.appendChild(catHeader);

        // 2. Matrix effektini ishga tushirish
        initMatrixEffect(catHeader); 

        // 3. Grid yaratish
        const grid = document.createElement('div');
        grid.className = 'case-grid';

        // 4. Har bir case'ni render qilish
        category.cases.forEach((c) => {
            const div = document.createElement('div');
            
            // Rarity klassi (agar yo'q bo'lsa default 'rarity-blue')
            const rarityClass = c.rarity || 'rarity-blue';
            div.className = `case-card ${rarityClass}`;
            
            div.innerHTML = `
                <img src="${c.img}" alt="${c.name}" class="case-image">
                <h3 class="case-name">${c.name}</h3>
                <button onclick="showCasePreview('${c.id}')" class="uc-button">
                    <img src="./images/mc.png" class="uc-icon"> ${c.price.toFixed(1)} MC
                </button>
            `;
            grid.appendChild(div);
        });

        container.appendChild(grid);
    });
}

// ================= SHOW CASE PREVIEW =================
function showCasePreview(caseId) {
    // 1. Dastlab case ni topib olamiz
    let selectedCase = null;
    for (let cat of caseData) {
        const found = cat.cases.find(c => c.id === caseId);
        if (found) {
            selectedCase = found;
            break;
        }
    }

    if (!selectedCase) return; // Topilmasa chiqib ketamiz

    // 2. Case RASMI va uning klassini yangilash
    // ID preview-case-img bo'lgan rasm elementini tanlaymiz
    const previewImg = document.getElementById("preview-case-img");
    previewImg.src = selectedCase.img;
    
    // Klassni yangilash (Eski klasslar o'chib, yangisi qo'shiladi)
    previewImg.className = `preview-case-image ${selectedCase.rarity || 'rarity-blue'}`;

    // 3. CASE NOMI
    document.getElementById("preview-case-name").innerText = selectedCase.name;

    // 4. CASE NARXI
    document.getElementById("preview-case-price").innerHTML = `
        <img src="./images/mc2.png" class="mc-icon">
        <span>${selectedCase.price.toFixed(1)} MC</span>
    `;

    // 5. OCHISH TUGMASI
    document.getElementById("preview-open-btn").onclick = () => {
        closeCasePreview();
        openCaseById(selectedCase.id);
    };

    // 6. ITEMLARni render qilish
    const skinsDiv = document.getElementById("preview-skins");
    skinsDiv.innerHTML = "";

    const rarityOrder = {
        "rarity-blue": 6, 
        "rarity-green": 5, 
        "rarity-purple": 4, 
        "rarity-red": 3, 
        "rarity-yellow": 2, 
        "rarity-rainbow": 1
    };

    const sortedSkins = [...selectedCase.skins].sort((a, b) => 
        (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0)
    );

    sortedSkins.forEach(item => {
        const skin = document.createElement("div");
        skin.className = `preview-skin ${item.rarity}`;
        skin.innerHTML = `
            <img src="${item.img}">
            <div class="skin-name">${item.name}</div>
            <div class="skin-price">$${item.price}</div>
           <div class="drop-chance">
    ${formatChance(calculateChance(item, selectedCase.skins))}
</div>
            <div class="rarity-line"></div>
        `;
        skinsDiv.appendChild(skin);
    });

    // Modalni ko'rsatish
    document.getElementById("case-preview-modal").classList.remove("hidden");
}

function closeCasePreview() {
    document.getElementById("case-preview-modal").classList.add("hidden");
}



// MATRIX EFFECT
function initMatrixEffect(catHeader) {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    catHeader.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = catHeader.offsetWidth;
    canvas.height = catHeader.offsetHeight;

    const nums = "0123456789";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0F0"; 
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = nums.charAt(Math.floor(Math.random() * nums.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);
    
}
function formatChance(value) {
    if (value <= 0) return "0%";
    if (value < 0.01) return "<0.01%";

    // 5.00001 → 5%
    let formatted = parseFloat(value.toFixed(2));

    // 5.10 → 5.1
    return formatted.toString().replace(/\.0$/, '') + "%";
}

// ================= START =================
updateLanguageUI();
updateGlobalData();
