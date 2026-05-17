// ===============================
// 🔊 TELEGRAM INIT (TO‘G‘RILANMAYDI)
// ===============================
const tg = window.Telegram.WebApp;
tg.expand();


// ===============================
// 🔊 SOUND SYSTEM (ONLY ADDITION)
// ===============================
const Sound = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    tap() {
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = 650;

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },

    caseOpen() {
        this.init();

        let delay = 40;
        let running = true;

        const tick = () => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "square";
            osc.frequency.value = 1100;

            gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.03);
        };

        const loop = () => {
            if (!running) return;

            tick();
            delay += 20;

            if (delay > 520) {
                running = false;
                return;
            }

            setTimeout(loop, delay);
        };

        loop();
    }
};


// ===============================
// 🔊 AUTO TAP SOUND (ALL BUTTONS)
// ===============================
document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    Sound.tap();
});


// ===============================
// 🎁 CASE OPEN (ONLY ADD SOUND)
// ===============================
function openCase(idx) {

    Sound.caseOpen(); // 🔊 ONLY ADDED

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

        const item = getRandomItem(c.skins);

        const card = document.createElement('div');
        card.className = `skin-card ${item.rarity}`;
        card.innerHTML = `
            <img src="${item.img}">
            <span>${item.name}</span>
            <b>${item.price}$</b>
        `;

        carousel.appendChild(card);

        if (i === winIndex) winner = item;
    }

    setTimeout(() => {
        carousel.style.transition = 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)';
        carousel.style.transform = `translateX(-${(winIndex * 112) - 104}px)`;
    }, 100);

    setTimeout(() => {
        inventory.push(winner);
        updateGlobalData();

        document.getElementById('close-modal').classList.remove('hidden');

        alert(i18n[currentLang].msg_win + winner.name);

    }, 5600);
}
