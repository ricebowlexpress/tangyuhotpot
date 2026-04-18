import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeVM-PCRuWtricowl9kWby83bAfn_-sSQ",
  authDomain: "scratch-and-win-c8f9c.firebaseapp.com",
  projectId: "scratch-and-win-c8f9c",
  storageBucket: "scratch-and-win-c8f9c.firebasestorage.app",
  messagingSenderId: "965544281170",
  appId: "1:965544281170:web:892df1d63ce781d3decb8b",
  measurementId: "G-DDK2HWVLLR"
};

const app = initializeApp(firebaseConfig);

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeVM-PCRuWtricowl9kWby83bAfn_-sSQ",
  authDomain: "scratch-and-win-c8f9c.firebaseapp.com",
  projectId: "scratch-and-win-c8f9c",
  storageBucket: "scratch-and-win-c8f9c.firebasestorage.app",
  messagingSenderId: "965544281170",
  appId: "1:965544281170:web:892df1d63ce781d3decb8b",
  measurementId: "G-DDK2HWVLLR"
};

const prizeText = document.getElementById("prizeText");
const statusText = document.getElementById("statusText");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let gameStarted = false;

const demoPrizes = [
  { name: "No Prize", weight: 70 },
  { name: "RM5", weight: 20 },
  { name: "RM20", weight: 8 },
  { name: "RM100", weight: 2 }
];

function weightedPick(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function drawCover() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scratch Here", canvas.width / 2, canvas.height / 2);
}

function clearScratchArea(x, y) {
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
}

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function startGame() {
  const result = weightedPick(demoPrizes);
  prizeText.textContent = result.name;
  statusText.textContent = "Scratch the card to reveal your result.";
  gameStarted = true;
  drawCover();
}

function resetGame() {
  prizeText.textContent = "Tap Start to Play";
  statusText.textContent = "Waiting to start...";
  gameStarted = false;
  drawCover();
}

canvas.addEventListener("mousedown", (event) => {
  if (!gameStarted) return;
  isDrawing = true;
  const pos = getPosition(event);
  clearScratchArea(pos.x, pos.y);
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing || !gameStarted) return;
  const pos = getPosition(event);
  clearScratchArea(pos.x, pos.y);
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

canvas.addEventListener("touchstart", (event) => {
  if (!gameStarted) return;
  isDrawing = true;
  const pos = getPosition(event);
  clearScratchArea(pos.x, pos.y);
});

canvas.addEventListener("touchmove", (event) => {
  if (!isDrawing || !gameStarted) return;
  event.preventDefault();
  const pos = getPosition(event);
  clearScratchArea(pos.x, pos.y);
}, { passive: false });

canvas.addEventListener("touchend", () => {
  isDrawing = false;
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

drawCover();
