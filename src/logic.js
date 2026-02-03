export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createInitialState(rng = Math.random) {
  const start = { x: 10, y: 10 };
  const snake = [
    { ...start },
    { x: start.x - 1, y: start.y },
    { x: start.x - 2, y: start.y },
  ];

  const food = spawnFood(snake, rng);

  return {
    snake,
    dir: { ...DIRECTIONS.right },
    pendingDir: { ...DIRECTIONS.right },
    food,
    score: 0,
    gameOver: false,
  };
}

export function spawnFood(snake, rng = Math.random) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const open = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) open.push({ x, y });
    }
  }
  if (open.length === 0) return null;
  const idx = Math.floor(rng() * open.length);
  return open[idx];
}

export function isOpposite(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

export function step(state, inputDir, rng = Math.random) {
  if (state.gameOver) return state;

  const nextDir = inputDir && !isOpposite(inputDir, state.dir) ? inputDir : state.dir;
  const head = state.snake[0];
  const nextHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

  const ateFood = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const tailIndex = ateFood ? state.snake.length : state.snake.length - 1;

  const hitWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= GRID_SIZE ||
    nextHead.y >= GRID_SIZE;

  const hitSelf = state.snake.some(
    (segment, idx) => idx < tailIndex && segment.x === nextHead.x && segment.y === nextHead.y
  );

  if (hitWall || hitSelf) {
    return { ...state, dir: nextDir, pendingDir: nextDir, gameOver: true };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) nextSnake.pop();

  const nextFood = ateFood ? spawnFood(nextSnake, rng) : state.food;

  return {
    ...state,
    snake: nextSnake,
    dir: nextDir,
    pendingDir: nextDir,
    food: nextFood,
    score: ateFood ? state.score + 1 : state.score,
  };
}
