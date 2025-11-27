// Ambil user dari localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Kalau ada user (berhasil login)
if (user) {
  const sidebarName = document.getElementById("sidebarName");
  const topbarName = document.getElementById("topbarName");

  // Replace nama
  if (sidebarName) sidebarName.textContent = user.name;
  if (topbarName) topbarName.textContent = user.name;
} else {
  // Kalau ga ada user -> user belum login -> balikin ke login page
  window.location.href = "/index.html";
}

function renderNotes(listData = null) {
  const notes = listData || getNotes();
  const list = document.getElementById("notesList");

  list.innerHTML = "";

  notes.forEach((note) => {
    list.innerHTML += `
      <div class="col-md-4">
        <div class="note-card card-${note.color} h-100 d-flex flex-column">
          
          <div class="d-flex justify-content-between align-items-center">
            <h3>${note.title}</h3>
            <span class="badge bg-light text-dark">${note.category}</span>
          </div>

          <hr />
          <p class="note-text">${note.description}</p>

          <div class="row mt-auto align-items-center">
            <div class="col-8">
              <span>${note.date}</span>
            </div>

            <div class="col-4 d-flex justify-content-end gap-2">

              <button class="edit-btn" onclick="goEdit(${note.id})">
                <i class="ri-edit-2-fill"></i>
              </button>

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

window.handleDelete = (id) => {
  deleteNote(id);
  renderNotes();
};

window.goEdit = (id) => {
  localStorage.setItem("editId", id);
  window.location.href = "/add-notes.html";
  document.getElementById("addNoteTitle");
};

window.goView = (id) => {
  window.location.href = `/view-note.html?id=${id}`;
};

if (document.getElementById("notesList")) {
  renderNotes();
}

// Search bar
const searchInput = document.getElementById("search");

// Event listener saat user mengetik
searchInput.addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase().trim();

  // Ambil seluruh notes
  const notes = getNotes();

  // Filter data berdasarkan keyword
  const filteredNotes = notes.filter((note) => {
    const title = note.title.toLowerCase();
    const category = note.category.toLowerCase();
    const desc = note.description.toLowerCase();

    return (
      title.includes(keyword) ||
      category.includes(keyword) ||
      desc.includes(keyword)
    );
  });

  // Render hasil pencarian
  renderNotes(filteredNotes);
});
