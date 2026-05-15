const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   LANGUAGE SYSTEM
========================= */

const i18n = {
    uz: {
        nav_cases: "Keyslar",
        nav_inv: "Inventar",
        nav_profile: "Profil",

        title_cases: "Keys Tanlang",
        title_inv: "Mening Inventarim",
        title_profile: "Sozlamalar",

        label_lang: "Tilni tanlang:",
        label_stats: "Sizning statistikalaringiz yaqin orada chiqadi.",

        btn_open: "Ochish",
        btn_sell: "Sotish",
        btn_close: "Yopish",

        msg_money: "Mablag' yetarli emas!",
        msg_win: "Siz yutdingiz:",

        opening: "Case ochilmoqda..."
    },

    en: {
        nav_cases: "Cases",
        nav_inv: "Inventory",
        nav_profile: "Profile",

        title_cases: "Select Case",
        title_inv: "My Inventory",
        title_profile: "Settings",

        label_lang: "Select Language:",
        label_stats: "Statistics coming soon.",

        btn_open: "Open",
        btn_sell: "Sell",
        btn_close: "Close",

        msg_money: "Not enough balance!",
        msg_win: "You won:",

        opening: "Opening case..."
    }
};

let currentLang =
localStorage.getItem('lang') || 'uz';

let balance =
parseFloat(localStorage.getItem('balance')) || 1000;

let inventory =
JSON.parse(localStorage.getItem('inventory')) || [];

/* =========================
   ITEM SYSTEM
========================= */

const rarityConfig = {

    common:{
        class:"rarity-blue",
        min:1,
        max:50,
        amount:100,
        emoji:"🔵"
    },

    rare:{
        class:"rarity-green",
        min:51,
        max:250,
        amount:80,
        emoji:"🟢"
    },

    epic:{
        class:"rarity-purple",
        min:251,
        max:500,
        amount:60,
        emoji:"🟣"
    },

    legendary:{
        class:"rarity-gold",
        min:501,
        max:1500,
        amount:35,
        emoji:"🟡"
    },

    mythic:{
        class:"rarity-red",
        min:1501,
        max:5000,
        amount:25,
        emoji:"🔴"
    }

};

const itemImages = [
"https://i.imgur.com/Y7XK7bS.png",
"https://i.imgur.com/3U6qV9F.png",
"https://i.imgur.com/W9XyK8D.png",
"https://i.imgur.com/9z1Z7pM.png"
];

const allSkins = [];

function randomPrice(min,max){

    return Math.floor(
        Math.random() * (max-min+1)
    ) + min;

}

function randomImage(){

    return itemImages[
        Math.floor(Math.random()*itemImages.length)
    ];

}

/* CREATE 300 ITEMS */

Object.entries(rarityConfig).forEach(([rarity,data])=>{

    for(let i=1;i<=data.amount;i++){

        allSkins.push({

            name:
            `${data.emoji} ${rarity.toUpperCase()} Item #${i}`,

            rarity:rarity,

            rarityClass:data.class,

            price:randomPrice(data.min,data.max),

            img:randomImage()

        });

    }

});

/* =========================
   FILTER ITEMS
========================= */

function getItemsByRarity(rarity,count){

    return allSkins
    .filter(x=>x.rarity===rarity)
    .sort(()=>0.5-Math.random())
    .slice(0,count);

}

/* =========================
   CASES
========================= */

const caseData = [

{
    name:"Standard",
    price:10,

    items:[
        ...getItemsByRarity("common",15),
        ...getItemsByRarity("rare",5),
        ...getItemsByRarity("epic",3),
        ...getItemsByRarity("legendary",2)
    ],

    chances:{
        common:60,
        rare:30,
        epic:7,
        legendary:3
    }
},

{
    name:"Elite",
    price:100,

    items:[
        ...getItemsByRarity("common",10),
        ...getItemsByRarity("rare",10),
        ...getItemsByRarity("epic",3),
        ...getItemsByRarity("legendary",2)
    ],

    chances:{
        common:30,
        rare:50,
        epic:17,
        legendary:3
    }
},

{
    name:"Lucky",
    price:500,

    items:[
        ...getItemsByRarity("rare",15),
        ...getItemsByRarity("epic",8),
        ...getItemsByRarity("legendary",5),
        ...getItemsByRarity("mythic",2)
    ],

    chances:{
        rare:55,
        epic:30,
        legendary:9,
        mythic:6
    }
},

{
    name:"Legendary",
    price:1250,

    items:[
        ...getItemsByRarity("epic",7),
        ...getItemsByRarity("legendary",13),
        ...getItemsByRarity("mythic",5)
    ],

    chances:{
        epic:45,
        legendary:40,
        mythic:15
    }
}

];

/* =========================
   CASE RENDER
========================= */

function renderCases(){

    const container =
    document.getElementById('case-list');

    container.innerHTML = '';

    caseData.forEach((c,idx)=>{

        const div =
        document.createElement('div');

        div.className =
        'case-card premium-card';

        div.innerHTML = `

        <div class="case-top">

            <img
            class="case-image"
            src="https://i.imgur.com/JD7X9pH.png">

        </div>

        <div class="case-info">

            <h3>${c.name}</h3>

            <p class="case-price">
                ${c.price} $
            </p>

            <button
            class="open-btn"
            onclick="openCase(${idx})">

                🔓 ${i18n[currentLang].btn_open}

            </button>

        </div>

        `;

        container.appendChild(div);

    });

}

/* =========================
   CHANCE SYSTEM
========================= */

function getRandomByChance(chances){

    let rand = Math.random()*100;

    let sum = 0;

    for(let rarity in chances){

        sum += chances[rarity];

        if(rand <= sum){

            return rarity;

        }

    }

}

/* =========================
   OPEN CASE
========================= */

function openCase(idx){

    const c = caseData[idx];

    if(balance < c.price){

        return alert(
            i18n[currentLang].msg_money
        );

    }

    balance -= c.price;

    updateGlobalData();

    const rarity =
    getRandomByChance(c.chances);

    const possibleItems =
    c.items.filter(x=>x.rarity===rarity);

    const winner =
    possibleItems[
        Math.floor(
            Math.random()*possibleItems.length
        )
    ];

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

    for(let i=0;i<45;i++){

        const item =
        c.items[
            Math.floor(Math.random()*c.items.length)
        ];

        const card =
        document.createElement('div');

        card.className =
        `skin-card ${item.rarityClass}`;

        card.innerHTML = `

        <img src="${item.img}">

        <span>${item.name}</span>

        <b>${item.price}$</b>

        `;

        carousel.appendChild(card);

    }

    const cards = carousel.children;

    cards[winIndex].className =
    `skin-card ${winner.rarityClass}`;

    cards[winIndex].innerHTML = `

    <img src="${winner.img}">

    <span>${winner.name}</span>

    <b>${winner.price}$</b>

    `;

    setTimeout(()=>{

        carousel.style.transition =
        'transform 5s cubic-bezier(0.1,0,0.1,1)';

        carousel.style.transform =
        `translateX(-${(winIndex*112)-104}px)`;

    },100);

    setTimeout(()=>{

        inventory.push(winner);

        updateGlobalData();

        document
        .getElementById('close-modal')
        .classList.remove('hidden');

        alert(
            `${i18n[currentLang].msg_win}
            ${winner.name}
            (${winner.price}$)`
        );

    },5600);

}

/* =========================
   INVENTORY
========================= */

function renderInventory(){

    const container =
    document.getElementById('inventory-list');

    container.innerHTML = '';

    inventory.forEach((item,i)=>{

        const div =
        document.createElement('div');

        div.className =
        `inv-item ${item.rarityClass}`;

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

function sellItem(i){

    balance += inventory[i].price;

    inventory.splice(i,1);

    updateGlobalData();

}

/* =========================
   LANGUAGE
========================= */

function changeLanguage(lang){

    currentLang = lang;

    localStorage.setItem('lang',lang);

    updateLanguageUI();

    renderInventory();

}

function updateLanguageUI(){

    const l = i18n[currentLang];

    document.getElementById('nav-cases').innerText =
    l.nav_cases;

    document.getElementById('nav-inv').innerText =
    l.nav_inv;

    document.getElementById('nav-profile').innerText =
    l.nav_profile;

    document.getElementById('title-cases').innerText =
    l.title_cases;

    document.getElementById('title-inv').innerText =
    l.title_inv;

    document.getElementById('title-profile').innerText =
    l.title_profile;

    document.getElementById('label-lang').innerText =
    l.label_lang;

    document.getElementById('label-stats').innerText =
    l.label_stats;

    document.getElementById('opening-text').innerText =
    l.opening;

    document.getElementById('close-modal').innerText =
    l.btn_close;

    renderCases();

}

/* =========================
   SAVE SYSTEM
========================= */

function updateGlobalData(){

    document.getElementById('balance')
    .innerText = balance.toFixed(2);

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

/* =========================
   PAGE SYSTEM
========================= */

function showSection(name){

    document
    .getElementById('cases-section')
    .classList.toggle(
        'hidden',
        name !== 'cases'
    );

    document
    .getElementById('inventory-section')
    .classList.toggle(
        'hidden',
        name !== 'inventory'
    );

    document
    .getElementById('profile-section')
    .classList.toggle(
        'hidden',
        name !== 'profile'
    );

}

function closeModal(){

    document
    .getElementById('game-modal')
    .classList.add('hidden');

    document
    .getElementById('close-modal')
    .classList.add('hidden');

}

/* =========================
   START
========================= */

document.getElementById('user-name').innerText =
tg.initDataUnsafe.user?.first_name || "User";

if(tg.initDataUnsafe.user?.photo_url){

    document.getElementById('user-photo').src =
    tg.initDataUnsafe.user.photo_url;

}

updateLanguageUI();

updateGlobalData();
