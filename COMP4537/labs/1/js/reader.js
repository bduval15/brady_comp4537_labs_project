/**
 * LAB 1: JSON, Object Constructor, localStorage
 * Author: Braeden Duval
 * * AI DISCLOSURE:
 * I used Google Gemini for structural guidance and debugging to encapsulate the UI elements
 * and their logic. It helped me understand the localStorage integration and DOM manipulation.
 * 
 * @link https://gemini.google.com/app
 */

class NoteReader {
    constructor() {
        this.container = document.getElementById("reader-content");
        this.lastUpdate = document.getElementById("last-update");
        this.loadNotes();

        window.addEventListener('storage', (event) => {
        if (event.key === 'notes') {
            this.loadNotes();
        }
    });
    }

    loadNotes() {

        // reaches into browser's localStorage to find a string labeled "notes"
        const stored = localStorage.getItem("notes");
        
        // updates the last updated time to localized time format
        const time = new Date().toLocaleTimeString();
        if (this.lastUpdate) {
            this.lastUpdate.innerText = MESSAGES.LAST_UPDATE + time;
        }

        // clears out old notes before drawing new ones. prevents the list 
        // from growing forever every 2 seconds
        this.container.innerHTML = "";

        if (stored) {

            // localStorage only stores strings, so we have to convert them into
            // a JavaScript object/array so we can loop through it
            const notes = JSON.parse(stored);

            // loops through each note and creates a div element to display it
            notes.forEach(n => {
                const div = document.createElement("div");
                div.className = "note-read-only";
                div.innerText = n.content; 
                this.container.appendChild(div);
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("back-btn").innerText = MESSAGES.BACK;
    
    // creates a new NoteReader instance to run the logic
    new NoteReader();
});