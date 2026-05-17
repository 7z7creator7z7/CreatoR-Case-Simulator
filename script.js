/* =========================
CREATOR CASE - FULL JS
script.js
========================= */

let money = 350000;

const moneyText =
document.getElementById("money");

const modal =
document.getElementById("modal");

const track =
document.getElementById("track");

const winnerText =
document.getElementById("winner");

const inventoryDiv =
document.getElementById("inventory");

const casePage =
document.getElementById("casePage");

const inventoryPage =
document.getElementById("inventoryPage");

/* AUDIO */

const clickSound =
new Audio(
"https://actions.google.com/sounds/v1/cartoon/pop.ogg"
);

const openSound =
new Audio(
"https://actions.google.com/sounds/v1/cartoon/woodpecker_pecking.ogg"
);

const winSound =
new Audio(
"https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg"
);

/* INVENTORY */

let inventory = [];

/* ITEMS */

const items = [

{
name:"AK-47 | Neon Rider",
icon:"🔫",
price:120,
rarity:"common",
bg:"common"
},

{
name:"M4A4 | Neo-Noir",
icon:"🔫",
price:180,
rarity:"common",
bg:"common"
},

{
name:"USP-S | Kill Confirmed",
icon:"🔫",
price:350,
rarity:"rare",
bg:"rare"
},

{
name:"AWP | Asiimov",
icon:"🎯",
price:420,
rarity:"rare",
bg:"rare"
},

{
name:"Karambit | Doppler",
icon:"🔪",
price:980,
rarity:"epic",
bg:"epic"
},

{
name:"Butterfly Knife | Fade",
icon:"🗡️",
price:1400,
rarity:"epic",
bg:"epic"
},

{
name:"M9 Bayonet | Tiger Tooth",
icon:"⚔️",
price:2400,
rarity:"legend"
},

{
name:"AWP | Dragon Lore",
icon:"🐉",
price:4200,
rarity:"legend"
}

];

/* MONEY */

function updateMoney(){

moneyText.innerHTML =
"💰 " + money.toFixed(2) + "$";

}

/* CASE OPEN */

function openCase(price){

clickSound.play();

if(money < price){

alert("Pul yetmaydi!");

return;

}

money -= price;

updateMoney();

modal.style.display = "flex";

track.innerHTML = "";

let randomItems = [];

for(let i=0;i<40;i++){

const item =
items[Math.floor(
Math.random()*items.length
)];

randomItems.push(item);

track.innerHTML += `
<div class="roll ${item.bg}">

<div class="rollIcon">
${item.icon}
</div>

<div class="rollName">
${item.name}
</div>

<div class="rollPrice">
${item.price}$
</div>

</div>
`;

}

/* RANDOM WINNER */

const winner =
randomItems[
Math.floor(
Math.random()*randomItems.length
)
];

setTimeout(()=>{

openSound.play();

track.style.transform =
"translateX(-2500px)";

},100);

/* STOP */

setTimeout(()=>{

winSound.play();

winnerText.innerHTML = `
🎉 Siz yutdingiz:<br><br>

${winner.icon}<br>

${winner.name}<br>

💰 ${winner.price}$
`;

/* INVENTORYGA QOSHISH */

inventory.push(winner);

drawInventory();

/* SELL BUTTON */

const sellBtn =
document.getElementById("sellBtn");

sellBtn.onclick = function(){

money += winner.price;

updateMoney();

/* OCHIRISH */

let index =
inventory.indexOf(winner);

if(index > -1){

inventory.splice(index,1);

}

drawInventory();

closeModal();

}

},5000);

}

/* CLOSE */

function closeModal(){

clickSound.play();

modal.style.display = "none";

track.style.transform =
"translateX(0px)";

}

/* INVENTORY */

function drawInventory(){

inventoryDiv.innerHTML = "";

if(inventory.length <= 0){

inventoryDiv.innerHTML = `
<div class="empty">
Inventar bo'sh
</div>
`;

return;

}

inventory.forEach((item,index)=>{

inventoryDiv.innerHTML += `

<div class="inv ${item.bg}">

<div class="invIcon">
${item.icon}
</div>

<div class="invName">
${item.name}
</div>

<div class="invPrice">
💰 ${item.price}$
</div>

<button class="sellItem"
onclick="sellItem(${index})">

Sotish

</button>

</div>

`;

});

}

/* SELL ITEM */

function sellItem(index){

clickSound.play();

money += inventory[index].price;

updateMoney();

inventory.splice(index,1);

drawInventory();

}

/* PAGES */

function openInventory(){

clickSound.play();

casePage.style.display = "none";

inventoryPage.style.display = "block";

}

function openCases(){

clickSound.play();

casePage.style.display = "block";

inventoryPage.style.display = "none";

}

function openProfile(){

clickSound.play();

alert(
"👤 Nick: 『CreatoR』\n\n💰 Balans: " + money + "$"
);

}

/* START */

updateMoney();

drawInventory();
/* =========================
   AUTO SAVE SYSTEM
========================= */

let balance = localStorage.getItem("balance")
  ? parseInt(localStorage.getItem("balance"))
  : 100;

let inventory = localStorage.getItem("inventory")
  ? JSON.parse(localStorage.getItem("inventory"))
  : [];

let usedPromo = localStorage.getItem("usedPromo") || "false";
let lastDaily = localStorage.getItem("lastDaily") || 0;

function saveGame(){
  localStorage.setItem("balance", balance);
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("usedPromo", usedPromo);
  localStorage.setItem("lastDaily", lastDaily);
}

function updateBalance(){
  document.getElementById("balance").innerText = balance + "$";
  saveGame();
}

/* =========================
   INVENTAR RENDER
========================= */

function renderInventory(){
  const box = document.getElementById("inventoryItems");

  if(!box) return;

  box.innerHTML = "";

  inventory.forEach((item,index)=>{

    box.innerHTML += `
      <div class="inv-item ${item.rarity}">
          <div class="inv-icon">${item.icon}</div>
          <div class="inv-name">${item.name}</div>
          <div class="inv-price">${item.price}$</div>

          <button onclick="sellItem(${index})">
            Sotish
          </button>
      </div>
    `;

  });

  saveGame();
}

function sellItem(index){

  balance += inventory[index].price;

  inventory.splice(index,1);

  updateBalance();
  renderInventory();
}

/* =========================
   CASE OPEN
========================= */

function openCase(casePrice,items){

  if(balance < casePrice){
    alert("Pul yetmaydi!");
    return;
  }

  balance -= casePrice;
  updateBalance();

  document.getElementById("openModal").style.display = "flex";

  const random = Math.random() * 100;

  let total = 0;
  let wonItem = items[0];

  for(let item of items){

    total += item.chance;

    if(random <= total){
      wonItem = item;
      break;
    }
  }

  const roll = document.getElementById("rollItems");
  roll.innerHTML = "";

  for(let i=0;i<20;i++){

    const fake = items[Math.floor(Math.random()*items.length)];

    roll.innerHTML += `
      <div class="roll-card ${fake.rarity}">
        <div>${fake.icon}</div>
        <h3>${fake.name}</h3>
        <p>${fake.price}$</p>
      </div>
    `;
  }

  setTimeout(()=>{

    inventory.push(wonItem);

    renderInventory();

    document.getElementById("winItem").innerHTML = `
      <div class="win-card ${wonItem.rarity}">
          <div class="big-icon">${wonItem.icon}</div>
          <h2>${wonItem.name}</h2>
          <span>${wonItem.price}$</span>
      </div>
    `;

    saveGame();

  },3000);
}

/* =========================
   CLOSE MODAL
========================= */

function closeModal(){
  document.getElementById("openModal").style.display = "none";
}

/* =========================
   PROMOCODE
========================= */

function usePromo(){

  const val = document.getElementById("promoInput").value;

  if(val === "FREE" && usedPromo === "false"){

      balance += 10000;
      usedPromo = "true";

      alert("10000$ berildi!");

      updateBalance();
      saveGame();

  }else{
      alert("Promo ishlatilgan yoki noto‘g‘ri");
  }
}

/* =========================
   DAILY REWARD
========================= */

function claimDaily(){

  const now = Date.now();

  if(now - lastDaily < 86400000){
      alert("Daily allaqachon olindi!");
      return;
  }

  balance += 100;

  lastDaily = now;

  updateBalance();
  saveGame();

  alert("100$ daily reward oldingiz!");
}

/* =========================
   LANGUAGE
========================= */

function setLanguage(lang){

  if(lang === "uz"){

    document.getElementById("titleCases").innerText = "Keys Tanlang";

  }else{

    document.getElementById("titleCases").innerText = "Select Case";
  }
}

/* =========================
   START
========================= */

updateBalance();
renderInventory();
