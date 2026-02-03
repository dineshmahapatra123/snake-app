import { createInitialState, DIRECTIONS, GRID_SIZE, step } from "./logic.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const cellSize = canvas.width / GRID_SIZE;
const TICK_MS = 140;

let state = createInitialState();
let pendingDir = state.pendingDir;
let paused = false;
let lastTick = 0;

function drawCell(point, color) {
  ctx.fillStyle = color;
  ctx.fillRect(point.x * cellSize, point.y * cellSize, cellSize, cellSize);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.snake.forEach((segment, idx) => {
    drawCell(segment, idx === 0 ? "#b5ff85" : "#49d17a");
  });

  if (state.food) {
    drawCell(state.food, "#f56f6f");
  }

  scoreEl.textContent = state.score.toString();

  if (state.gameOver) {
    overlay.textContent = "Game Over — Press R to restart";
    overlay.classList.add("show");
  } else if (paused) {
    overlay.textContent = "Paused";
    overlay.classList.add("show");
  } else {
    overlay.textContent = "";
    overlay.classList.remove("show");
  }
}

function gameLoop(timestamp) {
  if (!paused && !state.gameOver && timestamp - lastTick >= TICK_MS) {
    state = step(state, pendingDir);
    lastTick = timestamp;
  }

  render();
  requestAnimationFrame(gameLoop);
}

function setDirection(dir) {
  if (!dir) return;
  pendingDir = dir;
}

function handleKey(event) {
  switch (event.key.toLowerCase()) {
    case "arrowup":
    case "w":
      event.preventDefault();
      setDirection(DIRECTIONS.up);
      break;
    case "arrowdown":
    case "s":
      event.preventDefault();
      setDirection(DIRECTIONS.down);
      break;
    case "arrowleft":
    case "a":
      event.preventDefault();
      setDirection(DIRECTIONS.left);
      break;
    case "arrowright":
    case "d":
      event.preventDefault();
      setDirection(DIRECTIONS.right);
      break;
    case " ":
      event.preventDefault();
      togglePause();
      break;
    case "r":
      event.preventDefault();
      restart();
      break;
    default:
      break;
  }
}

function togglePause() {
  if (state.gameOver) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

function restart() {
  state = createInitialState();
  pendingDir = state.pendingDir;
  paused = false;
  pauseBtn.textContent = "Pause";
}

document.addEventListener("keydown", handleKey);

pauseBtn.addEventListener("click", () => togglePause());
restartBtn.addEventListener("click", () => restart());

render();
requestAnimationFrame(gameLoop);
