const modal = document.getElementById("memoModal");
const addBtn = document.getElementById("addBtn");
const closeModalBtn = document.getElementById("closeModal");
const saveMemoBtn = document.getElementById("saveMemo");
const memoText = document.getElementById("memoText");
const canvas = document.querySelector(".canvas-area");

let selectedColor = "purple";

/*opennclose*/
addBtn.onclick = () => modal.classList.add("show");
closeModalBtn.onclick = () => modal.classList.remove("show");

/*choose color*/
document.querySelectorAll(".color-circle").forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll(".color-circle")
      .forEach((c2) => c2.classList.remove("selected"));
    c.classList.add("selected");
    selectedColor = c.dataset.color;
  });
});

/*memo*/
function loadMemos() {
  const memos = JSON.parse(localStorage.getItem("memos")) || [];
  memos.forEach(addMemoToCanvas);
}

/*local storage*/
function saveToLocalStorage(memo) {
  const memos = JSON.parse(localStorage.getItem("memos")) || [];
  memos.push(memo);
  localStorage.setItem("memos", JSON.stringify(memos));
}

/*add memo*/
saveMemoBtn.onclick = () => {
  const text = memoText.value.trim();
  if (!text) return;

  const memo = {
    id: Date.now(),
    text,
    x: Math.random() * 500 + 50,
    y: Math.random() * 300 + 50,
    color: selectedColor,
  };

  addMemoToCanvas(memo);
  saveToLocalStorage(memo);

  memoText.value = "";
  selectedColor = "purple";
  modal.classList.remove("show");
};

/*render*/
function addMemoToCanvas(memo) {
  const div = document.createElement("div");
  div.className = `memo ${memo.color}`;
  div.dataset.id = memo.id;
  div.style.left = memo.x + "px";
  div.style.top = memo.y + "px";

  div.innerHTML = `
       <p>${memo.text.replace(/\n/g, "<br>")}</p>
       <small>${new Date().toLocaleDateString()}</small>
       <button class="delete-btn"><i class="ri-delete-bin-7-line"></i></button>
   `;

  /*delete*/
  div.querySelector(".delete-btn").onclick = () => deleteMemo(memo.id, div);

  canvas.appendChild(div);
  makeDraggable(div);
}

/*delete modal*/
function deleteMemo(id, element) {
  let memos = JSON.parse(localStorage.getItem("memos")) || [];
  memos = memos.filter((m) => m.id !== id);
  localStorage.setItem("memos", JSON.stringify(memos));
  element.remove();
}

/*pindah*/
let selected = null,
  offsetX = 0,
  offsetY = 0;

function makeDraggable(el) {
  el.addEventListener("mousedown", (e) => {
    selected = el;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  });
}

function drag(e) {
  if (!selected) return;

  const canvasRect = canvas.getBoundingClientRect();
  const memoRect = selected.getBoundingClientRect();

  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;

  //batas kiri
  if (newX < 0) newX = 0;

  //batas kanan
  if (newX + memoRect.width > canvasRect.width) {
    newX = canvasRect.width - memoRect.width;
  }

  //batas atas
  if (newY < 0) newY = 0;

  //batas bawah
  if (newY + memoRect.height > canvasRect.height) {
    newY = canvasRect.height - memoRect.height;
  }

  selected.style.left = newX + "px";
  selected.style.top = newY + "px";
}

function stopDrag() {
  selected = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

loadMemos();
