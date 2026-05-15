const tg = window.Telegram.WebApp;
tg.expand();

// Boshlang'ich balans 100$
let balance = 100.00;

const cases = [
    { name: "Lite", price: 5, img: "https://bulldrop.uz/static/media/case-preview.png", items: [{n:"Glock", p:1}, {n:"USP", p:4}, {n:"P250", p:8}] },
    { name: "Standard", price: 10, img: "https://bulldrop.uz/static/media/case-preview.png", items: [{n:"M4A4", p:5}, {n:"AK-47", p:15}] },
    { name: "Elite", price: 50, img: "https://bulldrop.uz/static/media/case-preview.png", items: [{n:"AWP", p:45}, {n:"Knife", p:120}] },
    { name: "Godlike", price: 100, img: "https://bulldrop.uz/static/media/case-preview.png", items: [{n:"Gloves", p:250}, {n:"Lore", p:2000}] }
];

window.onload = () => {
    updateUI();
    renderCases();
};

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('user-name').innerText = `『${tg.initDataUnsafe.user?.first_name || "CreatoR"}』`;
    if(tg.initDataUnsafe.user?.photo_url) document.getElementById('user-photo').src = tg.initDataUnsafe.user.photo_url;
}

function renderCases() {
    const list = document.getElementById('case-list');
    list.innerHTML = cases.map((c, i) => `
        <div class="case-card" onclick="openPreview(${i})">
            <img src="${c.img}" width="85%">
            <h3>${c.name}</h3>
            <div class="price-tag">${c.price} $</div>
        </div>
    `).join('');
}

function openPreview(i) {
    const c = cases[i];
    document.getElementById('modal-title').innerText = c.name + " Keysi";
    document.getElementById('modal-img').src = c.img;
    document.getElementById('modal-price').innerText = c.price + " $";
    
    const grid = document.getElementById('modal-items');
    grid.innerHTML = c.items.map(it => `
        <div class="item-box">
            <img src="https://img.icons8.com/color/96/pistol.png">
            <p>${it.n}</p>
            <span>${it.p} $</span>
        </div>
    `).join('');

    document.getElementById('modal-buy-btn').onclick = () => {
        if(balance < c.price) return alert("Mablag' yetarli emas!");
        balance -= c.price;
        updateUI();
        closeModal();
        alert("Keys ochildi!");
    };
    document.getElementById('case-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('case-modal').classList.add('hidden'); }

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id + '-section').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + id).classList.add('active');
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value.trim()) return;
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="msg"><span>${tg.initDataUnsafe.user?.first_name || "Foydalanuvchi"}</span>${input.value}</div>`;
    input.value = "";
    box.scrollTop = box.scrollHeight;
}
