// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// 🔴 O'ZINGNI FIREBASE CONFIGNI QO'Y
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= TELEGRAM =================
const tg = window.Telegram.WebApp;
tg.expand();

// ================= SOUND SYSTEM =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let soundEnabled = localStorage.getItem("soundEnabled");
soundEnabled = soundEnabled === null ? true : soundEnabled === "true";

function clickSound() {
    if (!soundEnabled) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = 500;

    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    setTimeout(() => osc.stop(), 60);
}

function tickSound(freq = 700) {
    if (!soundEnabled) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.value = freq;

    gain.gain.value = 0.03;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    setTimeout(() => osc.stop(), 40);
}

// BUTTON SOUND
document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") clickSound();
});

// ================= I18N =================
const i18n = {
    uz: {
        nav_cases: "🎁Keyslar",
        nav_inv: "🎒Inventar",
        nav_profile: "👤Profil",
        title_cases: "Keys Tanlang",
        title_inv: "Mening Inventarim",
        title_profile: "⚙️Sozlamalar",
        label_lang: "🇺🇿 Tilni tanlang:",
        label_stats: "Statistika tez orada...",
        btn_open: "Ochish",
        btn_sell: "Sotish",
        btn_close: "Yopish",
        msg_money: "Pul yetarli emas!",
        msg_win: "Siz yutdingiz: ",
        opening: "Ochilmoqda..."
    },
    en: {
        nav_cases: "Cases",
        nav_inv: "Inventory",
        nav_profile: "Profile",
        title_cases: "Select Case",
        title_inv: "My Inventory",
        title_profile: "Settings",
        label_lang: "Select Language:",
        label_stats: "Stats coming soon...",
        btn_open: "Open",
        btn_sell: "Sell",
        btn_close: "Close",
        msg_money: "Not enough money!",
        msg_win: "You won: ",
        opening: "Opening..."
    }
};

let currentLang = localStorage.getItem("lang") || "uz";
let balance = parseFloat(localStorage.getItem("balance")) || 1000;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ================= SKINS =================
const allSkins = [
    { name: "P250", price: 3, rarity: "blue", img: "./images/5.png" },
    { name: "UMP-45", price: 4, rarity: "blue", img: "./images/6.png" },
    { name: "AK-47", price: 9, rarity: "blue", img: "./images/11.png" },
];

// ================= RARITY =================
const rarityChances = {
    blue: 70,
    green: 20,
    purple: 7,
    red: 3
};

function getRandomItem(list) {
    const rarities = [...new Set(list.map(i => i.rarity))];
    let total = 0;
    let pool = {};

    rarities.forEach(r => {
        pool[r] = rarityChances[r] || 1;
        total += pool[r];
    });

    let rand = Math.random() * total;
    let selected;

    for (let r in pool) {
        rand -= pool[r];
        if (rand <= 0) {
            selected = r;
            break;
        }
    }

    const filtered = list.filter(i => i.rarity === selected);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// ================= CASES =================
const caseData = [
    { name: "Oddiy", price: 10, skins: allSkins }
];

// ================= UI =================
function updateLanguageUI() {
    const l = i18n[currentLang];

    document.getElementById("nav-cases").innerText = l.nav_cases;
    document.getElementById("nav-inv").innerText = l.nav_inv;
    document.getElementById("nav-profile").innerText = l.nav_profile;

    renderCases();
}

function renderCases() {
    const box = document.getElementById("case-list");
    box.innerHTML = "";

    caseData.forEach((c, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${c.name}</h3>
            <p>${c.price}$</p>
            <button onclick="openCase(${i})">OPEN</button>
        `;
        box.appendChild(div);
    });
}

// ================= CASE OPEN =================
function openCase(i) {
    const c = caseData[i];

    if (balance < c.price) return alert(i18n[currentLang].msg_money);

    balance -= c.price;
    updateGlobal();

    const item = getRandomItem(c.skins);

    inventory.push(item);
    updateGlobal();

    alert(i18n[currentLang].msg_win + item.name);
}

// ================= INVENTORY =================
function renderInventory() {
    const box = document.getElementById("inventory-list");
    box.innerHTML = "";

    inventory.forEach((item, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${item.img}">
            <b>${item.name}</b>
            <button onclick="sellItem(${i})">SELL</button>
        `;
        box.appendChild(div);
    });
}

function sellItem(i) {
    balance += inventory[i].price;
    inventory.splice(i, 1);
    updateGlobal();
}

// ================= GLOBAL =================
function updateGlobal() {
    document.getElementById("balance").innerText = balance.toFixed(2);

    localStorage.setItem("balance", balance);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderInventory();
}

// ================= PROFILE / LEADERBOARD =================
function saveUser() {
    const user = tg.initDataUnsafe.user;
    if (!user) return;

    setDoc(doc(db, "users", String(user.id)), {
        name: user.first_name,
        balance: balance
    });
}

function listenLeaderboard() {
    const q = query(
        collection(db, "users"),
        orderBy("balance", "desc"),
        limit(20)
    );

    onSnapshot(q, (snap) => {
        const box = document.getElementById("leaderboard");
        if (!box) return;

        box.innerHTML = "";

        let rank = 0;

        snap.forEach(d => {
            rank++;
            const u = d.data();

            box.innerHTML += `
                <div>
                    #${rank} ${u.name} - $${u.balance}
                </div>
            `;
        });
    });
}

// ================= NAV =================
function showSection(name) {
    document.getElementById("cases-section").style.display = name === "cases" ? "block" : "none";
    document.getElementById("inventory-section").style.display = name === "inventory" ? "block" : "none";
    document.getElementById("profile-section").style.display = name === "profile" ? "block" : "none";

    if (name === "profile") listenLeaderboard();
}

// ================= INIT =================
document.getElementById("user-name").innerText =
    tg.initDataUnsafe.user?.first_name || "User";

updateLanguageUI();
updateGlobal();

saveUser();
