/* COMP-4537 Lab 0
    Author: Braeden Duval
    Disclosure: I used Gemini 3 Flash to help structure the 
    asynchronous scrambling logic and the Object-Oriented Class architecture.
*/

class MemoryButton {
    constructor(id, color, container) {
        this.id = id,
            this.color = color,
            this.container = container,
            this.element = this.createButton();
    }

    createButton() {
        const btn = document.createElement('button');

        btn.className = 'game-button';
        btn.innerHTML = this.id;

        btn.style.backgroundColor = this.color;
        btn.style.color = "white";
        btn.style.fontSize = "2em";

        this.container.appendChild(btn);

        return btn;
    }

    updatePosition(maxW, maxH) {
        // 1. Get current size 
        const btnWidth = this.element.offsetWidth;
        const btnHeight = this.element.offsetHeight;

        // 2. Calculate max allowable coordinates
        const maxX = maxW - btnWidth;
        const maxY = maxH - btnHeight;

        // 3. Generate random pixel values
        const randomX = Math.floor(Math.random() * Math.max(0, maxX));
        const randomY = Math.floor(Math.random() * Math.max(0, maxY));

        // 4. Apply directly in pixels
        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
    }

    toggleLabel(show) {
        this.element.innerHTML = show ? this.id : "";
    }

    destroy() {
        this.element.remove();
    }
}

class GameController {
    constructor() {
        this.buttons = [],
            this.container = document.getElementById('button-container'),
            this.clickCounter = 1;
        this.isScrambling = false;
    }

    scramble() {
        const currentW = this.container.clientWidth;
        const currentH = this.container.clientHeight;

        this.buttons.forEach(btn => {
            btn.element.style.position = "absolute";
            btn.updatePosition(currentW, currentH);
        });
    }

    startTestingPhase() {
        this.buttons.forEach(btn => {
            btn.toggleLabel(false);
            btn.element.onclick = () => {
                if (!this.isScrambling) this.checkLogic(btn);
            }
        });
    }

    checkLogic(btn) {
        if (btn.id === this.clickCounter) {
            btn.toggleLabel(true);

            if (this.clickCounter === this.buttons.length) {
                setTimeout(() => alert(MESSAGES.CORRECT), 100);
            }
            this.clickCounter++;
        }
        else {
            alert(MESSAGES.WRONG);
            this.revealAll();
            this.lockButtons();
        }
    }

    revealAll() {
        this.buttons.forEach(b => b.toggleLabel(true));
    }

    lockButtons() {
        this.buttons.forEach(btn => btn.element.onclick = null);
    }

    reset() {
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];
        this.clickCounter = 1;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async initGame(n) {
        if (this.isScrambling) return;
        this.reset();

        for (let i = 1; i <= n; i++) {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            const btn = new MemoryButton(i, color, this.container);
            btn.element.style.position = "relative";
            btn.element.style.display = "inline-block";
            this.buttons.push(btn);

        }

        await this.sleep(n * 1000);

        this.isScrambling = true;

        for (let i = 0; i < n; i++) {
            const currentW = this.container.clientWidth;
            const currentH = this.container.clientHeight;

            this.buttons.forEach(btn => {
                btn.element.style.position = "absolute";
                btn.updatePosition(currentW, currentH);
            });

            await this.sleep(2000);
        }

        this.isScrambling = false;

        this.startTestingPhase();
    }

}

class UIManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.setupUI();
    }

    setupUI() {
        const root = document.getElementById('ui-container');
        const label = document.createElement('label');

        label.textContent = MESSAGES.PROMPT;
        label.style.display = "block";
        label.style.marginBottom = "10px";
        label.style.marginLeft = "5px";

        const input = document.createElement('input');
        input.type = 'number';
        input.style.marginLeft = "5px";

        const goBtn = document.createElement('button');
        goBtn.textContent = MESSAGES.GO;
        goBtn.onclick = () => {
            const val = parseInt(input.value);
            if (val >= 3 && val <= 7) {
                this.gameEngine.initGame(val);
            } else {
                alert(MESSAGES.INVALID_INPUT);
            }
        };

        root.append(label, input, goBtn);
    }
}

const gameApp = new GameController();
new UIManager(gameApp);