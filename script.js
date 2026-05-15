const tg = window.Telegram.WebApp;
tg.expand();

/* =========================
   USER DATA
========================= */
let balance = parseFloat(localStorage.getItem("balance")) || 1000;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

/* =========================
   RARITY COLORS
========================= */
const rarityStyles = {
  common: {
    class: "rarity-common",
    color: "#4da6ff"
  },
  rare: {
    class: "rarity-rare",
    color: "#32d74b"
  },
  epic: {
    class: "rarity-epic",
    color: "#bb6cff"
  },
  legendary: {
    class: "rarity-legendary",
    color: "#ffd43b"
  },
  mythic: {
    class: "rarity-mythic",
    color: "#ff4d4d"
  }
};

/* =========================
   ITEM GENERATOR
========================= */

const csNames = {
  common: [
    "Glock-18 | Candy",
    "USP-S | Night",
    "P250 | Sand Dune",
    "MP9 | Blue",
    "Nova | Rust",
    "MAC-10 | Fade",
    "UMP-45 | Riot",
    "FAMAS | Cyan",
    "PP-Bizon | Water",
    "Five-SeveN | Forest"
  ],

  rare: [
    "AK-47 | Slate",
    "M4A1-S | Nitro",
    "AWP | Fever",
    "Desert Eagle | Blaze",
    "Galil AR | Signal",
    "MP7 | Blood",
    "CZ75 | Emerald",
    "Tec-9 | Ice",
    "P90 | Elite",
    "SSG 08 | Ghost"
  ],

  epic: [
    "AK-47 | Neon Rider",
    "M4A4 | Emperor",
    "AWP | Hyper Beast",
    "USP-S | Kill Confirmed",
    "Desert Eagle | Code Red",
    "Karambit | Blue Steel",
    "Butterfly | Crimson",
    "Flip Knife | Lore"
  ],

  legendary: [
    "AK-47 | Fire Serpent",
    "M4A4 | Howl",
    "AWP | Dragon Lore",
    "Karambit | Fade",
    "Butterfly | Doppler",
    "Skeleton Knife | Slaughter"
  ],

  mythic: [
    "AWP | Gungnir",
    "Karambit | Ruby",
    "Butterfly | Sapphire",
    "M9 Bayonet | Gamma Doppler",
    "AK-47 | Wild Lotus"
  ]
};

function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createItems(type, count, min, max) {
  let arr = [];

  for (let i = 0; i < count; i++) {

    const nameList = csNames[type];
    const randomName =
      nameList[Math.floor(Math.random() * nameList.length)];

    arr.push({
      name: randomName,
      rarity: type,
      price: randomPrice(min, max),

      img: `
      <div class="gun-icon ${type}">
        🔫
      </div>
      `
    });
  }

  return arr;
}

/* =========================
   ALL ITEMS
========================= */

const commonItems = createItems("common", 100, 1, 50);
const rareItems = createItems("rare", 80, 51, 250);
const epicItems = createItems("epic", 60, 251, 500);
const legendaryItems = createItems("legendary", 35, 501, 1500);
const mythicItems = createItems("mythic", 25, 1501, 5000);

/* =========================
   CASES
========================= */

const caseData = [
  {
    name: "Standard",
    price: 10,
    image: "📦",
    items: [
      ...commonItems.slice(0,15),
      ...rareItems.slice(0,5),
      ...epicItems.slice(0,3),
      ...legendaryItems.slice(0,2)
    ],

    chances: {
      common: 60,
      rare: 30,
      epic: 7,
      legendary: 3
    }
  },

  {
    name: "Elite",
    price: 100,
    image: "💎",
    items: [
      ...commonItems.slice(15,25),
      ...rareItems.slice(5,15),
      ...epicItems.slice(3,6),
      ...legendaryItems.slice(2,4)
    ],

    chances: {
      common: 30,
      rare: 60,
      epic: 7,
      legendary: 3
    }
  },

  {
    name: "Lucky",
    price: 500,
    image: "🍀",
    items: [
      ...rareItems.slice(15,30),
      ...epicItems.slice(6,14),
      ...legendaryItems.slice(4,9),
      ...mythicItems.slice(0,2)
    ],

    chances: {
      rare: 55,
      epic: 30,
      legendary: 9,
      mythic: 6
    }
  },

  {
    name: "Legendary",
    price: 1250,
    image: "🔥",
    items: [
      ...epicItems.slice(14,21),
      ...legendaryItems.slice(9,22),
      ...mythicItems.slice(2,7)
    ],

    chances: {
      epic: 45,
      legendary: 40,
      mythic: 15
    }
  }
];

/* =========================
   RENDER CASES
========================= */

function renderCases() {

  const container = document.getElementById("case-list");
  container.innerHTML = "";

  caseData.forEach((c, index) => {

    const div = document.createElement("div");
    div.className = "case-card";

    div.innerHTML = `
    
      <div class="case-image">
        ${c.image}
      </div>

      <div class="case-bottom">

        <h2>${c.name}</h2>

        <p class="case-price">${c.price}$</p>

        <button onclick="openCase(${index})">
          🔓 Ochish
        </button>

      </div>
    `;

    container.appendChild(div);
  });
}

/* =========================
   RANDOM WINNER
========================= */

function getRandomRarity(chances) {

  const rand = Math.random() * 100;

  let total = 0;

  for (let rarity in chances) {

    total += chances[rarity];

    if (rand <= total) {
      return rarity;
    }
  }

  return "common";
}

function getWinner(caseObj) {

  const rarity = getRandomRarity(caseObj.chances);

  const filtered =
    caseObj.items.filter(i => i.rarity === rarity);

  return filtered[
    Math.floor(Math.random() * filtered.length)
  ];
}

/* =========================
   OPEN CASE
========================= */

function openCase(index) {

  const c = caseData[index];

  if (balance < c.price) {
    alert("Pul yetarli emas");
    return;
  }

  balance -= c.price;
  updateData();

  const modal = document.getElementById("game-modal");
  const carousel = document.getElementById("carousel");

  modal.classList.remove("hidden");

  carousel.innerHTML = "";

  const winner = getWinner(c);

  const fakeItems = [];

  for (let i = 0; i < 40; i++) {

    const random =
      c.items[Math.floor(Math.random() * c.items.length)];

    fakeItems.push(random);
  }

  fakeItems[32] = winner;

  fakeItems.forEach(item => {

    const div = document.createElement("div");

    div.className =
      `skin-card ${rarityStyles[item.rarity].class}`;

    div.innerHTML = `
    
      ${item.img}

      <span>${item.name}</span>

      <b>${item.price}$</b>
    `;

    carousel.appendChild(div);
  });

  carousel.style.transition = "none";
  carousel.style.transform = `translateX(0px)`;

  setTimeout(() => {

    carousel.style.transition =
      "transform 5s cubic-bezier(0.08,0.6,0,1)";

    carousel.style.transform =
      `translateX(-3500px)`;

  }, 100);

  setTimeout(() => {

    inventory.push(winner);

    updateData();

    alert(`Siz yutdingiz:\n${winner.name}`);

  }, 5500);
}

/* =========================
   INVENTORY
========================= */

function renderInventory() {

  const container =
    document.getElementById("inventory-list");

  container.innerHTML = "";

  inventory.forEach((item, i) => {

    const div = document.createElement("div");

    div.className =
      `inv-item ${rarityStyles[item.rarity].class}`;

    div.innerHTML = `
    
      ${item.img}

      <p>${item.name}</p>

      <b>${item.price}$</b>

      <button onclick="sellItem(${i})">
        Sotish
      </button>
    `;

    container.appendChild(div);
  });
}

function sellItem(i) {

  balance += inventory[i].price;

  inventory.splice(i, 1);

  updateData();
}

/* =========================
   UPDATE
========================= */

function updateData() {

  document.getElementById("balance")
    .innerText = balance.toFixed(2);

  localStorage.setItem("balance", balance);

  localStorage.setItem(
    "inventory",
    JSON.stringify(inventory)
  );

  renderInventory();
}

/* =========================
   SECTIONS
========================= */

function showSection(name) {

  document.getElementById("cases-section")
    .classList.toggle("hidden", name !== "cases");

  document.getElementById("inventory-section")
    .classList.toggle("hidden", name !== "inventory");

  document.getElementById("profile-section")
    .classList.toggle("hidden", name !== "profile");
}

function closeModal() {
  document.getElementById("game-modal")
    .classList.add("hidden");
}

/* =========================
   USER INFO
========================= */

document.getElementById("user-name")
.innerText =
tg.initDataUnsafe.user?.first_name || "Player";

if (tg.initDataUnsafe.user?.photo_url) {

  document.getElementById("user-photo").src =
  tg.initDataUnsafe.user.photo_url;
}

/* =========================
   START
========================= */

renderCases();
updateData();
