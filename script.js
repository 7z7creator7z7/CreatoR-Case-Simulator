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

// 🔴 FIREBASE CONFIG
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

// ================= ANTI CHEAT =================
let lastAction = 0;
let spamCount = 0;
let blocked = false;

function antiCheat() {
    const now = Date.now();

    if (blocked) return false;

    if (now - lastAction < 250) {
        spamCount++;
    } else {
        spamCount = 0;
    }

    lastAction = now;

    if (spamCount > 10) {
        blocked = true;

        alert("⛔ Anti-Cheat: Juda tez bosyapsan!");

        setTimeout(() => {
            blocked = false;
            spamCount = 0;
        }, 5000);

        return false;
    }

    return true;
}

// ================= SOUND =================
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

document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") clickSound();
});

// ================= DATA =================
const i18n = {
    uz: {
        nav_cases: "🎁Keyslar",
        nav_inv: "🎒Inventar",
        nav_profile: "👤Profil",
        msg_money: "Pul yetarli emas!",
        msg_win: "Siz yutdingiz: "
    }
};

let currentLang = localStorage.getItem("lang") || "uz";
let balance = parseFloat(localStorage.getItem("balance")) || 1000;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// ================= SKINS =================
const allSkins = [
    { name: "P250", price: 3, rarity: "blue", img: "./images/5.png" },
    { name: "AK-47", price: 9, rarity: "blue", img: "./images/11.png" }
];

const caseData = [
    { name: "Oddiy", price: 10, skins: allSkins }
];

// ================= OPEN CASE (ANTI CHEAT ULANGAN) =================
function openCase(i) {

    if (!antiCheat()) return;

    const c = caseData[i];

    if (balance < c.price) {
        alert(i18n[currentLang].msg_money);
        return;
    }

    balance -= c.price;

    const item = c.skins[Math.floor(Math.random() * c.skins.length)];

    inventory.push(item);

    updateGlobal();

    saveUser();

    alert(i18n[currentLang].msg_win + item.name);
}

// ================= SELL ITEM =================
function sellItem(i) {

    if (!antiCheat()) return;

    balance += inventory[i].price;
    inventory.splice(i, 1);

    updateGlobal();
    saveUser();
}

// ================= GLOBAL UPDATE =================
function updateGlobal() {
    document.getElementById("balance").innerText = balance.toFixed(2);

    localStorage.setItem("balance", balance);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderInventory();
}

// ================= INVENTORY =================
function renderInventory() {
    const box = document.getElementById("inventory-list");
    if (!box) return;

    box.innerHTML = "";

    inventory.forEach((item, i) => {
        box.innerHTML += `
            <div>
                <img src="${item.img}">
                <b>${item.name}</b>
                <button onclick="sellItem(${i})">SELL</button>
            </div>
        `;
    });
}

// ================= CASES =================
function renderCases() {
    const box = document.getElementById("case-list");
    if (!box) return;

    box.innerHTML = "";

    caseData.forEach((c, i) => {
        box.innerHTML += `
            <div>
                <h3>${c.name}</h3>
                <p>${c.price}$</p>
                <button onclick="openCase(${i})">OPEN</button>
            </div>
        `;
    });
}

// ================= PROFILE =================
function saveUser() {

    const user = tg.initDataUnsafe.user;
    if (!user) return;

    setDoc(doc(db, "users", String(user.id)), {
        name: user.first_name,
        balance: balance
    });
}

// ================= LEADERBOARD =================
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

updateGlobal();
renderCases();
renderInventory();
saveUser();
