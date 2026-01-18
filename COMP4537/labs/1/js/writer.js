/**
 * LAB 1: JSON, Object Constructor, localStorage
 * Author: Braeden Duval
 * * AI DISCLOSURE:
 * I used Google Gemini for structural guidance and debugging to encapsulate the UI elements
 * and their logic. It helped me understand the localStorage integration and DOM manipulation.
 * 
 * @link https://gemini.google.com/app
 */

class Note {
    static allNotes = [];

    constructor(id = Date.now(), content = "") {
        this.id = id;
        this.content = content;
        
        Note.allNotes.push(this);
        
        this.element = this.createDomElement();
        document.getElementById("notes-container").appendChild(this.element);
    }

    createDomElement() {
        const noteWrapper = document.createElement("div");
        noteWrapper.className = "note-wrapper";
        
        const textarea = document.createElement("textarea");
        textarea.value = this.content;

        textarea.oninput = () => {
            this.content = textarea.value;
        };

        const btn = document.createElement("button");
        btn.innerText = MESSAGES.DELETE;
        btn.onclick = () => this.remove();

        noteWrapper.appendChild(textarea);
        noteWrapper.appendChild(btn);
        return noteWrapper;
    }

    remove() {
        this.element.remove();
        Note.allNotes = Note.allNotes.filter(note => note.id !== this.id);
        Note.saveToStorage();
    }

    static saveToStorage() {
        const data = Note.allNotes.map(note => ({ id: note.id, content: note.content }));
        localStorage.setItem("notes", JSON.stringify(data));
        
        const time = new Date().toLocaleTimeString();
        document.getElementById("last-saved-time").innerText = MESSAGES.LAST_SAVED + time;
    }

    static loadFromStorage() {
        const stored = localStorage.getItem("notes");
        if (stored) {
            const data = JSON.parse(stored);
            data.forEach(note => new Note(note.id, note.content));
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add-btn").innerText = MESSAGES.ADD;
    document.getElementById("back-btn").innerText = MESSAGES.BACK;

    Note.loadFromStorage();

    document.getElementById("add-btn").onclick = () => new Note();
    
    setInterval(Note.saveToStorage, 2000);
});