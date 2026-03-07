import {
  createInitialState,
  spawnFood,
  isOpposite,
  step,
  DIRECTIONS,
  GRID_SIZE,
} from "./logic.js";

// simple deterministic RNG for tests
function fixedRng(values) {
  let idx = 0;
  return () => {
    const v = values[idx % values.length];
    idx += 1;
    return v;
  };
}

describe("game logic", () => {
  test("initial state has snake length 3 and food not on snake", () => {
    const state = createInitialState(fixedRng([0.1]));
    expect(state.snake).toHaveLength(3);
    expect(state.score).toBe(0);
    expect(state.food).not.toBeNull();
    const occ = new Set(state.snake.map((p) => `${p.x},${p.y}`));
    expect(occ.has(`${state.food.x},${state.food.y}`)).toBe(false);
  });

  test("spawnFood avoids occupied cells and returns null when full", () => {
    const snake = [];
    for (let y = 0; y < GRID_SIZE; ++y) {
      for (let x = 0; x < GRID_SIZE; ++x) {
        snake.push({ x, y });
      }
    }
    expect(spawnFood(snake)).toBeNull();
  });

  test("isOpposite correctly detects direction pairs", () => {
    expect(isOpposite(DIRECTIONS.up, DIRECTIONS.down)).toBe(true);
    expect(isOpposite(DIRECTIONS.left, DIRECTIONS.right)).toBe(true);
    expect(isOpposite(DIRECTIONS.up, DIRECTIONS.left)).toBe(false);
  });

  test("step moves snake and eats food", () => {
    const rng = fixedRng([0.0]);
    const state = {
      snake: [{ x: 0, y: 0 }],
      dir: { ...DIRECTIONS.right },
      pendingDir: { ...DIRECTIONS.right },
      food: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
    };
    const next = step(state, DIRECTIONS.right, rng);
    expect(next.snake[0]).toEqual({ x: 1, y: 0 });
    expect(next.score).toBe(1);
    expect(next.food).not.toEqual(state.food);
  });

  test("step returns gameOver when hitting wall or self", () => {
    const state1 = createInitialState();
    // force the head near wall and direction towards wall
    const s2 = { ...state1, snake: [{ x: 0, y: 0 }], dir: DIRECTIONS.left };
    const out1 = step(s2, DIRECTIONS.left);
    expect(out1.gameOver).toBe(true);

    // self collision
    const s3 = {
      ...state1,
      snake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
      dir: DIRECTIONS.left,
    };
    const out2 = step(s3, DIRECTIONS.right);
    expect(out2.gameOver).toBe(true);
  });
});
