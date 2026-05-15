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
