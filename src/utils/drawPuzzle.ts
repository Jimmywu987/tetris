import { Puzzle } from "types";
import { Puzzles } from "utils/puzzles";

export const drawPuzzle = (): Puzzle =>
  Puzzles[Math.floor(Math.random() * Puzzles.length)];
