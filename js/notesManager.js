// import { addNote } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("noteForm");
  if (!form) return;

  // convert editor html ke input hidden
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // ambil data form
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("descriptionEditor").innerHTML;
    const color = document.getElementById("colorValue").value;

    if (!title || !category || !description) {
      alert("Isi semua field!");
      return;
    }

    // bikin object note baru
    const note = {
      id: Date.now(),
      title,
      category,
      description,
      color,
      date: new Date().toLocaleDateString("id-ID"),
    };

    addNote(note);

    // redirect ke dashboard
    window.location.href = "/dashboard.html";
  });
});

function addNote(note) {
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
}
