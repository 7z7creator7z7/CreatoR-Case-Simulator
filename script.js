// ================= SOUND SYSTEM =================

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
function levelUpSound() {

    if (!soundEnabled) return;

    const notes = [700, 950, 1300];

    notes.forEach((freq, i) => {

        setTimeout(() => {

            const osc =
                audioCtx.createOscillator();

            const gain =
                audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = "triangle";

            osc.frequency.value = freq;

            gain.gain.value = 0.05;

            osc.start();

            setTimeout(() => {

                osc.stop();

            }, 120);

        }, i * 140);

    });
}

// ================= TELEGRAM =================

const tg = window.Telegram.WebApp;

tg.expand();

// ================= SOUND SETTINGS =================

let soundEnabled =
    localStorage.getItem("soundEnabled");

if (soundEnabled === null) {

    soundEnabled = true;

} else {

    soundEnabled =
        soundEnabled === "true";
}

// ================= BUTTON SOUND =================

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

        title_cases: "👑 Keys Tanlang",
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

        title_cases: "👑 Select Case",
        title_inv: "🎒My Inventory",
        title_profile: "⚙️Settings",

        label_lang: "🇬🇧 Select Language:",
        label_stats: "📊 Your statistics will be here soon.⌛",

        btn_open: "Open",
        btn_sell: "⛔Sell",
        btn_close: "🚫Close",

        msg_money: "❌ Not enough money!",

        opening: "🎁 𐂅Opening case..."
    }
};

// ================= SAVE DATA =================

let currentLang =
    localStorage.getItem("lang") || "uz";

let balance =
    parseFloat(
        localStorage.getItem("balance")
    ) || 100;

let inventory =
    JSON.parse(
        localStorage.getItem("inventory")
    ) || [];

// ================= SKINS =================

const allSkins = [

    { name: "🔵 P250 🔵", price: 0.50, rarity: "rarity-blue", img: "./images/5.png"},
    { name: "🔵 UMP-45 🔵", price: 0.10, rarity: "rarity-blue", img: "./images/6.png"},
    { name: "🔵 FAMAS 🔵", price: 1.50, rarity: "rarity-blue", img: "./images/7.png"},
    { name: "🔵 AWP 🔵", price: 0.20, rarity: "rarity-blue", img: "./images/8.png"},
    { name: "🔵 NOVA 🔵", price: 3.50, rarity: "rarity-blue", img: "./images/9.png"},
    { name: "🔵 GLOCK-18 🔵", price: 4.30, rarity: "rarity-blue", img: "./images/10.png"},
    { name: "🔵 AK-47 🔵", price: 5.10, rarity: "rarity-blue", img: "./images/11.png"},
    { name: "🔵 USP-S 🔵", price: 6.80, rarity: "rarity-blue", img: "./images/12.png"},
    { name: "🔵 M4A4-1 🔵", price: 7.90, rarity: "rarity-blue", img: "./images/13.png"},
    { name: "🔵 SSG 08 🔵", price: 2.50, rarity: "rarity-blue", img: "./images/14.png"},
    { name: "🔵 P90 🔵", price: 3.90, rarity: "rarity-blue", img: "./images/15.png"},
    { name: "🔵 Desert Eagle 🔵", price: 4.50, rarity: "rarity-blue", img: "./images/16.png"},
    { name: "🔵 AWP 🔵", price: 9.50, rarity: "rarity-blue", img: "./images/17.png"},
    { name: "🔵 AK-47 🔵", price: 8.10, rarity: "rarity-blue", img: "./images/18.png"},

    { name: "💎 | SOMSA | 💎", price: 250, rarity: "rarity-rainbow", img: "./images/20.png"},
    { name: "💎 | Shaftoli | 💎", price: 250, rarity: "rarity-rainbow", img: "./images/21.png"},
    { name: "💎 | GILOS | 💎", price: 150, rarity: "rarity-rainbow", img: "./images/22.png"},
    { name: "💎 | ASM | 💎", price: 5000, rarity: "rarity-rainbow", img: "./images/19.png"},
];

// ================= RARITY =================

const rarityChances = {

    "rarity-blue": 50,
    "rarity-green": 25,
    "rarity-purple": 13,
    "rarity-yellow": 8,
    "rarity-red": 3,
    "rarity-rainbow": 1
};

// ================= RANDOM ITEM =================

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
            Math.random() *
            filteredItems.length
        )
    ];
}

// ================= CASES =================

const caseData = [

    { name: "🔰 Oddiy", price: 50, skins: allSkins.slice(0, 15) },

    { name: "💎 Elite", price: 100, skins: allSkins.slice(5, 16) },

    { name: "🎰 Lucky", price: 150, skins: allSkins.slice(6, 17) },

    { name: "🏆 Best Lucky", price: 275, skins: allSkins.slice(7, 19) },

    { name: "💩 Ochma", price: 15, skins: allSkins.slice(0, 8) }
];

// ================= LANGUAGE UI =================

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
// ================= RENDER CASES =================

function renderCases() {

    const container =
        document.getElementById('case-list');

    container.innerHTML = '';

    caseData.forEach((c, idx) => {

        const div =
            document.createElement('div');

        div.className = 'case-card';

        div.innerHTML = `
            <h3>${c.name}</h3>
            <p>${c.price}$</p>

            <button onclick="openCase(${idx})">
                ${i18n[currentLang].btn_open}
            </button>
        `;

        container.appendChild(div);
    });
}

// ================= OPEN CASE =================

function openCase(idx) {

    const c = caseData[idx];

    if (balance < c.price) {

        alert(i18n[currentLang].msg_money);
        return;
    }

    balance -= c.price;

    updateGlobalData();

    const modal =
        document.getElementById('game-modal');

    const carousel =
        document.getElementById('carousel');

    modal.classList.remove('hidden');

    carousel.innerHTML = '';

    carousel.style.transition = 'none';

    carousel.style.transform =
        'translateX(0)';

    const winIndex = 30;

    let winner;

    // ITEMS
    for (let i = 0; i < 45; i++) {

        const item =
            getRandomItem(c.skins);

        const card =
            document.createElement('div');

        card.className =
            `skin-card ${item.rarity}`;

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

    // CASE ANIMATION
    setTimeout(() => {

        carousel.style.transition =
            'transform 7s cubic-bezier(0.1,0,0.1,1)';

        carousel.style.transform =
            `translateX(-${(winIndex * 112) - 104}px)`;

    }, 100);

    // TICK SOUND
    let speed = 60;

    for (let i = 0; i < 35; i++) {

        setTimeout(() => {

            tickSound(600 + (i * 8));

        }, speed);

        speed += i * 12;
    }

// WIN
setTimeout(() => {

    inventory.push(winner);

    updateGlobalData();

    document.getElementById('close-modal')
        .classList.remove('hidden');

    // ===== WIN SOUND =====
levelUpSound();

    // ===== POPUP =====

    const popup =
        document.createElement("div");

    popup.className =
        "win-popup";

    popup.innerHTML = `

        <img src="${winner.img}">

        <div class="win-popup-info">

            <div class="win-popup-name">
                ${winner.name}
            </div>

            <div class="win-popup-price">
                💰 ${winner.price}$
            </div>

        </div>
    `;

    document.body.appendChild(popup);

    // SHOW
    setTimeout(() => {

        popup.classList.add("show");

    }, 50);

    // HIDE
    setTimeout(() => {

        popup.classList.remove("show");

        setTimeout(() => {

            popup.remove();

        }, 500);

    }, 4000);

}, 5600);
}

// ================= INVENTORY =================

function renderInventory() {

    const container =
        document.getElementById('inventory-list');

    container.innerHTML = '';

    inventory.forEach((item, i) => {

        const div =
            document.createElement('div');

        div.className =
            `inv-item ${item.rarity}`;

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

// ================= SELL ITEM =================

function sellItem(i) {

    balance += inventory[i].price;

    inventory.splice(i, 1);

    updateGlobalData();
}

// ================= CHANGE LANGUAGE =================

function changeLanguage(lang) {

    currentLang = lang;

    localStorage.setItem('lang', lang);

    updateLanguageUI();

    renderInventory();
}

// ================= SAVE DATA =================

function updateGlobalData() {

    document.getElementById('balance')
        .innerText =
        balance.toFixed(2);

    localStorage.setItem(
        'balance',
        balance
    );

    localStorage.setItem(
        'inventory',
        JSON.stringify(inventory)
    );

    renderInventory();
}

// ================= SECTIONS =================

function showSection(name) {

    document.getElementById('cases-section')
        .classList.toggle(
            'hidden',
            name !== 'cases'
        );

    document.getElementById('inventory-section')
        .classList.toggle(
            'hidden',
            name !== 'inventory'
        );

    document.getElementById('profile-section')
        .classList.toggle(
            'hidden',
            name !== 'profile'
        );
}

// ================= CLOSE MODAL =================

function closeModal() {

    document.getElementById('game-modal')
        .classList.add('hidden');

    document.getElementById('close-modal')
        .classList.add('hidden');
}

// ================= USER =================

document.getElementById('user-name')
    .innerText =
    tg.initDataUnsafe.user?.first_name || "User";

if (tg.initDataUnsafe.user?.photo_url) {

    document.getElementById('user-photo').src =
        tg.initDataUnsafe.user.photo_url;
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

    const input =
        document.getElementById("promo-input");

    const code =
        input.value.toUpperCase();

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

    setTimeout(() => {

        popup.remove();

    }, 5000);

    return;
}

    if (promoCodes[code]) {

        balance += promoCodes[code];

        updateGlobalData();

        localStorage.setItem(
            "promo_" + code,
            "used"
        );

        const popup =
            document.createElement("div");

        popup.innerHTML =
            "🎉 Muvaffaqiyatli! +" +
            promoCodes[code] + "$";

        popup.style.color = "lime";
        popup.style.background = "#222";
        popup.style.padding = "15px";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform =
            "translateX(-50%)";

        popup.style.borderRadius = "10px";

        popup.style.fontSize = "20px";

        popup.style.zIndex = "9999";

        document.body.appendChild(popup);

        setTimeout(() => {

            popup.remove();

        }, 5000);

        input.value = "";

    } else {

        const popup =
            document.createElement("div");

        popup.innerHTML =
            "❌ Noto'g'ri promo code!";

        popup.style.color = "red";
        popup.style.background = "#222";
        popup.style.padding = "15px";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.left = "50%";
        popup.style.transform =
            "translateX(-50%)";

        popup.style.borderRadius = "10px";

        popup.style.fontSize = "20px";

        popup.style.zIndex = "9999";

        document.body.appendChild(popup);

        setTimeout(() => {

            popup.remove();

        }, 5000);
    }
}

// ================= SOUND TOGGLE =================

const soundToggle =
    document.getElementById("sound-toggle");

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

// ================= START =================

updateLanguageUI();

updateGlobalData(); 
