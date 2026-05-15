const tg = window.Telegram.WebApp;

tg.expand();

const clickSound =
document.getElementById('clickSound');

const openSound =
document.getElementById('openSound');

function playClick(){

clickSound.currentTime = 0;

clickSound.play();

}

function playOpen(){

openSound.currentTime = 0;

openSound.play();

}

let balance =
parseFloat(localStorage.getItem('balance')) || 1000;

let inventory =
JSON.parse(localStorage.getItem('inventory')) || [];

const caseImages = [

"69084.jpg",
"69007.jpg",
"69008.jpg",
"69009.jpg"

];

const caseData = [

{
name:"Standard",
price:10,
image:caseImages[0]
},

{
name:"Elite",
price:100,
image:caseImages[1]
},

{
name:"Lucky",
price:500,
image:caseImages[2]
},

{
name:"Legendary",
price:1250,
image:caseImages[3]
}

];

function renderCases(){

const container =
document.getElementById('case-list');

container.innerHTML = '';

caseData.forEach((c,idx)=>{

const div =
document.createElement('div');

div.className =
'premium-card';

div.innerHTML = `

<div class="case-top">

<img
class="case-image"
src="${c.image}">

</div>

<div class="case-info">

<h3>${c.name}</h3>

<p class="case-price">
${c.price} $
</p>

<button
class="open-btn"
onclick="playClick();openCase(${idx})">

🔓 Ochish

</button>

</div>

`;

container.appendChild(div);

});

}

function randomRarity(){

const rarities = [

"rarity-blue",
"rarity-green",
"rarity-purple",
"rarity-gold",
"rarity-red"

];

return rarities[
Math.floor(Math.random()*rarities.length)
];

}

function openCase(idx){

playOpen();

const c = caseData[idx];

if(balance < c.price){

alert("Pul yetarli emas");

return;

}

balance -= c.price;

updateData();

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

let winner;

for(let i=0;i<45;i++){

const rarity =
randomRarity();

const price =
Math.floor(Math.random()*5000)+1;

const item = {

name:"Item "+price,

price:price,

rarity:rarity,

img:"https://cdn-icons-png.flaticon.com/512/3523/3523887.png"

};

if(i===winIndex){

winner = item;

}

const card =
document.createElement('div');

card.className =
`skin-card ${rarity}`;

card.innerHTML = `

<img src="${item.img}">

<span>${item.name}</span>

<b>${item.price}$</b>

`;

carousel.appendChild(card);

}

setTimeout(()=>{

carousel.style.transition =
'transform 5s cubic-bezier(0.1,0,0.1,1)';

carousel.style.transform =
`translateX(-${(winIndex*124)-104}px)`;

},100);

setTimeout(()=>{

inventory.push(winner);

updateData();

alert(
`Siz yutdingiz:
${winner.name}
${winner.price}$`
);

},5600);

}

function renderInventory(){

const container =
document.getElementById('inventory-list');

container.innerHTML = '';

inventory.forEach((item,i)=>{

const div =
document.createElement('div');

div.className =
`inv-item ${item.rarity}`;

div.innerHTML = `

<img src="${item.img}">

<p>${item.price}$</p>

<button onclick="sellItem(${i})">

Sotish

</button>

`;

container.appendChild(div);

});

}

function sellItem(i){

balance += inventory[i].price;

inventory.splice(i,1);

updateData();

}

function updateData(){

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

}

function changeLanguage(lang){

alert("Language Changed");

}

document.getElementById('user-name').innerText =
tg.initDataUnsafe.user?.first_name || "User";

if(tg.initDataUnsafe.user?.photo_url){

document.getElementById('user-photo').src =
tg.initDataUnsafe.user.photo_url;

}

renderCases();

updateData();
