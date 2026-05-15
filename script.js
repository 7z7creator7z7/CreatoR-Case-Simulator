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
