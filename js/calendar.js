// kode kalender
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input");

let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = null;
let editingIndex = null;
let openedDetailID = null;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const fullDate = `${year}-${month + 1}-${i}`;

    const isToday =
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth();

    days += `<div class="day ${
      isToday ? "today active" : ""
    }" data-date="${fullDate}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;

  // buat ngepastiin event dimuat setelah calendar selesai dibuat
  setTimeout(() => {
    loadEventsIntoCalendar();
    document.dispatchEvent(new Event("calendar-ready"));
  }, 0);
}
initCalendar();
// navigation
prev.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
});
next.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
});
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});
// GOTO DATE
gotoBtn.addEventListener("click", gotoDate);
function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}
// modal input
const addBtn = document.querySelector(".add-note-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const closeModal = document.querySelector(".close-modal");
const colorChoices = document.querySelectorAll(".color-circle");
const submitBtn = document.querySelector(".add-note-submit");
const notesContainer = document.querySelector(".notes-container");
let selectedColor = "#A86CFF";
// buka modal add
addBtn.addEventListener("click", () => {
  const t = new Date();
  selectedDate = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
  editingIndex = null;
  modalOverlay.classList.add("active");
  document.querySelector(".note-text").value = "";
  document.querySelector(".time-from").value = "";
  document.querySelector(".time-to").value = "";
});
// klik tanggal buka modal add
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("day") &&
    !e.target.classList.contains("prev-date") &&
    !e.target.classList.contains("next-date")
  ) {
    selectedDate = e.target.dataset.date;
    editingIndex = null;

    modalOverlay.classList.add("active");
    document.querySelector(".note-text").value = "";
    document.querySelector(".time-from").value = "";
    document.querySelector(".time-to").value = "";
  }
});
// close modal add
closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});
// pilih warna
colorChoices.forEach((c) => {
  c.addEventListener("click", () => {
    colorChoices.forEach((x) => x.classList.remove("color-selected"));
    c.classList.add("color-selected");
    selectedColor = c.getAttribute("data-color");
  });
});
// save notes
submitBtn.addEventListener("click", () => {
  const text = document.querySelector(".note-text").value.trim();
  const from = document.querySelector(".time-from").value.trim();
  const to = document.querySelector(".time-to").value.trim();

  if (!text) return alert("Isi agenda dulu!");
  if (!selectedDate) return alert("Tanggal belum dipilih!");

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  notes.push({
    text,
    from,
    to,
    color: selectedColor,
    date: selectedDate,
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  modalOverlay.classList.remove("active");

  document.addEventListener("calendar-ready", function refreshOnce() {
    loadNotes();
    document.removeEventListener("calendar-ready", refreshOnce);
  });

  initCalendar();
});
// load to calender
function loadEventsIntoCalendar() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach((n, i) => {
    const dayDiv = document.querySelector(`.day[data-date="${n.date}"]`);
    if (!dayDiv) return;

    const eventCard = document.createElement("div");
    eventCard.className = "event-card";
    eventCard.style.background = n.color + "30";
    eventCard.setAttribute("data-id", i);
    eventCard.innerHTML = `
     <div class="event-bar" style="background:${n.color}"></div>
     <div class="event-text">
       <p>${n.text}</p>
       <span>${n.from} - ${n.to}</span>
     </div>
   `;
    eventCard.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetailModal(i);
    });
    dayDiv.appendChild(eventCard);
    dayDiv.classList.add("has-event");
  });
}
// modal detail
const detailOverlay = document.querySelector(".detail-modal-overlay");
const detailTitle = document.querySelector(".detail-title");
const detailTime = document.querySelector(".detail-time");
const detailColor = document.querySelector(".detail-color-preview");
const detailDeleteBtn = document.querySelector(".detail-delete-btn");
const detailCloseBtn = document.querySelector(".detail-close-btn");

function openDetailModal(id) {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const n = notes[id];

  openedDetailID = id;

  detailTitle.textContent = n.text;
  detailTime.textContent = `${n.from} - ${n.to}`;
  detailColor.style.background = n.color;

  detailOverlay.classList.add("active");
}
// close detail modal
detailCloseBtn.addEventListener("click", () => {
  detailOverlay.classList.remove("active");
});
// delete event from detail modal
detailDeleteBtn.addEventListener("click", () => {
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.splice(openedDetailID, 1);

  localStorage.setItem("notes", JSON.stringify(notes));
  detailOverlay.classList.remove("active");
  document.addEventListener("calendar-ready", function refreshOnce() {
    loadNotes();
    document.removeEventListener("calendar-ready", refreshOnce);
  });
  initCalendar();
});
