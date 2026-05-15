// SCRIPT.JS 1-QISM

let balance = 350550;

let openedCases = 0;

let inventory = [];

/* =========================
   ITEMLAR
========================= */

const items = {

common:[

{
name:"Glock-18 | Candy Apple",
price:12,
rarity:"common"
},

{
name:"USP-S | Night Ops",
price:25,
rarity:"common"
},

{
name:"P250 | Sand Dune",
price:40,
rarity:"common"
},

{
name:"MP9 | Storm",
price:35,
rarity:"common"
},

{
name:"Nova | Predator",
price:18,
rarity:"common"
}

],

rare:[

{
name:"AK-47 | Slate",
price:120,
rarity:"rare"
},

{
name:"M4A4 | Griffin",
price:180,
rarity:"rare"
},

{
name:"AWP | Fever Dream",
price:240,
rarity:"rare"
},

{
name:"Desert Eagle | Conspiracy",
price:210,
rarity:"rare"
},

{
name:"USP-S | Cortex",
price:160,
rarity:"rare"
}

],

epic:[

{
name:"AK-47 | Neon Rider",
price:320,
rarity:"epic"
},

{
name:"AWP | Neo-Noir",
price:410,
rarity:"epic"
},

{
name:"M4A1-S | Hyper Beast",
price:500,
rarity:"epic"
},

{
name:"Butterfly Knife | Urban",
price:480,
rarity:"epic"
}

],

legendary:[

{
name:"Karambit | Doppler",
price:1200,
rarity:"legendary"
},

{
name:"Butterfly Knife | Fade",
price:1450,
rarity:"legendary"
},

{
name:"M9 Bayonet | Tiger Tooth",
price:980,
rarity:"legendary"
}

],

mythic:[

{
name:"AWP | Dragon Lore",
price:4200,
rarity:"mythic"
},

{
name:"AK-47 | Wild Lotus",
price:3600,
rarity:"mythic"
},

{
name:"Karambit | Ruby",
price:5000,
rarity:"mythic"
}

]

};

/* =========================
   CASE CONFIG
========================= */

const cases = {

standard:{
price:10,
drops:{
common:60,
rare:30,
epic:7,
legendary:3
}
},

elite:{
price:100,
drops:{
common:30,
rare:50,
epic:17,
legendary:3
}
},

lucky:{
price:500,
drops:{
rare:55,
epic:30,
legendary:9,
mythic:6
}
},

legendary:{
price:1250,
drops:{
epic:45,
legendary:40,
mythic:15
}
}

};

/* =========================
   PAGE SYSTEM
========================= */

function showPage(page){

document.getElementById(
"casesPage"
).style.display =
page === "cases"
? "block"
: "none";

document.getElementById(
"inventoryPage"
).style.display =
page === "inventory"
? "block"
: "none";

document.getElementById(
"profilePage"
).style.display =
page === "profile"
? "block"
: "none";

}

/* =========================
   RANDOM ITEM
========================= */

function randomItem(caseName){

const config =
cases[caseName];

const rand =
Math.random() * 100;

let rarity;

let total = 0;

for(let r in config.drops){

total += config.drops[r];

if(rand <= total){

rarity = r;

break;

}

}

const rarityItems =
items[rarity];

return rarityItems[
Math.floor(
Math.random()
* rarityItems.length
)
];

}// SCRIPT.JS 2-QISM

/* =========================
   CASE OPEN
========================= */

function openCase(caseName){

const config = cases[caseName];

if(balance < config.price){

alert("❌ Pul yetarli emas");

return;

}

balance -= config.price;

updateBalance();

openedCases++;

document.getElementById(
"openedCases"
).innerText = openedCases;

const modal =
document.getElementById(
"openModal"
);

modal.style.display = "flex";

const roulette =
document.getElementById(
"roulette"
);

roulette.innerHTML = "";

const winner =
randomItem(caseName);

let fakeItems = [];

for(let i=0;i<45;i++){

let rarities =
Object.keys(config.drops);

let randomRarity =
rarities[
Math.floor(
Math.random()
* rarities.length
)
];

let randomItemData =
items[randomRarity][
Math.floor(
Math.random()
* items[randomRarity].length
)
];

fakeItems.push(randomItemData);

}

fakeItems[35] = winner;

fakeItems.forEach(item=>{

const div =
document.createElement("div");

div.className =
`roulette-item ${item.rarity}`;

div.innerHTML = `

<div class="gun">
🔫
</div>

<h4>
${item.name}
</h4>

<p>
${item.price}$
</p>

`;

roulette.appendChild(div);

});

roulette.style.transition =
"none";

roulette.style.transform =
"translateX(0px)";

setTimeout(()=>{

roulette.style.transition =
"transform 5s cubic-bezier(.08,.6,0,1)";

roulette.style.transform =
"translateX(-6100px)";

},100);

setTimeout(()=>{

document.getElementById(
"wonItem"
).innerHTML = `

🎉 Siz yutdingiz:

<br><br>

${winner.name}

<br>

💰 ${winner.price}$

`;

inventory.push(winner);

renderInventory();

},5500);

}

/* =========================
   INVENTORY
========================= */

function renderInventory(){

const inventoryBox =
document.getElementById(
"inventoryItems"
);

inventoryBox.innerHTML = "";

inventory.forEach(item=>{

const div =
document.createElement("div");

div.className =
`inventory-item ${item.rarity}`;

div.innerHTML = `

<div style="
font-size:55px;
">
🔫
</div>

<h3>
${item.name}
</h3>

<p>
💰 ${item.price}$
</p>

`;

inventoryBox.appendChild(div);

});

}

/* =========================
   CLOSE MODAL
========================= */

function closeModal(){

document.getElementById(
"openModal"
).style.display = "none";

}

/* =========================
   BALANCE
========================= */

function updateBalance(){

document.getElementById(
"balance"
).innerText = balance;

document.getElementById(
"profileBalance"
).innerText = balance;

}

/* =========================
   START
========================= */

updateBalance();

renderInventory();
