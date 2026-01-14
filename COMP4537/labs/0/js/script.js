/* COMP-4537 Lab 0
    Author: Braeden Duval
    Disclosure: I used Gemini 3 Flash to help structure the 
    asynchronous scrambling logic, the Object-Oriented Class architecture 
    and the documentation.
*/

/**
 * Represents a single game button in the memory game.
 * Handles its own creation, positioning, and label visibility.
 */
class MemoryButton 
{

    /**
     * @param {number} id - The unique numerical identifier for the button.
     * @param {string} color - The hex or CSS color string for the button background.
     * @param {HTMLElement} container - The DOM element where the button will be appended.
     */
    constructor(id, color, container) 
    {
        this.id = id,
        this.color = color,
        this.container = container,
        this.element = this.createButton();
    }

    /**
     * Creates the button element and applies initial styling.
     * @returns {HTMLButtonElement} The created button element.
     */
    createButton() 
    {
        const btn = document.createElement('button');

        btn.className = 'game-button';
        btn.innerHTML = this.id;

        btn.style.backgroundColor = this.color;
        btn.style.color = "white";
        btn.style.fontSize = "2em";

        this.container.appendChild(btn);

        return btn;
    }

    /**
     * Calculates and applies a random position within the container boundaries.
     * @param {number} maxW - The maximum width of the container.
     * @param {number} maxH - The maximum height of the container.
     */
    updatePosition(maxW, maxH) 
    {
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

    /**
     * Shows or hides the button's numerical label.
     * @param {boolean} show - True to display the ID, false to clear it.
     */
    toggleLabel(show) 
    {
        this.element.innerHTML = show ? this.id : "";
    }

    /**
     * Removes the button from the DOM.
     */
    destroy() 
    {
        this.element.remove();
    }
}

/**
 * Manages the game state, including button collection, 
 * scrambling logic, and win/loss validation.
 */
class GameController 
{   

    /** @type {MemoryButton[]} */
    constructor() 
    {
        this.buttons = [],
        this.container = document.getElementById('button-container'),
        this.clickCounter = 1;
        this.isScrambling = false;
    }

    /**
     * Triggers a single relocation of all buttons within the container.
     */
    scramble() 
    {
        const currentW = this.container.clientWidth;
        const currentH = this.container.clientHeight;

        this.buttons.forEach(btn => {
            btn.element.style.position = "absolute";
            btn.updatePosition(currentW, currentH);
        });
    }

    /**
     * Prepares buttons for the testing phase by hiding labels and attaching click listeners.
     */
    startTestingPhase() 
    {
        this.buttons.forEach(btn => {
            btn.toggleLabel(false);
            btn.element.onclick = () => {
                if (!this.isScrambling) this.checkLogic(btn);
            }
        });
    }

    /**
     * Validates if the clicked button matches the expected sequence.
     * @param {MemoryButton} btn - The button that was clicked.
     */
    checkLogic(btn) 
    {
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

    /**
     * Displays all button numerical labels.
     */
    revealAll() 
    {
        this.buttons.forEach(b => b.toggleLabel(true));
    }

    /**
     * Disables click events for all buttons.
     */
    lockButtons() 
    {
        this.buttons.forEach(btn => btn.element.onclick = null);
    }

    /**
     * Clears existing buttons and resets the game state.
     */
    reset() 
    {
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];
        this.clickCounter = 1;
    }

    /**
     * Helper to create a delay using Promises.
     * @param {number} ms - Milliseconds to wait.
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initializes the game loop: creation, delay, scrambling, and testing.
     * @param {number} n - The number of buttons to generate.
     */
    async initGame(n) 
    {
        if (this.isScrambling) return;
        this.reset();

        // 1. Creation Phase
        for (let i = 1; i <= n; i++) 
            {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            const btn = new MemoryButton(i, color, this.container);
            btn.element.style.position = "relative";
            btn.element.style.display = "inline-block";
            this.buttons.push(btn);

        }

        // Wait before scrambling
        await this.sleep(n * 1000);


        // 2. Scrambling Phase
        this.isScrambling = true;
        for (let i = 0; i < n; i++) 
            {
            const currentW = this.container.clientWidth;
            const currentH = this.container.clientHeight;

            this.buttons.forEach(btn => {
                btn.element.style.position = "absolute";
                btn.updatePosition(currentW, currentH);
            });

            await this.sleep(2000);
        }

        this.isScrambling = false;

        // 3. Testing Phase
        this.startTestingPhase();
    }

}

/**
 * Manages the User Interface components like input fields and start buttons.
 */
class UIManager 
{   

    /**
     * @param {GameController} gameEngine 
     * The game controller instance to link to UI actions.
     */
    constructor(gameEngine) 
    {
        this.gameEngine = gameEngine;
        this.setupUI();
    }

    /**
     * Dynamically creates and injects UI elements into the page.
     */
    setupUI() 
    {
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

// Entry Point
const gameApp = new GameController();
new UIManager(gameApp);