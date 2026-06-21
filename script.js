let activeVoucherIndex = null;
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
        nav_cases: "🎁 Keyslar",
        nav_games: "🎮 O'yinlar",
        nav_inv: "🎒 Inventar",
        nav_profile: "👤 Profil",
        
        title_inv: "🎒 Mening Inventarim",
        title_games: "🎮 Mini O'yinlar",
        title_profile: "⚙️ Sozlamalar",
        
        label_lang: "🇺🇿 Tilni tanlang:",
        label_stats: "📊 Sizning natijangiz yaqin orada bu yerda bo'ladi.⌛",
        
        btn_open: "✅ Ochish",
        btn_sell: "⛔ Sotish",
        btn_close: "🚫Yopish",
        
        msg_money: "❌ Mablag' yetarli emas!",
        opening: "🎁 Keys ochilmoqda 𓃹 ..."
    },
    en: {
        nav_cases: "🎁 Cases",
        nav_games: "🎮 Games",
        nav_inv: "🎒 Inventory",
        nav_profile: "👤 Profile",
        
        title_inv: "🎒 My Inventory",
        title_games: "🎮 Mini Games",
        title_profile: "⚙️ Settings",
        
        label_lang: "🇬🇧 Select Language:",
        label_stats: "📊 Your statistics will be here soon.⌛",
        
        btn_open: "✅ Open",
        btn_sell: "⛔ Sell",
        btn_close: "🚫 Close",
        
        msg_money: "❌ Not enough money!",
        opening: "🎁 Opening case 𓃹 ..."
    }
};

// ================= UI YANGILASH FUNKSIYASI =================
function updateLanguageUI() {
    const l = i18n[currentLang];
    
    // Navigatsiya
    document.getElementById('nav-cases').innerText = l.nav_cases;
    document.getElementById('nav-games').innerText = l.nav_games;
    document.getElementById('nav-inv').innerText = l.nav_inv;
    document.getElementById('nav-profile').innerText = l.nav_profile;
    
    // Sarlavhalar
    document.getElementById('title-inv').innerText = l.title_inv;
    if(document.getElementById('title-games')) document.getElementById('title-games').innerText = l.title_games;
    document.getElementById('title-profile').innerText = l.title_profile;
    
    // Profil qismi
    document.getElementById('label-lang').innerText = l.label_lang;
    document.getElementById('label-stats').innerText = l.label_stats;
    
    // Modal va o'yin qismi
    document.getElementById('opening-text').innerText = l.opening;
    document.getElementById('close-modal').innerText = l.btn_close;
    
    // Caseslarni qayta render qilish
    renderCases();
}


// ================= SAVE DATA =================
let currentLang = localStorage.getItem("lang") || "uz";
let balance = parseFloat(localStorage.getItem("balance")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ================= SKINS =================
const allSkins = [
    { name: "Boxerbolt Hoverboard", price: 35.28,chance: 4.1,rarity: "rarity-red", img: "./images/5.avif"},
    { name: "Field Commander", price: 170.20,chance:0.01, rarity: "rarity-purple", img: "./images/6.avif"},
    { name: "Blazing Vermillion", price: 155.48,chance:0.02, rarity: "rarity-purple", img: "./images/7.avif"},
    { name: "Thorn Bramble", price: 137.85,chance:0.03, rarity: "rarity-purple", img: "./images/8.avif"},
    { name: "Blood Lotus", price: 122.25,chance:0.03, rarity: "rarity-purple", img: "./images/9.avif"},
    { name: "Shrine Keeper", price: 120.73,chance:0.05, rarity: "rarity-purple", img: "./images/10.avif"},
    { name: "Armored Hunter", price: 102.52,chance:0.17, rarity: "rarity-purple", img: "./images/11.avif"},
    { name: "Son Goku UAZ", price: 83.11,chance:0.44, rarity: "rarity-purple", img: "./images/12.avif"},
    { name: "Beerus Style", price: 65.66,chance:0.45, rarity: "rarity-purple", img: "./images/13.avif"},
    { name: "Octosurprise", price: 64.99,chance:0.22, rarity: "rarity-purple", img: "./images/14.avif"},
    { name: "Shrine Keeper", price: 59.40,chance:0.85, rarity: "rarity-purple", img: "./images/15.avif"},
    { name: "Wings Of Dawn", price: 44.03,chance:0.72, rarity: "rarity-purple", img: "./images/16.avif"},
    { name: "Silly Chicken", price: 43.40,chance:0.15, rarity: "rarity-purple", img: "./images/17.avif"},
     { name: "Legend Of The Fjord", price: 43.05,chance:1.08, rarity: "rarity-purple", img: "./images/18.avif"},
    { name: "Blood Rain", price: 37.27, chance:1.84, rarity: "rarity-purple", img: "./images/19.avif"},
    { name: "Black Tortoise Defender", price: 32.16,chance:3.26, rarity: "rarity-purple", img: "./images/20.avif"},
    { name: "Thanksgiving Chicken", price: 150, rarity: "rarity-purple", img: "./images/21.avif"},
    { name: "Rauge Mask", price: 500, rarity: "rarity-purple", img: "./images/22.avif"},
    { name: "Apocalypse Guardian", price: 500, rarity: "rarity-purple", img: "./images/23.avif"},
    { name: "Neptune's Grasp", price: 85.87, rarity: "rarity-purple", img: "./images/24.avif"},
    { name: "...", price: 5,chance:70, rarity: "rarity-purple", img: "./images/22.avif"},
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
        categoryTitle: '<img src="./images/blaze.png" class="cat-icon"> BLAZE™',
        cases: [
            { id: "blaze-fire", name: "BLAZE FIRE", price: 10, img: "./images/1016.avif", skins: allSkins.slice(0, 29) },
            { id: "Oltin Halokat", name: "Oltin Halokat", price: 39.23, img: "./images/1017.avif", skins: allSkins.slice(0, 12) },
            { id: "Songgi Kelishuv", name: "So'nggi Kelishuv", price: 59.82, img: "./images/1002.avif", skins: allSkins.slice(0, 14) },
            { id: "Birinchi Damlama", name: "Birinchi Damlama", price: 35, img: "./images/1003.avif", skins: allSkins.slice(0, 14) },
            { id: "Shisha Bashorat", name: "Shisha Bashorat", price: 35, img: "./images/1004.avif", skins: allSkins.slice(0, 14) },
            { id: "Lyumenxaym", name: "Lyumenxaym", price: 35, img: "./images/1005.avif", skins: allSkins.slice(0, 14) },
            { id: "Arximagning Sovgasi", name: "Arximagning Sovg'asi", price: 35, img: "./images/1006.avif", skins: allSkins.slice(0, 14) },
            { id: "Arkess", name: "Arkess", price: 35, img: "./images/1007.avif", skins: allSkins.slice(0, 14) },
        ]
    },
    {
        categoryTitle: '<img src="./images/noob.avif" class="cat-icon"> Sehrgar gunohlari',
        cases: [
            { id: "Lanatlangan Aralashma", name: "Lanatlangan Aralashma", price: 19.13, img: "./images/1000.avif", skins: allSkins.slice(0, 29) },
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
            { id: "telegram", name: "Telegram", price: 0, img: "./images/1008.avif", skins: allSkins.slice(0, 14) },
            { id: "vk", name: "VK", price: 0, img: "./images/1009.avif", skins: allSkins.slice(0, 14) }
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
// ================= OPEN CASE BY ID =================
function openCaseById(caseId, voucherOpen = false) {

    // Faqat telegram va vk caselariga 24 soatlik limit
    if (caseId === "telegram" || caseId === "vk") {

        const lastOpen = localStorage.getItem("case_open_" + caseId);

        if (lastOpen) {
            const passed = Date.now() - parseInt(lastOpen);

            if (passed < 24 * 60 * 60 * 1000) {

                const hours = Math.floor(
                    (24 * 60 * 60 * 1000 - passed) / (60 * 60 * 1000)
                );

                const minutes = Math.floor(
                    ((24 * 60 * 60 * 1000 - passed) % (60 * 60 * 1000)) /
                    (60 * 1000)
                );

                showTopPopup(
                    `⏳ Bu caseni qayta ochish uchun ${hours} soat ${minutes} daqiqa kuting!`,
                    "orange"
                );

                return;
            }
        }

        localStorage.setItem(
            "case_open_" + caseId,
            Date.now()
        );
    }

    // qolgan openCaseById kodi shu yerdan davom etadi...
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

if (!voucherOpen) {
    balance -= c.price;
    updateGlobalData();
}

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
${item.name.includes("Voucher")
    ? `<button class="sell-btn" onclick="activateVoucher(${i})">⚡ Activate</button>`
    : `<button class="sell-btn" onclick="sellItem(${i})">${i18n[currentLang].btn_sell}</button>`
}
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
    document.getElementById('balance').innerText =
        balance.toFixed(2);

    const previewBalance =
        document.getElementById('preview-balance');

    if (previewBalance) {
        previewBalance.innerText =
            balance.toFixed(2);
    }

    localStorage.setItem('balance', balance);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    renderInventory();
    updateUCBalance();
}

// ================= BO'LIMLARNI BOSHQARISH =================
function showSection(name) {
    // Barcha bo'limlar IDlari
    const sections = ['cases', 'games', 'inventory', 'profile'];
    
    sections.forEach(section => {
        const element = document.getElementById(section + '-section');
        if (element) {
            // Agar nomi mos kelsa 'hidden'ni olib tashlaymiz, aks holda qo'shamiz
            element.classList.toggle('hidden', name !== section);
        }
    });

    // Telegram MainButton ni xohlasangiz bo'limga qarab o'zgartirishingiz mumkin
    if (name === 'games') {
        tg.MainButton.hide(); 
    }
}

// ================= MODALLARNI YOPISH =================
function closeModal() {
    // Asosiy o'yin modalini yopish
    const gameModal = document.getElementById('game-modal');
    if (gameModal) gameModal.classList.add('hidden');
    
    // Yopish tugmasini yashirish
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.classList.add('hidden');
    
    // Case preview modalini ham yopib qo'yish (agar ochiq bo'lsa)
    const previewModal = document.getElementById('case-preview-modal');
    if (previewModal) previewModal.classList.add('hidden');
}


// ================= USER =================
document.getElementById('user-name').innerText = tg.initDataUnsafe.user?.first_name || "User";
if (tg.initDataUnsafe.user?.photo_url) {
    document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
}

// ================= PROMO CODES =================
const promoCodes = {
    // 💰 BZ beradiganlar
    "FREE100": { type: "balance", value: 100 },
    "CREATOR": { type: "balance", value: 500 },
    "NEWYEAR2026": { type: "balance", value: 100 },
    "KING009": { type: "balance", value: 500 },

    // 🎁 voucher beradiganlar
    "C6HLKE": { type: "voucher", value: 10 },
    "Y4AGN2": { type: "voucher", value: 100 },
    "0LBSV2": { type: "voucher", value: 500 },
    "V51JB8": { type: "voucher", value: 1000 }
};
function usePromoCode() {
    const input = document.getElementById("promo-input");
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showTopPopup("❌ Kod kiriting!", "red");
        return;
    }

    if (localStorage.getItem("promo_" + code)) {
        showTopPopup("😑 Bu promo code ishlatilgan!", "orange");
        return;
    }

    const promo = promoCodes[code];

    if (!promo) {
        showTopPopup("❌ Noto‘g‘ri promo code!", "red");
        return;
    }

    // BALANCE
    if (promo.type === "balance") {
        balance += promo.value;
        updateGlobalData();

        showTopPopup(`💰 +${promo.value} BZ olindi!`, "lime");
    }

    // VOUCHER
    if (promo.type === "voucher") {
        const voucher = {
            type: "voucher",
            name: `🎁 Voucher ${promo.value} BZ`,
            price: promo.value,
            rarity: "rarity-yellow",
            img: "./images/voucher.png",
            value: promo.value
        };

        inventory.push(voucher);
        updateGlobalData();

        showTopPopup(`🎁 Voucher (${promo.value} BZ) olindi!`, "lime");
    }

    localStorage.setItem("promo_" + code, "used");
    input.value = "";
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
                    <img src="./images/blaze.png" class="uc-icon"> ${c.price.toFixed(1)} BZ
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
        <img src="./images/blaze.png" class="bz-icon">
        <span>${selectedCase.price.toFixed(1)} BZ</span>
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
let currentDay =
    parseInt(localStorage.getItem("currentDay")) || 1;

let lastClaimedDay =
    parseInt(localStorage.getItem("lastClaimedDay")) || 0;

let streak =
    parseInt(localStorage.getItem("streak")) || 1;
function closeDailyReward() {
    document.getElementById("daily-reward-modal").classList.add("hidden");
}

function openDailyReward() {

    document.getElementById(
        "reward-balance"
    ).innerText =
    balance.toFixed(2);

    document.getElementById(
        "daily-counter"
    ).innerText =
    "Daily Counter : Day " + currentDay;

    renderDailyReward();

    document.getElementById(
        "daily-reward-modal"
    ).classList.remove("hidden");
}

function getButtonColor(day) {
    if (day < currentDay) return "red"; // oldingi kun olingan
    if (day === currentDay) return "green"; // bugungi kun
    return "gray"; // hali kelmagan
}
function claimReward(day) {

    const now = Date.now();

    const lastClaimTime =
        parseInt(localStorage.getItem("dailyClaimTime")) || 0;

    // ⛔ 24 soat blok
    if (lastClaimTime && now - lastClaimTime < 24 * 60 * 60 * 1000) {

        const remaining = (24 * 60 * 60 * 1000) - (now - lastClaimTime);

        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

        let text = "⏳ Keyingi reward uchun: ";

        if (hours > 0) text += `${hours} soat `;
        if (minutes > 0) text += `${minutes} daqiqa `;
        text += `${seconds} soniya kuting!`;

        showTopPopup(text, "orange");
        return;
    }

    if (day !== currentDay) {
        showTopPopup("❌ Bu kun ochilmagan!", "red");
        return;
    }

    // ❌ SHU JOY O‘CHIRILDI:
    // if (lastClaimedDay === day) {
    //     showTopPopup("❌ Allaqachon olingan!", "orange");
    //     return;
    // }

    // 🎁 REWARD
    if (day === 7) {
        inventory.push({
            name: "🎁 Voucher Day 7",
            price: 100,
            rarity: "rarity-yellow",
            img: "./images/voucher.png"
        });
    } else {
        balance += day * 10;
    }

    // SAVE
    lastClaimedDay = day;
    currentDay++;

    localStorage.setItem("dailyClaimTime", now);
    localStorage.setItem("currentDay", currentDay);
    localStorage.setItem("lastClaimedDay", lastClaimedDay);

    updateGlobalData();
    renderDailyReward();

let rewardText;

if (day === 7) {
    rewardText = `🎁 Voucher olindi (${100} BZ)!`;
} else {
    rewardText = `💰 +${day * 10} BZ olindi!`;
}

showTopPopup(rewardText, "lime");
}
function renderDailyReward() {

    const grid = document.getElementById("reward-grid");

    if (!grid) return;

    grid.innerHTML = "";

    for (let day = 1; day <= 7; day++) {

        const btn = document.createElement("button");

        btn.className = "reward-day";

        btn.innerText = "Day " + day;

        btn.style.background =
            getButtonColor(day);

        btn.onclick = () => claimReward(day);

        grid.appendChild(btn);
    }
}
function activateVoucher(i) {

    activeVoucherIndex = i;

    document
        .getElementById("voucher-case-modal")
        .classList.remove("hidden");

    renderVoucherCases();
}
function renderVoucherCases() {

    const container =
        document.getElementById("voucher-case-list");

    container.innerHTML = "";

    caseData.forEach(cat => {
        cat.cases.forEach(c => {

            const div = document.createElement("div");
            div.className = "case-card";

            div.innerHTML = `
                <img src="${c.img}">
                <div>${c.name}</div>
                <div>${c.price} BZ</div>

                <button onclick="tryOpenVoucherCase('${c.id}')">
                    OPEN
                </button>
            `;

            container.appendChild(div);
        });
    });
}
function tryOpenVoucherCase(caseId) {

    const voucher = inventory[activeVoucherIndex];
    if (!voucher) return;

    const c = caseData
        .flatMap(cat => cat.cases)
        .find(x => x.id === caseId);

    if (!c) return;

    // Voucher case narxidan katta yoki teng
    if (voucher.price >= c.price) {

        const remain = voucher.price - c.price;

        if (remain > 0) {
            balance += remain;

            showTopPopup(
                `💰 +${remain} BZ qaytarildi`,
                "lime"
            );
        }

    } else {

        // Voucher yetmaydi
        const diff = c.price - voucher.price;

        if (balance < diff) {
            showTopPopup(
                "❌ Mablag' yetarli emas!",
                "red"
            );
            return;
        }

        balance -= diff;

        showTopPopup(
            `💰 -${diff} BZ`,
            "orange"
        );
    }

// Voucher o'chiriladi
inventory.splice(activeVoucherIndex, 1);
activeVoucherIndex = null;

updateGlobalData();

closeVoucherModal();

// Voucher bilan ochilayotganini bildiradi
openCaseById(caseId, true);
}
function closeVoucherModal() {
    document
        .getElementById("voucher-case-modal")
        .classList.add("hidden");
}
function updateVoucherBalance(){
    const el = document.getElementById("voucher-balance");

    if(!el) return;

    el.innerText = balance.toFixed(2);
}
function updateDailyProgress() {
    const now = Date.now();

    let lastLoginTime = parseInt(localStorage.getItem("lastLoginTime")) || now;
    let passed = now - lastLoginTime;

    const RESET_TIME = 48 * 60 * 60 * 1000;

    let streak = parseInt(localStorage.getItem("streak")) || 1;

    // 🔴 48 soat kirmasa reset
    if (passed >= RESET_TIME) {
        streak = 1;
        currentDay = 1;

        showTopPopup(
            "🔄 48 soatdan ko'p kirmadingiz, streak reset bo‘ldi!",
            "orange"
        );
    }

    else {
        const DAY = 24 * 60 * 60 * 1000;

        if (passed >= DAY) {
            streak += Math.floor(passed / DAY);

            // 🔥 DISPLAY DAY doim 1–7 cycle
            currentDay = ((streak - 1) % 7) + 1;
        }
    }

    localStorage.setItem("streak", streak);
    localStorage.setItem("currentDay", currentDay);
    localStorage.setItem("lastLoginTime", now);
}
let dailyLastTime =
    parseInt(localStorage.getItem("dailyLastTime")) || 0;
let lastLoginTime =
    parseInt(localStorage.getItem("lastLoginTime")) || Date.now();
const images = [
    "./images/blaze-bg1.png",
    "./images/blaze-bg2.png",
    "./images/blaze-bg3.png"
];

const bg = document.querySelector(".blaze-bg");

// oxirgi indexni olish
let index = localStorage.getItem("bgIndex");
index = index ? parseInt(index) : 0;

// boshlang‘ich rasm
setBg(index);

function setBg(i){
    bg.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)),
        url('${images[i]}')
    `;
}

// 3 daqiqada almashtirish
setInterval(() => {
    index = (index + 1) % images.length;

    setBg(index);

    // saqlab qo'yamiz
    localStorage.setItem("bgIndex", index);
}, 1.5 * 60 * 1000);
// --- MUSIQA MANTIQI ---
const playlist = [
  "./audio/music1.mp3",
  "./audio/music2.mp3",
  "./audio/music3.mp3"
  ];
let currentIndex = parseInt(localStorage.getItem('musicIndex')) || 0;
let audio = new Audio(playlist[currentIndex]);

// Pleyer boshqaruvi
function togglePlay() {
    const btn = document.getElementById('play-pause-btn');
    if (audio.paused) {
        audio.play();
        btn.innerText = '⏸️';
    } else {
       (audio.play) 
        audio.pause();
        btn.innerText = '▶️';
    }
}

// Keyingi musiqa
function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    updateTrack();
}

// Oldingi musiqa
function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    updateTrack();
}

// Musiqani yangilash va saqlash
function updateTrack() {
    audio.src = playlist[currentIndex];
    document.getElementById('music-title').innerText = playlist[currentIndex];
    audio.play();
    document.getElementById('play-pause-btn').innerText = '⏸️';
    saveMusicState();
}

// Avtomatik keyingisiga o'tish (Loop)
audio.onended = () => nextTrack();

// Vaqtni hisoblash va saqlash
audio.ontimeupdate = () => {
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    document.getElementById('duration').innerText = formatTime(audio.duration || 0);
    localStorage.setItem('musicTime', audio.currentTime);
};

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return `${m < 10 ? '0'+m : m}:${sec < 10 ? '0'+sec : sec}`;
}

// Indexni saqlash
function saveMusicState() {
    localStorage.setItem('musicIndex', currentIndex);
}

// Sahifa yuklanganda holatni tiklash
window.onload = () => {
    audio.currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;
};
const wrapper = document.getElementById('blaze-wrapper');
const spans = document.querySelectorAll('#blaze-text span');

// 20 xil tasodifiy ranglar palitrasi
const colors20 = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
    '#00FFFF', '#FFA500', '#800080', '#FF4500', '#ADFF2F',
    '#FF1493', '#00BFFF', '#32CD32', '#FF8C00', '#8B0000',
    '#4B0082', '#008080', '#7FFFD4', '#DC143C', '#7CFC00'
];

// Glitch effekti uchun 5 xil neon ranglar palitrasi
const colors5 = [
    '#FF0000', '#39FF14', '#FFFF00', '#00FFFF', '#FF00FF'
];

let charQueue = [];

function getAvailableChar() {
    if (charQueue.length === 0) {
        charQueue = Array.from(spans);
    }
    const randomIndex = Math.floor(Math.random() * charQueue.length);
    return charQueue.splice(randomIndex, 1)[0];
}

// ==========================================
// 1. Asosiy to'kilish, tortishish (Gravity) va sudrash mantig'i
// ==========================================
function dropLetter() {
    const originalChar = getAvailableChar();
    if (!originalChar) return;

    // Asl harf o'rnida xira oq rangli harf qoldiramiz
    originalChar.classList.add('char-placeholder');

    const charSpan = document.createElement('div');
    charSpan.innerText = originalChar.innerText;
    charSpan.className = 'fallen-char';

    const randomColor = colors20[Math.floor(Math.random() * colors20.length)];
    charSpan.style.color = randomColor;
    charSpan.style.textShadow = `0 0 10px ${randomColor}`;

    const wrapperRect = wrapper.getBoundingClientRect();
    
    // RED ZONE (Qizil chegara hududi): Harflar tushib harakatlanadigan maydon balandligi 320px qilib belgilanadi
    const zoneHeight = 265; 
    const zoneWidth = wrapperRect.width > 0 ? wrapperRect.width : 320;
    
    charSpan.style.left = `${Math.random() * (zoneWidth - 50)}px`;
    charSpan.style.top = `-10px`;

    wrapper.appendChild(charSpan);

    // Harflar rasmda chizilgan uzun zonaning eng tagigacha qulab tushadi
    const targetY = zoneHeight - 75; 
    
    setTimeout(() => {
        charSpan.style.transition = 'top 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
        charSpan.style.top = `${targetY}px`;
    }, 50);

    // 15 sekunddan so'ng tushgan harfni olib tashlab, asl xira harfni asl holatga qaytaramiz
    setTimeout(() => {
        charSpan.remove();
        originalChar.classList.remove('char-placeholder');
    }, 15000);

    // Drag and Drop (Sudrash) mantig'i
    let activeItem = null;
    let shiftX, shiftY;

    const moveHandler = (e) => {
        if (!activeItem) return;
        e.preventDefault();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        // Harakatlanish chegarasini uzun zonaga moslaymiz, toki u qizil chiziq hududidan chiqib ketmasin
        const newLeft = Math.max(0, Math.min(clientX - shiftX - wrapperRect.left, zoneWidth - activeItem.offsetWidth));
        const newTop = Math.max(0, Math.min(clientY - shiftY - wrapperRect.top, zoneHeight - activeItem.offsetHeight));

        activeItem.style.left = `${newLeft}px`;
        activeItem.style.top = `${newTop}px`;
    };

    const endHandler = () => {
        if (!activeItem) return;
        
        // TORTISHISH KUCHI (Gravity): Foydalanuvchi qo'yib yuborganda temirdek og'ir bo'lib yana pastga - zonaning tubiga qulab tushadi
        activeItem.style.transition = 'top 0.3s cubic-bezier(0.5, 0, 1, 1)'; 
        activeItem.style.top = `${targetY}px`;

        activeItem = null;
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('mouseup', endHandler);
        document.removeEventListener('touchend', endHandler);
    };

    const startDrag = (e) => {
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }

        activeItem = charSpan;
        charSpan.style.transition = 'none'; 

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        shiftX = clientX - charSpan.getBoundingClientRect().left;
        shiftY = clientY - charSpan.getBoundingClientRect().top;

        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', endHandler);
        } else {
            document.addEventListener('touchmove', moveHandler, { passive: false });
            document.addEventListener('touchend', endHandler);
        }
    };

    charSpan.addEventListener('mousedown', startDrag);
    charSpan.addEventListener('touchstart', startDrag);
}

// Har 5 soniyada bitta harf tushishini boshlash
setInterval(dropLetter, 5000);

// ==========================================
// 2. 5 xil rangli Glitch effektini qo'shish mexanizmi
// ==========================================
function triggerGlitch() {
    if (spans.length === 0) return;

    const randomIndex = Math.floor(Math.random() * spans.length);
    const targetSpan = spans[randomIndex];

    // Agar harf to'kilib ketgan bo'lmasa (xira bo'lmasa), glitch effektini beramiz
    if (!targetSpan.classList.contains('char-placeholder')) {
        const randomColor = colors5[Math.floor(Math.random() * colors5.length)];
        
        targetSpan.style.color = randomColor;
        targetSpan.style.textShadow = `0 0 10px ${randomColor}`;
        targetSpan.classList.add('glitch-active');

        setTimeout(() => {
            targetSpan.classList.remove('glitch-active');
            targetSpan.style.color = '#ff4500'; 
            targetSpan.style.textShadow = '0 0 15px #ff0000';
        }, 600);
    }
}

// Har 1.5 soniyada ixtiyoriy harfda glitch effektini ishga tushiramiz
setInterval(triggerGlitch, 1500);

// ================= START =================
updateLanguageUI();
updateGlobalData();
updateVoucherBalance();
updateDailyProgress();
