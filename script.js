const tg = window.Telegram.WebApp;
tg.expand();

// Til ma'lumotlari
const i18n = {
    uz: {
        nav_cases: "Keyslar", nav_inv: "Inventar", nav_profile: "Profil",
        title_cases: "Keys Tanlang", title_inv: "Mening Inventarim", title_profile: "Sozlamalar",
        label_lang: "Tilni tanlang:", label_stats: "Sizning natijangiz yaqin orada bu yerda bo'ladi.",
        btn_open: "Ochish", btn_sell: "Sotish", btn_close: "Yopish",
        msg_money: "Mablag' yetarli emas!", msg_win: "Tabriklaymiz! Siz yutdingiz: ",
        opening: "Keys ochilmoqda..."
    },
    en: {
        nav_cases: "Cases", nav_inv: "Inventory", nav_profile: "Profile",
        title_cases: "Select Case", title_inv: "My Inventory", title_profile: "Settings",
        label_lang: "Select Language:", label_stats: "Your statistics will be here soon.",
        btn_open: "Open", btn_sell: "Sell", btn_close: "Close",
        msg_money: "Not enough money!", msg_win: "Congratulations! You won: ",
        opening: "Opening case..."
    }
};

let currentLang = localStorage.getItem('lang') || 'uz';
let balance = parseFloat(localStorage.getItem('balance')) || 1000.00;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Case ma'lumotlari (har birida 15 ta CS2 skin)
const caseData = [
    { name: "Standard", price: 10, skins: [
        { name: "P250 | Sand Dune", price: 5, rarity: "rarity-blue", img: "assets/weapon/case1/5.png" },
        { name: "Glock-18 | Groundwater", price: 7, rarity: "rarity-blue", img: "assets/weapon/case1/6.png" },
        { name: "MP9 | Sand Scale", price: 10, rarity: "rarity-blue", img: "assets/weapon/case1/7.png" },
        { name: "Nova | Polar Mesh", price: 12, rarity: "rarity-blue", img: "assets/weapon/case1/8.png" },
        { name: "UMP-45 | Urban DDPAT", price: 15, rarity: "rarity-blue", img: "assets/weapon/case1/9.png" },
        { name: "FAMAS | Colony", price: 18, rarity: "rarity-blue", img: "assets/weapon/case1/10.png" },
        { name: "Galil AR | Hunting Blind", price: 20, rarity: "rarity-blue", img: "assets/weapon/case1/11.png" },
        { name: "MAC-10 | Candy Apple", price: 25, rarity: "rarity-darkblue", img: "assets/weapon/case1/12.png" },
        { name: "Five-SeveN | Contractor", price: 30, rarity: "rarity-darkblue", img: "assets/weapon/case1/13.png" },
        { name: "Tec-9 | VariCamo", price: 35, rarity: "rarity-darkblue", img: "assets/weapon/case1/14.png" },
        { name: "PP-Bizon | Sand Dashed", price: 40, rarity: "rarity-darkblue", img: "assets/weapon/case1/15.png" },
        { name: "SCAR-20 | Storm", price: 45, rarity: "rarity-gold", img: "assets/weapon/case1/16.png" },
        { name: "Dual Berettas | Colony", price: 50, rarity: "rarity-gold", img: "assets/weapon/case1/17.png" },
        { name: "Sawed-Off | Snake Camo", price: 55, rarity: "rarity-gold", img: "assets/weapon/case1/18.png" },
        { name: "SSG 08 | Blue Spruce", price: 60, rarity: "rarity-legendary", img: "assets/weapon/case1/19.png" }
    ]},
    { name: "Elite", price: 100, skins: [
        { name: "AK-47 | Slate", price: 50, rarity: "rarity-blue", img: "assets/weapon/case2/20.png" },
        { name: "M4A1-S | Nitro", price: 70, rarity: "rarity-blue", img: "assets/weapon/case2/21.png" },
        { name: "USP-S | Cyrex", price: 90, rarity: "rarity-blue", img: "assets/weapon/case2/22.png" },
        { name: "Desert Eagle | Bronze Deco", price: 100, rarity: "rarity-blue", img: "assets/weapon/case2/23.png" },
        { name: "AWP | Safari Mesh", price: 120, rarity: "rarity-blue", img: "assets/weapon/case2/24.png" },
        { name: "MP7 | Akoben", price: 140, rarity: "rarity-blue", img: "assets/weapon/case2/25.png" },
        { name: "SG 553 | Tiger Moth", price: 160, rarity: "rarity-blue", img: "assets/weapon/case2/26.png" },
        { name: "CZ75-Auto | Tigris", price: 180, rarity: "rarity-darkblue", img: "assets/weapon/case2/27.png" },
        { name: "AUG | Torque", price: 200, rarity: "rarity-darkblue", img: "assets/weapon/case2/28.png" },
        { name: "XM1014 | Tranquility", price: 220, rarity: "rarity-darkblue", img: "assets/weapon/case2/29.png" },
        { name: "P90 | Grim", price: 240, rarity: "rarity-darkblue", img: "assets/weapon/case2/30.png" },
        { name: "G3SG1 | Murky", price: 260, rarity: "rarity-gold", img: "assets/weapon/case2/31.png" },
        { name: "MAG-7 | Heaven Guard", price: 280, rarity: "rarity-gold", img: "assets/weapon/case2/32.png" },
        { name: "Negev | Terrain", price: 300, rarity: "rarity-gold", img: "assets/weapon/case2/33.png" },
        { name: "MP5-SD | Gauss", price: 320, rarity: "rarity-legendary", img: "assets/weapon/case2/34.png" }
    ]},
    { name: "Lucky", price: 1000, skins: [
    { name: "AWP | Asiimov", price: 300, rarity: "rarity-blue", img: "assets/weapon/case3/35.png" },
    { name: "AK-47 | Redline", price: 350, rarity: "rarity-blue", img: "assets/weapon/case3/36.png" },
    { name: "M4A4 | Desert-Strike", price: 400, rarity: "rarity-blue", img: "assets/weapon/case3/37.png" },
    { name: "Glock-18 | Water Elemental", price: 450, rarity: "rarity-blue", img: "assets/weapon/case3/38.png" },
    { name: "P90 | Trigon", price: 500, rarity: "rarity-blue", img: "assets/weapon/case3/39.png" },
    { name: "FAMAS | Mecha Industries", price: 600, rarity: "rarity-blue", img: "assets/weapon/case3/40.png" },
    { name: "UMP-45 | Arctic Wolf", price: 700, rarity: "rarity-blue", img: "assets/weapon/case3/41.png" },
    { name: "SSG 08 | Abyss", price: 800, rarity: "rarity-darkblue", img: "assets/weapon/case3/42.png" },
    { name: "MAC-10 | Neon Rider", price: 900, rarity: "rarity-darkblue", img: "assets/weapon/case3/43.png" },
    { name: "Galil AR | Chatterbox", price: 1000, rarity: "rarity-darkblue", img: "assets/weapon/case3/44.png" },
    { name: "SCAR-20 | Cyrex", price: 1200, rarity: "rarity-darkblue", img: "assets/weapon/case3/45.png" },
    { name: "AUG | Chameleon", price: 1400, rarity: "rarity-gold", img: "assets/weapon/case3/46.png" },
    { name: "Tec-9 | Isaac", price: 1600, rarity: "rarity-gold", img: "assets/weapon/case3/47.png" },
    { name: "CZ75-Auto | Pole Position", price: 1800, rarity: "rarity-gold", img: "assets/weapon/case3/48.png" },
    { name: "MP9 | Rose Iron", price: 2000, rarity: "rarity-legendary", img: "assets/weapon/case3/49.png" }
]}
    { name: "Legendary", price: 5000, skins: [
    { name: "AWP | Dragon Lore", price: 2000, rarity: "rarity-blue", img: "assets/weapon/case4/50.png" },
    { name: "M4A4 | Howl", price: 2500, rarity: "rarity-blue", img: "assets/weapon/case4/51.png" },
    { name: "AK-47 | Fire Serpent", price: 3000, rarity: "rarity-blue", img: "assets/weapon/case4/52.png" },
    { name: "Karambit | Fade", price: 3500, rarity: "rarity-blue", img: "assets/weapon/case4/53.png" },
    { name: "Butterfly Knife | Doppler", price: 4000, rarity: "rarity-blue", img: "assets/weapon/case4/54.png" },
    { name: "Desert Eagle | Blaze", price: 4500, rarity: "rarity-darkblue", img: "assets/weapon/case4/55.png" },
    { name: "Glock-18 | Fade", price: 5000, rarity: "rarity-darkblue", img: "assets/weapon/case4/56.png" },
    { name: "Bayonet | Marble Fade", price: 5500, rarity: "rarity-darkblue", img: "assets/weapon/case4/57.png" },
    { name: "M9 Bayonet | Crimson Web", price: 6000, rarity: "rarity-darkblue", img: "assets/weapon/case4/58.png" },
    { name: "AWP | Gungnir", price: 7000, rarity: "rarity-gold", img: "assets/weapon/case4/59.png" },
    { name: "AK-47 | Wild Lotus", price: 8000, rarity: "rarity-gold", img: "assets/weapon/case4/60.png" },
    { name: "M4A1-S | Chantico’s Fire", price: 8500, rarity: "rarity-gold", img: "assets/weapon/case4/61.png" },
    { name: "Talon Knife | Tiger Tooth", price: 9000, rarity: "rarity-gold", img: "assets/weapon/case4/62.png" },
    { name: "Bowie Knife | Damascus Steel", price: 9500, rarity: "rarity-legendary", img: "assets/weapon/case4/63.png" },
    { name: "Skeleton Knife | Slaughter", price: 10000, rarity: "rarity-legendary", img: "assets/weapon/case4/64.png" }
]}
