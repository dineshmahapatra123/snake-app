import assert from "assert";
import {
  createInitialState,
  spawnFood,
  isOpposite,
  step,
  DIRECTIONS,
  GRID_SIZE,
} from "./src/logic.js";

function fixedRng(values) {
  let idx = 0;
  return () => {
    const v = values[idx % values.length];
    idx += 1;
    return v;
  };
}

function run() {
  console.log("running logic tests...");

  // initial state
  const state = createInitialState(fixedRng([0.1]));
  assert.strictEqual(state.snake.length, 3);
  assert.strictEqual(state.score, 0);
  assert.ok(state.food);
  const occ = new Set(state.snake.map((p) => `${p.x},${p.y}`));
  assert.ok(!occ.has(`${state.food.x},${state.food.y}`));

  // spawnFood full
  const snakeFull = [];
  for (let y = 0; y < GRID_SIZE; ++y) {
    for (let x = 0; x < GRID_SIZE; ++x) {
      snakeFull.push({ x, y });
    }
  }
  assert.strictEqual(spawnFood(snakeFull), null);

  // isOpposite
  assert.strictEqual(isOpposite(DIRECTIONS.up, DIRECTIONS.down), true);
  assert.strictEqual(isOpposite(DIRECTIONS.left, DIRECTIONS.right), true);
  assert.strictEqual(isOpposite(DIRECTIONS.up, DIRECTIONS.left), false);

  // step movement
  const simple = {
    snake: [{ x: 0, y: 0 }],
    dir: { ...DIRECTIONS.right },
    pendingDir: { ...DIRECTIONS.right },
    food: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
  };
  const n1 = step(simple, DIRECTIONS.right, fixedRng([0]));
  assert.deepStrictEqual(n1.snake[0], { x: 1, y: 0 });
  assert.strictEqual(n1.score, 1);
  assert.notDeepStrictEqual(n1.food, simple.food);

  // wall collision
  const wstate = { ...state, snake: [{ x: 0, y: 0 }], dir: DIRECTIONS.left };
  const wout = step(wstate, DIRECTIONS.left);
  assert.strictEqual(wout.gameOver, true);

  // self collision
  const sstate = {
    ...state,
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    dir: DIRECTIONS.left,
  };
  const sout = step(sstate, DIRECTIONS.right);
  assert.strictEqual(sout.gameOver, true);

  console.log("all tests passed");
}

run();
