// import { getNotes, deleteNote } from "./data.js";

// Render notes di dashboard
function renderNotes() {
  const notes = getNotes();
  const list = document.getElementById("notesList");

  list.innerHTML = "";

  notes.forEach((note) => {
    list.innerHTML += `
      <div class="col-md-4">
        <div class="note-card card-${note.color} h-100 d-flex flex-column">
          <h3>${note.title}</h3>
          <hr />
          <p class="note-text">${note.description}</p>

          <div class="row mt-auto">
            <div class="col-10">
              <span>${note.date}</span>
            </div>
            <div class="col-2">
              <button class="delete-btn" onclick="handleDelete(${note.id})">
                <i class="ri-delete-bin-7-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function getNotes() {
  return JSON.parse(localStorage.getItem("notes") || "[]");
}

// --- Simpan Notes ---
function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  saveNotes(notes);
}

// Hapus note
window.handleDelete = (id) => {
  deleteNote(id);
  renderNotes();
};

// Auto render saat dashboard dibuka
if (document.getElementById("notesList")) {
  renderNotes();
}
