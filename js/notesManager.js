document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("noteForm");
  if (!form) return;

  const editId = localStorage.getItem("editId");
  let editNoteData = null;

  // Kalau mode edit, isi field dulu
  if (editId) {
    const notes = getNotes();
    editNoteData = notes.find((n) => n.id == editId);

    if (editNoteData) {
      document.getElementById("title").value = editNoteData.title;
      document.getElementById("category").value = editNoteData.category;
      document.getElementById("descriptionEditor").innerHTML =
        editNoteData.description;
      document.getElementById("colorValue").value = editNoteData.color;
    }
  }

  // Color selector
  document.querySelectorAll(".color-circle").forEach((circle) => {
    circle.addEventListener("click", () => {
      const selected = circle.getAttribute("data-color");
      document.getElementById("colorValue").value = selected;
    });
  });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("descriptionEditor").innerHTML;
    const color = document.getElementById("colorValue").value;

    if (!title || !category || !description) {
      alert("Fill all field!");
      return;
    }

    const note = {
      id: editId ? Number(editId) : Date.now(),
      title,
      category,
      description,
      color,
      date: new Date().toLocaleDateString("id-ID"),
      favorite: editNoteData ? editNoteData.favorite : false,
    };

    if (editId) {
      updateNote(note);
      localStorage.removeItem("editId");
    } else {
      addNote(note);
    }

    window.location.href = "/dashboard.html";
  });
});
