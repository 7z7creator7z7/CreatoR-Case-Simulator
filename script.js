let balance = 100;
let inventory = [];

// 100 xil item yaratamiz
const items = [];
for(let i=1;i<=100;i++){
  items.push({name:"Item "+i, value:Math.floor(Math.random()*1500)+10});
}

// CASE
function openCase(price){
  if(balance < price){ alert("Balans yetarli emas!"); return; }
  balance -= price;
  document.getElementById("balance").innerText = balance;

  const drop = items[Math.floor(Math.random()*items.length)];
  let colorClass = "green";
  if(drop.value <= 200) colorClass = "blue";
  else if(drop.value <= 500) colorClass = "purple";
  else colorClass = "gold";

  document.getElementById("caseResult").innerHTML =
    `<div class="item ${colorClass}">🎉 Sizga tushdi: ${drop.name} ($${drop.value})</div>`;

  inventory.push(drop);
  renderInventory();
  renderUpgradeItems();
}

function renderInventory(){
  let html = "<h3>Inventar 📦</h3>";
  inventory.forEach((item,index)=>{
    let colorClass = item.value<=50?"green":item.value<=200?"blue":item.value<=500?"purple":"gold";
    html += `<div class="item ${colorClass}">${item.name} ($${item.value})
      <button onclick="sellItem(${index})">Sotish</button></div>`;
  });
  document.getElementById("inventory").innerHTML = html;
}

function sellItem(index){
  balance += inventory[index].value;
  document.getElementById("balance").innerText = balance;
  inventory.splice(index,1);
  renderInventory();
  renderUpgradeItems();
}

// UPGRADE
function renderUpgradeItems(){
  let select = document.getElementById("upgradeItem");
  select.innerHTML = "";
  inventory.forEach((item, index)=>{
    select.innerHTML += `<option value="${index}">${item.name} ($${item.value})</option>`;
  });
}

function doUpgrade(){
  let index = document.getElementById("upgradeItem").value;
  let target = parseInt(document.getElementById("targetValue").value);
  if(!inventory[index]){ alert("Item tanlanmagan!"); return; }

  let item = inventory[index];
  let chance = Math.min(100, Math.floor((item.value/target)*100));
  let roll = Math.random()*100;

  if(roll <= chance){
    inventory[index].value = target;
    document.getElementById("upgradeResult").innerHTML =
      `<div style="color:lime;">✅ Upgrade muvaffaqiyatli! ${item.name} endi $${target}</div>`;
  } else {
    inventory.splice(index,1);
    document.getElementById("upgradeResult").innerHTML =
      `<div style="color:red;">❌ Upgrade muvaffaqiyatsiz! Item yo‘qoldi.</div>`;
  }
  renderInventory();
  renderUpgradeItems();
}

// CRASH
let bet = 0;
let multiplier = 1.00;
let crashPoint = 0;
let interval;
let inGame = false;

function placeBet(){
  bet = parseInt(document.getElementById("betAmount").value);
  if(balance < bet){ alert("Balans yetarli emas!"); return; }
  balance -= bet;
  document.getElementById("balance").innerText = balance;
  startCrash();
}

function startCrash(){
  inGame = true;
  multiplier = 1.00;
  crashPoint = getCrashPoint();
  document.getElementById("crashStatus").innerText = "O‘yin boshlandi!";
  document.getElementById("cashoutBtn").disabled = false;

  interval = setInterval(()=>{
    multiplier += 0.1;
    document.getElementById("multiplier").innerText = "×" + multiplier.toFixed(2);

    if(multiplier >= crashPoint){
      clearInterval(interval);
      inGame = false;
      document.getElementById("cashoutBtn").disabled = true;
      document.getElementById("crashStatus").innerText = "💥 Crash ×" + crashPoint.toFixed(2) + " da to‘xtadi! Tikilgan summa yonib ketdi.";
    }
  }, 500);
}

function cashOut(){
  if(!inGame) return;
  clearInterval(interval);
  let win = bet * multiplier;
  balance += Math.floor(win);
  document.getElementById("balance").innerText = balance;
  document.getElementById("cashoutBtn").disabled = true;
  document.getElementById("crashStatus").innerText = "✅ Cashout ×" + multiplier.toFixed(2) + " da! Yutuq: " + Math.floor(win) + " MC";
  inGame = false;
}

function getCrashPoint(){
  let roll = Math.random()*100;
  if(roll < 60) return (Math.random()*1.0)+1.5;
  else if(roll < 85) return (Math.random()*5)+2.5;
  else if(roll < 95) return (Math.random()*17)+8;
  else if(roll < 99) return (Math.random()*75)+25;
  else return (Math.random()*200)+100;
          }
