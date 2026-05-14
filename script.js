let balance = 50.00;

const skins = [
    { name: "M4A4 | Spider Lily", rarity: "#d32ce6", img: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjx2jJemkV09_5lpKKqPrxN7LEmyVQ7p0o3-uUrNms2wXsr0o9Z27ycY_AdlA6ZArR_FPrw7u508Xv6p_MyHphu3Ih4S7D30vgfU9_v_o" },
    { name: "AK-47 | Slate", rarity: "#4b69ff", img: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjx2jJemkV09-5lpKKqPrxN7LEmyVQ7p0o3-uUrNms2wXsr0o9Z27ycY_AdlA6ZArR_FPrw7u508Xv6p_MyHphu3Ih4S7D30vgfU9_v_o" },
    { name: "AWP | Chromatic", rarity: "#eb4b4b", img: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV969C_m4S0m_7zO6-fzj9V7cJ0nuzV8NigjQaxrh1pYm_wI46Wd1A6YFvY-1m5x7u908e76Z7AnXFqv3V0t3_cmBapwUYb_9S8_N0" },
    { name: "Knife | Gamma", rarity: "#ffb100", img: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1f_BYi5H49KZlY2Ek_P7Nrfum25V4dB8xOzA_In0iVbkq0o5ZTr0J9TAdw9sYFvYr1S6x7u508S96ZzKy3pgvCJx4X7D30vgr6vY66E" }
];

function openCase() {
    if (balance < 10) return alert("Coin yetarli emas!");
    
    balance -= 10;
    document.getElementById('balance').innerText = balance.toFixed(2);
    const btn = document.getElementById('open-btn');
    btn.disabled = true;

    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';
    carousel.style.transition = 'none';
    carousel.style.transform = 'translateX(0)';

    const winIndex = 30;
    let winningSkin;

    for (let i = 0; i < 40; i++) {
        const res = skins[Math.floor(Math.random() * skins.length)];
        const div = document.createElement('div');
        div.className = 'skin-card';
        div.style.borderBottomColor = res.rarity;
        div.innerHTML = `<img src="${res.img}"><span>${res.name}</span>`;
        carousel.appendChild(div);
        if (i === winIndex) winningSkin = res;
    }

    setTimeout(() => {
        carousel.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)';
        const cardWidth = 114; 
        const offset = (winIndex * cardWidth) - (window.innerWidth / 2 - 57);
        carousel.style.transform = `translateX(-${offset}px)`;
    }, 50);

    setTimeout(() => {
        const list = document.getElementById('inventory-list');
        const item = document.createElement('div');
        item.className = 'skin-card';
        item.style.width = "100%";
        item.style.borderBottomColor = winningSkin.rarity;
        item.innerHTML = `<img src="${winningSkin.img}" style="width:40px;"><span>${winningSkin.name}</span>`;
        list.prepend(item);
        btn.disabled = false;
        alert("Siz yutdingiz: " + winningSkin.name);
    }, 5500);
}
