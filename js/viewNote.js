// Ambil ID dari URL
const params = new URLSearchParams(window.location.search);
const noteId = Number(params.get("id"));

const note = getNotes().find((n) => n.id === noteId);

if (!note) {
  alert("Note tidak ditemukan!");
  window.location.href = "/dashboard.html";
}

// Tampilkan data
document.getElementById("viewTitle").innerText = note.title;
document.getElementById("viewCategory").innerText = note.category;
document.getElementById("viewDate").innerText = note.date;
document.getElementById("viewDescription").innerHTML = note.description;

// Warna background card
document.getElementById("viewNoteCard").classList.add(`card-${note.color}`);

// Tombol Share
document.getElementById("shareBtn").addEventListener("click", async () => {
  const shareText = `*${note.title}*\n\n${note.description.replace(/<[^>]+>/g, "")}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: note.title,
        text: shareText,
      });
      alert("Berhasil dibagikan!");
    } catch (e) {
      console.log(e);
    }
    return;
  }

  // Fallback copy
  await navigator.clipboard.writeText(shareText);
  alert("Disalin ke clipboard!");
});
