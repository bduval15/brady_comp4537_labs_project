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
    // master list of notes
    static allNotes = [];

    // creates new note object - Date.now() gives a unique id based on current time if
    // no id is provided, content defaults to empty string
    constructor(id = Date.now(), content = "") {
        this.id = id;
        this.content = content;

        // everytime a new note is created, it adds itself to the master list
        Note.allNotes.push(this);

        // triggers UI creation, and attaches the note to the HTML page
        this.element = this.createDomElement();
        document.getElementById("notes-container").appendChild(this.element);
    }

    // builds the HTML elements for a single note
    createDomElement() {
        const noteWrapper = document.createElement("div");
        noteWrapper.className = "note-wrapper";

        const textarea = document.createElement("textarea");
        textarea.value = this.content;

        // listener, updates content AND saves to storage on every character change
        textarea.addEventListener("input", () => {
            this.content = textarea.value;
            Note.saveToStorage(); 
        });

        const btn = document.createElement("button");
        btn.innerText = MESSAGES.DELETE;
        btn.onclick = () => this.remove();

        noteWrapper.appendChild(textarea);
        noteWrapper.appendChild(btn);
        return noteWrapper;
    }

    remove() {

        //deletes note from user's screen
        this.element.remove();

        // cleans master list, creates a new list of every note except the 
        // one with the unique id being deleted
        Note.allNotes = Note.allNotes.filter(note => note.id !== this.id);

        // updates localStorage to reflect deletion
        Note.saveToStorage();
    }

    static saveToStorage() {

        // creates clean version of data to store - strips away HTML element
        // note.id -> key, note.content -> value
        const data = Note.allNotes.map(note => ({ id: note.id, content: note.content }));

        // stringify converts JavaScript object into a string for storage
        localStorage.setItem("notes", JSON.stringify(data));

        // updates last saved time on the UI
        const time = new Date().toLocaleTimeString();
        document.getElementById("last-saved-time").innerText = MESSAGES.LAST_SAVED + time;
    }

    static loadFromStorage() {

        // retrieves stored notes from localStorage
        const stored = localStorage.getItem("notes");
        if (stored) {

            // turns text string back into JavaScript objects
            const data = JSON.parse(stored);
            // creates new Note instances for each stored note
            data.forEach(note => new Note(note.id, note.content));
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add-btn").innerText = MESSAGES.ADD;
    document.getElementById("back-btn").innerText = MESSAGES.BACK;

    // loads any previously saved notes from localStorage
    Note.loadFromStorage();

    document.getElementById("add-btn").addEventListener("click", () => {
        new Note();
        Note.saveToStorage(); 
    });

    // auto-saves notes to localStorage every 2 seconds
    setInterval(Note.saveToStorage, 2000);
});