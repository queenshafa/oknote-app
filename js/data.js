// KEY UTAMA LOCAL STORAGE
const NOTES_KEY = "notes";

// Ambil semua notes
function getNotes() {
  return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
}

// Simpan semua notes
function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Tambah note
function addNote(note) {
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
}

// Hapus note
function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  saveNotes(notes);
}

// Update note
function updateNote(updated) {
  let notes = getNotes();
  notes = notes.map((n) => (n.id === updated.id ? updated : n));
  saveNotes(notes);
}
