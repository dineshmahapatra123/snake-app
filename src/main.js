import { createInitialState, DIRECTIONS, GRID_SIZE, step } from "./logic.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const overlay = document.getElementById("overlay");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const HIGH_SCORE_KEY = "snakeHighScore";

const cellSize = canvas.width / GRID_SIZE;
const TICK_MS = 140;

let state = createInitialState();
let pendingDir = state.pendingDir;
let paused = false;
let lastTick = 0;

let highScore = 0;
// load persisted high score
try {
  const stored = parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10);
  if (!Number.isNaN(stored)) highScore = stored;
} catch (e) {
  // ignore storage errors (e.g. privacy mode)
}
updateHighScoreDisplay();

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
  if (state.score > highScore) {
    highScore = state.score;
    persistHighScore();
  }
  updateHighScoreDisplay();

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

function updateHighScoreDisplay() {
  if (highScoreEl) highScoreEl.textContent = highScore.toString();
}

function persistHighScore() {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
  } catch (e) {
    // ignore
  }
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

// touch/swipe support for mobile devices
let touchStart = null;
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }
});

canvas.addEventListener("touchend", (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  // only treat as swipe if moved a bit
  const threshold = 30;
  if (absX < threshold && absY < threshold) {
    touchStart = null;
    return;
  }
  if (absX > absY) {
    setDirection(dx > 0 ? DIRECTIONS.right : DIRECTIONS.left);
  } else {
    setDirection(dy > 0 ? DIRECTIONS.down : DIRECTIONS.up);
  }
  touchStart = null;
});

pauseBtn.addEventListener("click", () => togglePause());
restartBtn.addEventListener("click", () => restart());

render();
requestAnimationFrame(gameLoop);
