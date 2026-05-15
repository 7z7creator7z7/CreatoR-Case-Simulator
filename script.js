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
