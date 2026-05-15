// Telegram WebApp integratsiyasi
const tg = window.Telegram.WebApp;
tg.expand();

// Balans va promo kodlar
let balance = parseFloat(localStorage.getItem('balance')) || 100.00;
let usedPromos = JSON.parse(localStorage.getItem('usedPromos')) || [];
let referrals = JSON.parse(localStorage.getItem('referrals')) || [];
let dailyBonus = parseInt(localStorage.getItem('dailyBonus')) || 0;

// CASES massiv (misol uchun 5 ta, keyin 100 ta qo‘shamiz)
const cases = [
  { name: "10$ Case", price: 10, rarity: "blue", image: "images/case10.png" },
  { name: "30$ Case", price: 30, rarity: "darkblue", image: "images/case30.png" },
  { name: "50$ Case", price: 50, rarity: "darkblue", image: "images/case50.png" },
  { name: "100$ Case", price: 100, rarity: "gold", image: "images/case100.png" },
  { name: "1000$ Case", price: 1000, rarity: "red", image: "images/case1000.png" }
];

// INITIALIZATION
window.onload = () => {
  updateUI();
  renderCases();
  switchGame('crash');
  if (tg.initDataUnsafe.user?.photo_url) {
    document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
    document.getElementById('profile-photo').src = tg.initDataUnsafe.user.photo_url;
    document.getElementById('user-name').innerText = tg.initDataUnsafe.user?.first_name || "『CreatoR』";
    document.getElementById('profile-name').innerText = tg.initDataUnsafe.user?.first_name || "『CreatoR』";
  }
};

// Balans yangilash
function updateUI() {
  document.getElementById('balance').innerText = balance.toLocaleString('en-US', {minimumFractionDigits: 2});
  localStorage.setItem('balance', balance);
}

// CASES render
function renderCases() {
  const list = document.getElementById('case-list');
  list.innerHTML = cases.map(c => `
    <div class="case-card ${c.rarity}" onclick="openCase(${c.price}, '${c.name}')">
      <img src="${c.image}" alt="${c.name}" class="case-img">
      <h3>${c.name}</h3>
      <div class="price-tag">${c.price}$</div>
    </div>
  `).join('');
}

// Case ochish
function openCase(price, name) {
  if (balance < price) return alert("Mablag' yetarli emas!");
  balance -= price;
  updateUI();

  // Random item yutish
  const win = (Math.random() * price * 5).toFixed(2);
  alert(`Siz ${name} ochdingiz va yutdingiz: ${win}$`);
  balance += parseFloat(win);
  updateUI();
}
// 🚀 CRASH GAME
let crashInt;
let crashRunning = false;

function renderCrash(area) {
  area.innerHTML = `
    <div class="game-container">
      <h1 id="mult" style="font-size: 50px; color: var(--accent);">1.00x</h1>
      <input type="number" id="c-bet" placeholder="Tikish ($)">
      <input type="number" id="c-auto" placeholder="Avto-stop (Masalan: 2.0)">
      <button id="c-btn" onclick="startCrash()">TIKISH</button>
    </div>`;
}

function startCrash() {
  if (crashRunning) return;
  const bet = parseFloat(document.getElementById('c-bet').value);
  const auto = parseFloat(document.getElementById('c-auto').value) || 0;
  if (balance < bet || bet <= 0) return alert("Mablag' yetarli emas!");

  balance -= bet; updateUI();
  let m = 1.0;
  crashRunning = true;

  // Crash nuqtasi taqsimoti (Bulldrop uslubida)
  const rand = Math.random();
  let crashAt;
  if (rand < 0.5) crashAt = (Math.random() * 1.5 + 1).toFixed(2); // ko‘pincha 1–2.5x
  else if (rand < 0.8) crashAt = (Math.random() * 2 + 2.5).toFixed(2); // ba’zida 2.5–4.5x
  else if (rand < 0.95) crashAt = (Math.random() * 5 + 5).toFixed(2); // kamdan kam 5–10x
  else if (rand < 0.99) crashAt = (Math.random() * 15 + 10).toFixed(2); // juda kam 10–25x
  else crashAt = (Math.random() * 50 + 25).toFixed(2); // o‘ta kam 25–75x+

  document.getElementById('c-btn').innerText = "CASH OUT";
  document.getElementById('c-btn').onclick = () => {
    clearInterval(crashInt);
    balance += bet * m; updateUI();
    alert(`Yutdingiz: ${(bet * m).toFixed(2)}$`);
    resetCrash();
  };

  crashInt = setInterval(() => {
    m += 0.01;
    document.getElementById('mult').innerText = m.toFixed(2) + "x";
    if (auto > 1 && m >= auto) document.getElementById('c-btn').click();
    if (m >= crashAt) {
      clearInterval(crashInt);
      document.getElementById('mult').style.color = "red";
      alert("Crash!");
      resetCrash();
    }
  }, 100);
}

function resetCrash() {
  crashRunning = false;
  document.getElementById('c-btn').innerText = "TIKISH";
  document.getElementById('c-btn').onclick = startCrash;
  document.getElementById('mult').style.color = "var(--accent)";
}
// 💣 MINES GAME
let minesGrid = [];
let minesRunning = false;
let minesBet = 0;
let minesBombs = 3;

function renderMines(area) {
  area.innerHTML = `
    <div class="game-container">
      <h2>Mines O'yini</h2>
      <input type="number" id="m-bet" placeholder="Tikish ($)">
      <input type="number" id="m-bombs" placeholder="Bombalar soni (3-10)" value="3">
      <button onclick="startMines()">Boshlash</button>
      <div id="mines-grid" class="grid"></div>
    </div>`;
}

function startMines() {
  if (minesRunning) return;
  minesBet = parseFloat(document.getElementById('m-bet').value);
  minesBombs = parseInt(document.getElementById('m-bombs').value) || 3;
  if (balance < minesBet || minesBet <= 0) return alert("Mablag' yetarli emas!");

  balance -= minesBet; updateUI();
  minesRunning = true;
  minesGrid = Array(25).fill("safe");

  // Bombalarni joylash
  for (let i = 0; i < minesBombs; i++) {
    let pos;
    do { pos = Math.floor(Math.random() * 25); }
    while (minesGrid[pos] === "bomb");
    minesGrid[pos] = "bomb";
  }

  renderMinesGrid();
}

function renderMinesGrid() {
  const grid = document.getElementById('mines-grid');
  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(5, 60px)";
  grid.style.gap = "5px";

  minesGrid.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.innerText = "?";
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.onclick = () => revealMine(i, btn);
    grid.appendChild(btn);
  });
}

function revealMine(i, btn) {
  if (!minesRunning) return;
  if (minesGrid[i] === "bomb") {
    btn.style.background = "red";
    alert("💥 Bombaga tushdingiz! O'yin tugadi.");
    minesRunning = false;
  } else {
    btn.style.background = "green";
    btn.innerText = "✔";
    const win = (minesBet * 0.3).toFixed(2); // har bir safe joy 30% qo‘shadi
    balance += parseFloat(win);
    updateUI();
  }
}
// ⚡ UPGRADE GAME
function renderUpgrade(area) {
  area.innerHTML = `
    <div class="game-container">
      <h2>Upgrade O'yini</h2>
      <input type="number" id="u-bet" placeholder="Tikish ($)">
      <select id="u-risk">
        <option value="low">Past risk (2x)</option>
        <option value="medium">O'rta risk (5x)</option>
        <option value="high">Yuqori risk (10x)</option>
      </select>
      <button onclick="startUpgrade()">Boshlash</button>
    </div>`;
}

function startUpgrade() {
  const bet = parseFloat(document.getElementById('u-bet').value);
  const risk = document.getElementById('u-risk').value;
  if (balance < bet || bet <= 0) return alert("Mablag' yetarli emas!");

  balance -= bet; updateUI();

  let multiplier, chance;
  if (risk === "low") { multiplier = 2; chance = 0.7; }
  else if (risk === "medium") { multiplier = 5; chance = 0.4; }
  else { multiplier = 10; chance = 0.2; }

  if (Math.random() < chance) {
    const win = bet * multiplier;
    balance += win;
    updateUI();
    alert(`🎉 Yutdingiz: ${win.toFixed(2)}$`);
  } else {
    alert("❌ Yutqazdingiz!");
  }
    }
// 🎯 PLINKO GAME
function renderPlinko(area) {
  area.innerHTML = `
    <div class="game-container">
      <h2>Plinko O'yini</h2>
      <input type="number" id="p-bet" placeholder="Tikish ($)">
      <button onclick="startPlinko()">Boshlash</button>
      <div id="plinko-board"></div>
    </div>`;
}

function startPlinko() {
  const bet = parseFloat(document.getElementById('p-bet').value);
  if (balance < bet || bet <= 0) return alert("Mablag' yetarli emas!");

  balance -= bet; updateUI();

  // Multiplikator variantlari
  const multipliers = [0, 0.5, 1, 2, 5, 10];
  const randIndex = Math.floor(Math.random() * multipliers.length);
  const result = multipliers[randIndex];

  const win = bet * result;
  balance += win;
  updateUI();

  const board = document.getElementById('plinko-board');
  board.innerHTML = `
    <p>Chip tushdi: ${result}x</p>
    <p>Yutdingiz: ${win.toFixed(2)}$</p>
  `;
}
// 🎡 KONTAKT GAME
function renderKontakt(area) {
  area.innerHTML = `
    <div class="game-container">
      <h2>Kontakt O'yini</h2>
      <input type="number" id="k-bet" placeholder="Tikish ($)">
      <button onclick="startKontakt()">Boshlash</button>
      <div id="kontakt-result"></div>
    </div>`;
}

function startKontakt() {
  const bet = parseFloat(document.getElementById('k-bet').value);
  if (balance < bet || bet <= 0) return alert("Mablag' yetarli emas!");

  balance -= bet; updateUI();

  // Baraban aylanishi
  const rand = Math.random();
  let multiplier;
  if (rand < 0.5) multiplier = 1;       // 50% oddiy
  else if (rand < 0.75) multiplier = 2; // 25% ikki baravar
  else if (rand < 0.9) multiplier = 5;  // 15% besh baravar
  else if (rand < 0.98) multiplier = 10; // 8% o‘n baravar
  else multiplier = 50;                 // 2% juda katta

  const win = bet * multiplier;
  balance += win;
  updateUI();

  const resultBox = document.getElementById('kontakt-result');
  resultBox.innerHTML = `
    <p>Baraban to‘xtadi: ${multiplier}x</p>
    <p>Yutdingiz: ${win.toFixed(2)}$</p>
  `;
    }
// 🏆 TOP REYTING
let topPlayers = JSON.parse(localStorage.getItem('topPlayers')) || [];

function updateTopPlayers(name, balance) {
  topPlayers.push({ name, balance });
  topPlayers.sort((a, b) => b.balance - a.balance);
  topPlayers = topPlayers.slice(0, 30); // faqat Top 30
  localStorage.setItem('topPlayers', JSON.stringify(topPlayers));
}

function renderTopPlayers(area) {
  area.innerHTML = "<h2>Top Reyting</h2>";
  const list = document.createElement("ol");
  topPlayers.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.name} — ${p.balance.toFixed(2)}$`;
    list.appendChild(li);
  });
  area.appendChild(list);
}

// 💬 GLOBAL CHAT
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

function sendMessage() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const user = tg.initDataUnsafe.user?.first_name || "『CreatoR』";
  chatMessages.push({ user, msg });
  localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  input.value = "";
  renderChat();
}

function renderChat() {
  const box = document.getElementById('chat-box');
  box.innerHTML = "";
  chatMessages.slice(-50).forEach(m => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${m.user}:</b> ${m.msg}`;
    box.appendChild(div);
  });
}
// 📦 CASES MASSIV
const cases = [
  {
    name: "Starter Case",
    price: 10,
    rarity: "blue",
    image: "images/case10.png",
    items: [
      { name: "Pistol Skin", value: 5, rarity: "blue" },
      { name: "Knife Skin", value: 15, rarity: "darkblue" }
    ]
  },
  {
    name: "Warrior Case",
    price: 30,
    rarity: "darkblue",
    image: "images/case30.png",
    items: [
      { name: "AK47 Skin", value: 20, rarity: "darkblue" },
      { name: "M4A1 Skin", value: 40, rarity: "gold" }
    ]
  },
  {
    name: "Legend Case",
    price: 100,
    rarity: "gold",
    image: "images/case100.png",
    items: [
      { name: "Dragon Lore", value: 250, rarity: "red" },
      { name: "Golden Karambit", value: 500, rarity: "ultimate" }
    ]
  },
  {
    name: "Mythic Case",
    price: 500,
    rarity: "red",
    image: "images/case500.png",
    items: [
      { name: "Mythic Helmet", value: 600, rarity: "red" },
      { name: "Mythic Armor", value: 800, rarity: "ultimate" }
    ]
  },
  {
    name: "Ultimate Case",
    price: 1000,
    rarity: "ultimate",
    image: "images/case1000.png",
    items: [
      { name: "Ultimate Sword", value: 1500, rarity: "ultimate" },
      { name: "Ultimate Shield", value: 2000, rarity: "ultimate" }
    ]
  }
];const cases = [
  {
    name: "Starter Case",
    price: 10,
    rarity: "blue",
    image: "images/case1.png",
    items: [
      { name: "Basic Pistol", value: 5, rarity: "blue" },
      { name: "Rusty Knife", value: 15, rarity: "darkblue" }
    ]
  },
  {
    name: "Soldier Case",
    price: 20,
    rarity: "blue",
    image: "images/case2.png",
    items: [
      { name: "AK47 Skin", value: 25, rarity: "darkblue" },
      { name: "M4A1 Skin", value: 30, rarity: "gold" }
    ]
  },
  {
    name: "Warrior Case",
    price: 30,
    rarity: "darkblue",
    image: "images/case3.png",
    items: [
      { name: "Sniper Rifle", value: 40, rarity: "darkblue" },
      { name: "Shotgun Skin", value: 50, rarity: "gold" }
    ]
  },
  {
    name: "Elite Case",
    price: 50,
    rarity: "darkblue",
    image: "images/case4.png",
    items: [
      { name: "Golden AK", value: 70, rarity: "gold" },
      { name: "Silver M4", value: 80, rarity: "gold" }
    ]
  },
  {
    name: "Legend Case",
    price: 100,
    rarity: "gold",
    image: "images/case5.png",
    items: [
      { name: "Dragon Lore", value: 250, rarity: "red" },
      { name: "Golden Karambit", value: 500, rarity: "ultimate" }
    ]
  },
  {
    name: "Mythic Case",
    price: 200,
    rarity: "red",
    image: "images/case6.png",
    items: [
      { name: "Mythic Helmet", value: 300, rarity: "red" },
      { name: "Mythic Armor", value: 400, rarity: "ultimate" }
    ]
  },
  {
    name: "Ultimate Case",
    price: 500,
    rarity: "ultimate",
    image: "images/case7.png",
    items: [
      { name: "Ultimate Sword", value: 700, rarity: "ultimate" },
      { name: "Ultimate Shield", value: 900, rarity: "ultimate" }
    ]
  },
  {
    name: "Royal Case",
    price: 750,
    rarity: "gold",
    image: "images/case8.png",
    items: [
      { name: "Royal Crown", value: 1000, rarity: "red" },
      { name: "Royal Armor", value: 1200, rarity: "ultimate" }
    ]
  },
  {
    name: "Epic Case",
    price: 1000,
    rarity: "red",
    image: "images/case9.png",
    items: [
      { name: "Epic Sword", value: 1500, rarity: "ultimate" },
      { name: "Epic Shield", value: 2000, rarity: "ultimate" }
    ]
  },
  {
    name: "Godlike Case",
    price: 2000,
    rarity: "ultimate",
    image: "images/case10.png",
    items: [
      { name: "Godlike Blade", value: 3000, rarity: "ultimate" },
      { name: "Godlike Armor", value: 4000, rarity: "ultimate" }
    ]
  }
];{
  name: "Hunter Case",
  price: 25,
  rarity: "blue",
  image: "images/case11.png",
  items: [
    { name: "Hunter Knife", value: 30, rarity: "darkblue" },
    { name: "Hunter Rifle", value: 35, rarity: "gold" }
  ]
},
{
  name: "Sniper Case",
  price: 40,
  rarity: "darkblue",
  image: "images/case12.png",
  items: [
    { name: "Sniper Scope", value: 50, rarity: "gold" },
    { name: "Sniper Rifle Pro", value: 60, rarity: "red" }
  ]
},
{
  name: "Assassin Case",
  price: 60,
  rarity: "darkblue",
  image: "images/case13.png",
  items: [
    { name: "Silent Pistol", value: 70, rarity: "gold" },
    { name: "Assassin Blade", value: 90, rarity: "red" }
  ]
},
{
  name: "Champion Case",
  price: 120,
  rarity: "gold",
  image: "images/case14.png",
  items: [
    { name: "Champion Medal", value: 150, rarity: "red" },
    { name: "Champion Armor", value: 200, rarity: "ultimate" }
  ]
},
{
  name: "Titan Case",
  price: 250,
  rarity: "red",
  image: "images/case15.png",
  items: [
    { name: "Titan Hammer", value: 300, rarity: "red" },
    { name: "Titan Shield", value: 400, rarity: "ultimate" }
  ]
},
{
  name: "Phoenix Case",
  price: 350,
  rarity: "red",
  image: "images/case16.png",
  items: [
    { name: "Phoenix Wings", value: 500, rarity: "ultimate" },
    { name: "Phoenix Flame", value: 600, rarity: "ultimate" }
  ]
},
{
  name: "Galaxy Case",
  price: 600,
  rarity: "ultimate",
  image: "images/case17.png",
  items: [
    { name: "Galaxy Orb", value: 800, rarity: "ultimate" },
    { name: "Galaxy Sword", value: 1000, rarity: "ultimate" }
  ]
},
{
  name: "Cosmic Case",
  price: 800,
  rarity: "ultimate",
  image: "images/case18.png",
  items: [
    { name: "Cosmic Helmet", value: 1200, rarity: "ultimate" },
    { name: "Cosmic Armor", value: 1500, rarity: "ultimate" }
  ]
},
{
  name: "Infinity Case",
  price: 1500,
  rarity: "ultimate",
  image: "images/case19.png",
  items: [
    { name: "Infinity Blade", value: 2000, rarity: "ultimate" },
    { name: "Infinity Shield", value: 2500, rarity: "ultimate" }
  ]
},
{
  name: "Divine Case",
  price: 2500,
  rarity: "ultimate",
  image: "images/case20.png",
  items: [
    { name: "Divine Crown", value: 3000, rarity: "ultimate" },
    { name: "Divine Armor", value: 4000, rarity: "ultimate" }
  ]
    }
{
  name: "Shadow Case",
  price: 35,
  rarity: "blue",
  image: "images/case21.png",
  items: [
    { name: "Shadow Dagger", value: 40, rarity: "darkblue" },
    { name: "Shadow Mask", value: 50, rarity: "gold" }
  ]
},
{
  name: "Steel Case",
  price: 55,
  rarity: "darkblue",
  image: "images/case22.png",
  items: [
    { name: "Steel Sword", value: 70, rarity: "gold" },
    { name: "Steel Armor", value: 90, rarity: "red" }
  ]
},
{
  name: "Blaze Case",
  price: 80,
  rarity: "darkblue",
  image: "images/case23.png",
  items: [
    { name: "Blaze Gun", value: 100, rarity: "gold" },
    { name: "Blaze Flame", value: 120, rarity: "red" }
  ]
},
{
  name: "Knight Case",
  price: 150,
  rarity: "gold",
  image: "images/case24.png",
  items: [
    { name: "Knight Sword", value: 200, rarity: "red" },
    { name: "Knight Shield", value: 250, rarity: "ultimate" }
  ]
},
{
  name: "Samurai Case",
  price: 300,
  rarity: "red",
  image: "images/case25.png",
  items: [
    { name: "Samurai Katana", value: 350, rarity: "red" },
    { name: "Samurai Armor", value: 450, rarity: "ultimate" }
  ]
},
{
  name: "Dragon Case",
  price: 450,
  rarity: "red",
  image: "images/case26.png",
  items: [
    { name: "Dragon Fang", value: 600, rarity: "ultimate" },
    { name: "Dragon Scale", value: 700, rarity: "ultimate" }
  ]
},
{
  name: "Nebula Case",
  price: 700,
  rarity: "ultimate",
  image: "images/case27.png",
  items: [
    { name: "Nebula Orb", value: 900, rarity: "ultimate" },
    { name: "Nebula Armor", value: 1100, rarity: "ultimate" }
  ]
},
{
  name: "Starlight Case",
  price: 950,
  rarity: "ultimate",
  image: "images/case28.png",
  items: [
    { name: "Starlight Crown", value: 1300, rarity: "ultimate" },
    { name: "Starlight Blade", value: 1500, rarity: "ultimate" }
  ]
},
{
  name: "Eternal Case",
  price: 1800,
  rarity: "ultimate",
  image: "images/case29.png",
  items: [
    { name: "Eternal Sword", value: 2200, rarity: "ultimate" },
    { name: "Eternal Shield", value: 2500, rarity: "ultimate" }
  ]
},
{
  name: "Immortal Case",
  price: 3000,
  rarity: "ultimate",
  image: "images/case30.png",
  items: [
    { name: "Immortal Crown", value: 3500, rarity: "ultimate" },
    { name: "Immortal Armor", value: 4000, rarity: "ultimate" }
  ]
    }
{
  name: "Venom Case",
  price: 45,
  rarity: "blue",
  image: "images/case31.png",
  items: [
    { name: "Venom Knife", value: 55, rarity: "darkblue" },
    { name: "Venom Mask", value: 65, rarity: "gold" }
  ]
},
{
  name: "Iron Case",
  price: 70,
  rarity: "darkblue",
  image: "images/case32.png",
  items: [
    { name: "Iron Sword", value: 85, rarity: "gold" },
    { name: "Iron Armor", value: 100, rarity: "red" }
  ]
},
{
  name: "Flame Case",
  price: 90,
  rarity: "darkblue",
  image: "images/case33.png",
  items: [
    { name: "Flame Gun", value: 110, rarity: "gold" },
    { name: "Flame Orb", value: 130, rarity: "red" }
  ]
},
{
  name: "Paladin Case",
  price: 160,
  rarity: "gold",
  image: "images/case34.png",
  items: [
    { name: "Paladin Sword", value: 210, rarity: "red" },
    { name: "Paladin Shield", value: 260, rarity: "ultimate" }
  ]
},
{
  name: "Ronin Case",
  price: 320,
  rarity: "red",
  image: "images/case35.png",
  items: [
    { name: "Ronin Katana", value: 370, rarity: "red" },
    { name: "Ronin Armor", value: 470, rarity: "ultimate" }
  ]
},
{
  name: "Hydra Case",
  price: 480,
  rarity: "red",
  image: "images/case36.png",
  items: [
    { name: "Hydra Fang", value: 650, rarity: "ultimate" },
    { name: "Hydra Scale", value: 750, rarity: "ultimate" }
  ]
},
{
  name: "Meteor Case",
  price: 720,
  rarity: "ultimate",
  image: "images/case37.png",
  items: [
    { name: "Meteor Orb", value: 950, rarity: "ultimate" },
    { name: "Meteor Armor", value: 1150, rarity: "ultimate" }
  ]
},
{
  name: "Solar Case",
  price: 980,
  rarity: "ultimate",
  image: "images/case38.png",
  items: [
    { name: "Solar Crown", value: 1350, rarity: "ultimate" },
    { name: "Solar Blade", value: 1550, rarity: "ultimate" }
  ]
},
{
  name: "Timeless Case",
  price: 1900,
  rarity: "ultimate",
  image: "images/case39.png",
  items: [
    { name: "Timeless Sword", value: 2300, rarity: "ultimate" },
    { name: "Timeless Shield", value: 2600, rarity: "ultimate" }
  ]
},
{
  name: "Celestial Case",
  price: 3100,
  rarity: "ultimate",
  image: "images/case40.png",
  items: [
    { name: "Celestial Crown", value: 3600, rarity: "ultimate" },
    { name: "Celestial Armor", value: 4200, rarity: "ultimate" }
  ]
}
{
  name: "Poison Case",
  price: 50,
  rarity: "blue",
  image: "images/case41.png",
  items: [
    { name: "Poison Dagger", value: 60, rarity: "darkblue" },
    { name: "Poison Mask", value: 70, rarity: "gold" }
  ]
},
{
  name: "Bronze Case",
  price: 75,
  rarity: "darkblue",
  image: "images/case42.png",
  items: [
    { name: "Bronze Sword", value: 90, rarity: "gold" },
    { name: "Bronze Armor", value: 110, rarity: "red" }
  ]
},
{
  name: "Inferno Case",
  price: 100,
  rarity: "darkblue",
  image: "images/case43.png",
  items: [
    { name: "Inferno Gun", value: 120, rarity: "gold" },
    { name: "Inferno Orb", value: 140, rarity: "red" }
  ]
},
{
  name: "Guardian Case",
  price: 170,
  rarity: "gold",
  image: "images/case44.png",
  items: [
    { name: "Guardian Sword", value: 220, rarity: "red" },
    { name: "Guardian Shield", value: 270, rarity: "ultimate" }
  ]
},
{
  name: "Shogun Case",
  price: 340,
  rarity: "red",
  image: "images/case45.png",
  items: [
    { name: "Shogun Katana", value: 390, rarity: "red" },
    { name: "Shogun Armor", value: 490, rarity: "ultimate" }
  ]
},
{
  name: "Leviathan Case",
  price: 500,
  rarity: "red",
  image: "images/case46.png",
  items: [
    { name: "Leviathan Fang", value: 680, rarity: "ultimate" },
    { name: "Leviathan Scale", value: 780, rarity: "ultimate" }
  ]
},
{
  name: "Comet Case",
  price: 750,
  rarity: "ultimate",
  image: "images/case47.png",
  items: [
    { name: "Comet Orb", value: 950, rarity: "ultimate" },
    { name: "Comet Armor", value: 1150, rarity: "ultimate" }
  ]
},
{
  name: "Lunar Case",
  price: 1000,
  rarity: "ultimate",
  image: "images/case48.png",
  items: [
    { name: "Lunar Crown", value: 1400, rarity: "ultimate" },
    { name: "Lunar Blade", value: 1600, rarity: "ultimate" }
  ]
},
{
  name: "Ancient Case",
  price: 2000,
  rarity: "ultimate",
  image: "images/case49.png",
  items: [
    { name: "Ancient Sword", value: 2400, rarity: "ultimate" },
    { name: "Ancient Shield", value: 2800, rarity: "ultimate" }
  ]
},
{
  name: "Divinity Case",
  price: 3500,
  rarity: "ultimate",
  image: "images/case50.png",
  items: [
    { name: "Divinity Crown", value: 4000, rarity: "ultimate" },
    { name: "Divinity Armor", value: 4500, rarity: "ultimate" }
  ]
}
{
  name: "Toxic Case",
  price: 55,
  rarity: "blue",
  image: "images/case51.png",
  items: [
    { name: "Toxic Knife", value: 65, rarity: "darkblue" },
    { name: "Toxic Mask", value: 75, rarity: "gold" }
  ]
},
{
  name: "Silver Case",
  price: 85,
  rarity: "darkblue",
  image: "images/case52.png",
  items: [
    { name: "Silver Sword", value: 100, rarity: "gold" },
    { name: "Silver Armor", value: 120, rarity: "red" }
  ]
},
{
  name: "Ember Case",
  price: 110,
  rarity: "darkblue",
  image: "images/case53.png",
  items: [
    { name: "Ember Gun", value: 130, rarity: "gold" },
    { name: "Ember Orb", value: 150, rarity: "red" }
  ]
},
{
  name: "Protector Case",
  price: 180,
  rarity: "gold",
  image: "images/case54.png",
  items: [
    { name: "Protector Sword", value: 230, rarity: "red" },
    { name: "Protector Shield", value: 280, rarity: "ultimate" }
  ]
},
{
  name: "Ninja Case",
  price: 360,
  rarity: "red",
  image: "images/case55.png",
  items: [
    { name: "Ninja Katana", value: 410, rarity: "red" },
    { name: "Ninja Armor", value: 510, rarity: "ultimate" }
  ]
},
{
  name: "Kraken Case",
  price: 520,
  rarity: "red",
  image: "images/case56.png",
  items: [
    { name: "Kraken Fang", value: 700, rarity: "ultimate" },
    { name: "Kraken Scale", value: 800, rarity: "ultimate" }
  ]
},
{
  name: "Asteroid Case",
  price: 770,
  rarity: "ultimate",
  image: "images/case57.png",
  items: [
    { name: "Asteroid Orb", value: 970, rarity: "ultimate" },
    { name: "Asteroid Armor", value: 1170, rarity: "ultimate" }
  ]
},
{
  name: "Eclipse Case",
  price: 1050,
  rarity: "ultimate",
  image: "images/case58.png",
  items: [
    { name: "Eclipse Crown", value: 1450, rarity: "ultimate" },
    { name: "Eclipse Blade", value: 1650, rarity: "ultimate" }
  ]
},
{
  name: "Oracle Case",
  price: 2100,
  rarity: "ultimate",
  image: "images/case59.png",
  items: [
    { name: "Oracle Sword", value: 2500, rarity: "ultimate" },
    { name: "Oracle Shield", value: 2900, rarity: "ultimate" }
  ]
},
{
  name: "Sanctum Case",
  price: 3600,
  rarity: "ultimate",
  image: "images/case60.png",
  items: [
    { name: "Sanctum Crown", value: 4100, rarity: "ultimate" },
    { name: "Sanctum Armor", value: 4700, rarity: "ultimate" }
  ]
    }
{
  name: "Venus Case",
  price: 60,
  rarity: "blue",
  image: "images/case61.png",
  items: [
    { name: "Venus Dagger", value: 70, rarity: "darkblue" },
    { name: "Venus Mask", value: 80, rarity: "gold" }
  ]
},
{
  name: "Platinum Case",
  price: 95,
  rarity: "darkblue",
  image: "images/case62.png",
  items: [
    { name: "Platinum Sword", value: 110, rarity: "gold" },
    { name: "Platinum Armor", value: 130, rarity: "red" }
  ]
},
{
  name: "Infernal Case",
  price: 120,
  rarity: "darkblue",
  image: "images/case63.png",
  items: [
    { name: "Infernal Gun", value: 140, rarity: "gold" },
    { name: "Infernal Orb", value: 160, rarity: "red" }
  ]
},
{
  name: "Defender Case",
  price: 190,
  rarity: "gold",
  image: "images/case64.png",
  items: [
    { name: "Defender Sword", value: 240, rarity: "red" },
    { name: "Defender Shield", value: 290, rarity: "ultimate" }
  ]
},
{
  name: "Shinobi Case",
  price: 380,
  rarity: "red",
  image: "images/case65.png",
  items: [
    { name: "Shinobi Katana", value: 430, rarity: "red" },
    { name: "Shinobi Armor", value: 530, rarity: "ultimate" }
  ]
},
{
  name: "Poseidon Case",
  price: 540,
  rarity: "red",
  image: "images/case66.png",
  items: [
    { name: "Poseidon Trident", value: 720, rarity: "ultimate" },
    { name: "Poseidon Armor", value: 820, rarity: "ultimate" }
  ]
},
{
  name: "Galaxy Nova Case",
  price: 790,
  rarity: "ultimate",
  image: "images/case67.png",
  items: [
    { name: "Nova Orb", value: 990, rarity: "ultimate" },
    { name: "Nova Armor", value: 1190, rarity: "ultimate" }
  ]
},
{
  name: "Solaris Case",
  price: 1100,
  rarity: "ultimate",
  image: "images/case68.png",
  items: [
    { name: "Solaris Crown", value: 1500, rarity: "ultimate" },
    { name: "Solaris Blade", value: 1700, rarity: "ultimate" }
  ]
},
{
  name: "Oracle Prime Case",
  price: 2200,
  rarity: "ultimate",
  image: "images/case69.png",
  items: [
    { name: "Oracle Prime Sword", value: 2600, rarity: "ultimate" },
    { name: "Oracle Prime Shield", value: 3000, rarity: "ultimate" }
  ]
},
{
  name: "Sanctuary Case",
  price: 3700,
  rarity: "ultimate",
  image: "images/case70.png",
  items: [
    { name: "Sanctuary Crown", value: 4200, rarity: "ultimate" },
    { name: "Sanctuary Armor", value: 4800, rarity: "ultimate" }
  ]
     }
{
  name: "Mercury Case",
  price: 65,
  rarity: "blue",
  image: "images/case71.png",
  items: [
    { name: "Mercury Dagger", value: 75, rarity: "darkblue" },
    { name: "Mercury Mask", value: 85, rarity: "gold" }
  ]
},
{
  name: "Diamond Case",
  price: 100,
  rarity: "darkblue",
  image: "images/case72.png",
  items: [
    { name: "Diamond Sword", value: 120, rarity: "gold" },
    { name: "Diamond Armor", value: 140, rarity: "red" }
  ]
},
{
  name: "Volcano Case",
  price: 130,
  rarity: "darkblue",
  image: "images/case73.png",
  items: [
    { name: "Volcano Gun", value: 150, rarity: "gold" },
    { name: "Volcano Orb", value: 170, rarity: "red" }
  ]
},
{
  name: "Protector Prime Case",
  price: 200,
  rarity: "gold",
  image: "images/case74.png",
  items: [
    { name: "Protector Prime Sword", value: 250, rarity: "red" },
    { name: "Protector Prime Shield", value: 300, rarity: "ultimate" }
  ]
},
{
  name: "Samurai Prime Case",
  price: 400,
  rarity: "red",
  image: "images/case75.png",
  items: [
    { name: "Samurai Prime Katana", value: 450, rarity: "red" },
    { name: "Samurai Prime Armor", value: 550, rarity: "ultimate" }
  ]
},
{
  name: "Ocean Case",
  price: 560,
  rarity: "red",
  image: "images/case76.png",
  items: [
    { name: "Ocean Trident", value: 740, rarity: "ultimate" },
    { name: "Ocean Armor", value: 840, rarity: "ultimate" }
  ]
},
{
  name: "Nebula Prime Case",
  price: 810,
  rarity: "ultimate",
  image: "images/case77.png",
  items: [
    { name: "Nebula Prime Orb", value: 1010, rarity: "ultimate" },
    { name: "Nebula Prime Armor", value: 1210, rarity: "ultimate" }
  ]
},
{
  name: "Solar Prime Case",
  price: 1150,
  rarity: "ultimate",
  image: "images/case78.png",
  items: [
    { name: "Solar Prime Crown", value: 1550, rarity: "ultimate" },
    { name: "Solar Prime Blade", value: 1750, rarity: "ultimate" }
  ]
},
{
  name: "Oracle Elite Case",
  price: 2300,
  rarity: "ultimate",
  image: "images/case79.png",
  items: [
    { name: "Oracle Elite Sword", value: 2700, rarity: "ultimate" },
    { name: "Oracle Elite Shield", value: 3100, rarity: "ultimate" }
  ]
},
{
  name: "Sanctum Prime Case",
  price: 3800,
  rarity: "ultimate",
  image: "images/case80.png",
  items: [
    { name: "Sanctum Prime Crown", value: 4300, rarity: "ultimate" },
    { name: "Sanctum Prime Armor", value: 4900, rarity: "ultimate" }
  ]
}
{
  name: "Mars Case",
  price: 70,
  rarity: "blue",
  image: "images/case81.png",
  items: [
    { name: "Mars Dagger", value: 80, rarity: "darkblue" },
    { name: "Mars Mask", value: 90, rarity: "gold" }
  ]
},
{
  name: "Ruby Case",
  price: 105,
  rarity: "darkblue",
  image: "images/case82.png",
  items: [
    { name: "Ruby Sword", value: 125, rarity: "gold" },
    { name: "Ruby Armor", value: 145, rarity: "red" }
  ]
},
{
  name: "Magma Case",
  price: 140,
  rarity: "darkblue",
  image: "images/case83.png",
  items: [
    { name: "Magma Gun", value: 160, rarity: "gold" },
    { name: "Magma Orb", value: 180, rarity: "red" }
  ]
},
{
  name: "Protector Elite Case",
  price: 210,
  rarity: "gold",
  image: "images/case84.png",
  items: [
    { name: "Protector Elite Sword", value: 260, rarity: "red" },
    { name: "Protector Elite Shield", value: 310, rarity: "ultimate" }
  ]
},
{
  name: "Samurai Elite Case",
  price: 420,
  rarity: "red",
  image: "images/case85.png",
  items: [
    { name: "Samurai Elite Katana", value: 470, rarity: "red" },
    { name: "Samurai Elite Armor", value: 570, rarity: "ultimate" }
  ]
},
{
  name: "Aqua Case",
  price: 580,
  rarity: "red",
  image: "images/case86.png",
  items: [
    { name: "Aqua Trident", value: 760, rarity: "ultimate" },
    { name: "Aqua Armor", value: 860, rarity: "ultimate" }
  ]
},
{
  name: "Nebula Elite Case",
  price: 830,
  rarity: "ultimate",
  image: "images/case87.png",
  items: [
    { name: "Nebula Elite Orb", value: 1030, rarity: "ultimate" },
    { name: "Nebula Elite Armor", value: 1230, rarity: "ultimate" }
  ]
},
{
  name: "Solar Elite Case",
  price: 1200,
  rarity: "ultimate",
  image: "images/case88.png",
  items: [
    { name: "Solar Elite Crown", value: 1600, rarity: "ultimate" },
    { name: "Solar Elite Blade", value: 1800, rarity: "ultimate" }
  ]
},
{
  name: "Oracle Supreme Case",
  price: 2400,
  rarity: "ultimate",
  image: "images/case89.png",
  items: [
    { name: "Oracle Supreme Sword", value: 2800, rarity: "ultimate" },
    { name: "Oracle Supreme Shield", value: 3200, rarity: "ultimate" }
  ]
},
{
  name: "Sanctum Elite Case",
  price: 3900,
  rarity: "ultimate",
  image: "images/case90.png",
  items: [
    { name: "Sanctum Elite Crown", value: 4400, rarity: "ultimate" },
    { name: "Sanctum Elite Armor", value: 5000, rarity: "ultimate" }
  ]
    }
{
  name: "Jupiter Case",
  price: 75,
  rarity: "blue",
  image: "images/case91.png",
  items: [
    { name: "Jupiter Dagger", value: 85, rarity: "darkblue" },
    { name: "Jupiter Mask", value: 95, rarity: "gold" }
  ]
},
{
  name: "Emerald Case",
  price: 110,
  rarity: "darkblue",
  image: "images/case92.png",
  items: [
    { name: "Emerald Sword", value: 130, rarity: "gold" },
    { name: "Emerald Armor", value: 150, rarity: "red" }
  ]
},
{
  name: "Lava Case",
  price: 150,
  rarity: "darkblue",
  image: "images/case93.png",
  items: [
    { name: "Lava Gun", value: 170, rarity: "gold" },
    { name: "Lava Orb", value: 190, rarity: "red" }
  ]
},
{
  name: "Protector Supreme Case",
  price: 220,
  rarity: "gold",
  image: "images/case94.png",
  items: [
    { name: "Protector Supreme Sword", value: 270, rarity: "red" },
    { name: "Protector Supreme Shield", value: 320, rarity: "ultimate" }
  ]
},
{
  name: "Samurai Supreme Case",
  price: 440,
  rarity: "red",
  image: "images/case95.png",
  items: [
    { name: "Samurai Supreme Katana", value: 490, rarity: "red" },
    { name: "Samurai Supreme Armor", value: 590, rarity: "ultimate" }
  ]
},
{
  name: "Tsunami Case",
  price: 600,
  rarity: "red",
  image: "images/case96.png",
  items: [
    { name: "Tsunami Trident", value: 780, rarity: "ultimate" },
    { name: "Tsunami Armor", value: 880, rarity: "ultimate" }
  ]
},
{
  name: "Nebula Supreme Case",
  price: 850,
  rarity: "ultimate",
  image: "images/case97.png",
  items: [
    { name: "Nebula Supreme Orb", value: 1050, rarity: "ultimate" },
    { name: "Nebula Supreme Armor", value: 1250, rarity: "ultimate" }
  ]
},
{
  name: "Solar Supreme Case",
  price: 1250,
  rarity: "ultimate",
  image: "images/case98.png",
  items: [
    { name: "Solar Supreme Crown", value: 1650, rarity: "ultimate" },
    { name: "Solar Supreme Blade", value: 1850, rarity: "ultimate" }
  ]
},
{
  name: "Oracle Divine Case",
  price: 2500,
  rarity: "ultimate",
  image: "images/case99.png",
  items: [
    { name: "Oracle Divine Sword", value: 2900, rarity: "ultimate" },
    { name: "Oracle Divine Shield", value: 3300, rarity: "ultimate" }
  ]
},
{
  name: "Sanctum Supreme Case",
  price: 4000,
  rarity: "ultimate",
  image: "images/case100.png",
  items: [
    { name: "Sanctum Supreme Crown", value: 4500, rarity: "ultimate" },
    { name: "Sanctum Supreme Armor", value: 5100, rarity: "ultimate" }
  ]
}
// 🎲 CASE OCHISH
function openCase(caseIndex) {
  const selectedCase = cases[caseIndex];
  if (balance < selectedCase.price) return alert("Mablag' yetarli emas!");

  // Balansdan case narxini ayiramiz
  balance -= selectedCase.price;
  updateUI();

  // Random item tanlash
  const items = selectedCase.items;
  const randIndex = Math.floor(Math.random() * items.length);
  const reward = items[randIndex];

  // Balansga item qiymatini qo‘shamiz
  balance += reward.value;
  updateUI();

  // Natija ko‘rsatish
  const resultBox = document.getElementById('case-result');
  resultBox.innerHTML = `
    <h3>${selectedCase.name} ochildi!</h3>
    <p>🎁 Sizga tushdi: <b>${reward.name}</b></p>
    <p>Qiymati: ${reward.value}$ (${reward.rarity})</p>
    <p>Balans yangilandi: ${balance.toFixed(2)}$</p>
  `;
}
// 🎲 CASE OCHISH PROGRESS BAR
function openCaseWithProgress(caseIndex) {
  const selectedCase = cases[caseIndex];
  if (balance < selectedCase.price) return alert("Mablag' yetarli emas!");

  // Balansdan case narxini ayiramiz
  balance -= selectedCase.price;
  updateUI();

  // Progress bar yaratish
  const resultBox = document.getElementById('case-result');
  resultBox.innerHTML = `
    <h3>${selectedCase.name} ochilmoqda...</h3>
    <div class="progress-container">
      <div class="progress-bar"></div>
    </div>
  `;

  // 2 soniyadan keyin natija ko‘rsatish
  setTimeout(() => {
    const items = selectedCase.items;
    const randIndex = Math.floor(Math.random() * items.length);
    const reward = items[randIndex];

    balance += reward.value;
    updateUI();

    resultBox.innerHTML = `
      <h3>${selectedCase.name} ochildi!</h3>
      <p>🎁 Sizga tushdi: <b>${reward.name}</b></p>
      <p>Qiymati: ${reward.value}$ (${reward.rarity})</p>
      <p>Balans yangilandi: ${balance.toFixed(2)}$</p>
    `;
  }, 2000);
}
// ⚡ CRASH O'YINI
let crashInterval;
let crashMultiplier = 1.00;

function startCrashGame() {
  crashMultiplier = 1.00;
  clearInterval(crashInterval);

  const crashBar = document.querySelector(".crash-bar");
  const crashResult = document.getElementById("crash-result");

  crashBar.style.width = "0%";
  crashResult.innerHTML = "O'yin boshlandi...";

  crashInterval = setInterval(() => {
    crashMultiplier += 0.05; // har 100ms da +0.05
    crashBar.style.width = Math.min(crashMultiplier * 10, 100) + "%";
    crashResult.innerHTML = `📈 Multiplier: x${crashMultiplier.toFixed(2)}`;

    // Random crash nuqtasi
    if (Math.random() < 0.02) { 
      clearInterval(crashInterval);
      crashResult.innerHTML = `💥 Crash bo'ldi! Oxirgi multiplier: x${crashMultiplier.toFixed(2)}`;
    }
  }, 100);
                              }
