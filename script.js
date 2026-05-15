// Balans va inventar
let balance = 100;
let inventory = [];

// Til sozlamalari (oddiy misol)
const i18n = {
    uz: {
        btn_open: "Ochil",
        msg_money: "Pul yetarli emas!",
        msg_win: "Siz yutdingiz: "
    }
};
let currentLang = "uz";

// Case ma'lumotlari
const caseData = [
    { name: "Standard", price: 10, img: "assets/case/1.png", skins: Array.from({length: 16}, (_,i)=>`assets/weapon/case1/${i+5}.png`) },
    { name: "Elite", price: 100, img: "assets/case/2.png", skins: Array.from({length: 15}, (_,i)=>`assets/weapon/case2/${i+21}.png`) },
    { name: "Lucky", price: 1000, img: "assets/case/3.png", skins: Array.from({length: 15}, (_,i)=>`assets/weapon/case3/${i+36}.png`) },
    { name: "Legendary", price: 5000, img: "assets/case/4.png", skins: Array.from({length: 15}, (_,i)=>`assets/weapon/case4/${i+51}.png`) }
];

// Case’larni ko‘rsatish
function renderCases() {
    const container = document.getElementById('case-list');
    container.innerHTML = '';
    caseData.forEach((c, idx) => {
        const div = document.createElement('div');
        div.className = 'case-card';
        div.innerHTML = `
            <img src="${c.img}" alt="${c.name}">
            <h3>${c.name}</h3>
            <p>${c.price} $</p>
            <button onclick="openCase(${idx})">${i18n[currentLang].btn_open}</button>
        `;
        container.appendChild(div);
    });
}

// Case ochish
function openCase(idx) {
    const c = caseData[idx];
    if (balance < c.price) return alert(i18n[currentLang].msg_money);

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
        const itemImg = c.skins[Math.floor(Math.random() * c.skins.length)];
        const card = document.createElement('div');
        card.className = `skin-card`;
        card.innerHTML = `<img src="${itemImg}"><span>${itemImg.split('/').pop()}</span>`;
        carousel.appendChild(card);
        if (i === winIndex) winner = itemImg;
    }

    setTimeout(() => {
        carousel.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)';
        carousel.style.transform = `translateX(-${(winIndex * 112) - 104}px)`;
    }, 100);

    setTimeout(() => {
        inventory.push({img: winner, price: c.price});
        updateGlobalData();
        document.getElementById('close-modal').classList.remove('hidden');
        alert(i18n[currentLang].msg_win + winner);
    }, 5600);
}

// Balans va inventarni yangilash
function updateGlobalData() {
    document.getElementById('balance').innerText = balance + " $";
    const inv = document.getElementById('inventory');
    inv.innerHTML = '';
    inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inv-item';
        div.innerHTML = `<img src="${item.img}" alt=""><span>${item.price}$</span>`;
        inv.appendChild(div);
    });
}

// Boshlang‘ich render
window.onload = () => {
    renderCases();
    updateGlobalData();
};
