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
        
        this.autoRefresh();
    }

    autoRefresh() {
        setInterval(() => this.loadNotes(), 2000);
    }

    loadNotes() {
        const stored = localStorage.getItem("notes");
        
        const time = new Date().toLocaleTimeString();
        if (this.lastUpdate) {
            this.lastUpdate.innerText = MESSAGES.LAST_UPDATE + time;
        }

        this.container.innerHTML = "";

        if (stored) {
            const notes = JSON.parse(stored);
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
    
    new NoteReader();
});