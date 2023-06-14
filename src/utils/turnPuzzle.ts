import { Puzzle } from "types";

export const turnPuzzle = (puzzle: Puzzle) => {
  const { shape, puzzleNum } = puzzle;

  switch (puzzleNum) {
    case 1: {
      if (shape[0] + 1 === shape[1]) {
        return [shape[2] - 20, shape[2] - 10, shape[2], shape[2] + 10];
      } else if (shape[0] + 10 === shape[1]) {
        return [shape[2] + 1, shape[2], shape[2] - 1, shape[2] - 2];
      } else if (shape[0] - 1 === shape[1]) {
        return [shape[2] + 20, shape[2] + 10, shape[2], shape[2] - 10];
      } else {
        return [shape[2] - 1, shape[2], shape[2] + 1, shape[2] + 2];
      }
    }
    case 2: {
      if (shape[0] + 10 === shape[1]) {
        return [shape[2] - 9, shape[2] - 10, shape[2], shape[2] + 10];
      } else if (shape[0] - 1 === shape[1]) {
        return [shape[2] + 11, shape[2] + 1, shape[2], shape[2] - 1];
      } else if (shape[0] - 10 === shape[1]) {
        return [shape[2] + 9, shape[2] + 10, shape[2], shape[2] - 10];
      } else {
        return [shape[2] - 11, shape[2] - 1, shape[2], shape[2] + 1];
      }
    }
    case 3: {
      if (shape[0] + 10 === shape[3]) {
        return [shape[2] + 11, shape[2] - 10, shape[2], shape[2] + 10];
      } else if (shape[0] - 1 === shape[3]) {
        return [shape[2] + 9, shape[2] + 1, shape[2], shape[2] - 1];
      } else if (shape[0] - 10 === shape[3]) {
        return [shape[2] - 11, shape[2] - 10, shape[2], shape[2] + 10];
      } else {
        return [shape[2] - 9, shape[2] - 1, shape[2], shape[2] + 1];
      }
    }
    case 4: {
      return shape;
    }
    case 5: {
      if (shape[0] + 1 === shape[1]) {
        return [shape[3], shape[3] + 10, shape[3] - 11, shape[3] - 1];
      } else {
        return [shape[0] - 10, shape[0] - 9, shape[0] - 1, shape[0]];
      }
    }
    case 6: {
      if (shape[0] + 1 === shape[1]) {
        return [shape[2] - 10, shape[2], shape[2] - 1, shape[2] + 9];
      } else {
        return [shape[1] - 11, shape[1] - 10, shape[1], shape[1] + 1];
      }
    }
    case 7: {
      if (shape[0] + 10 === shape[2]) {
        return [shape[2] + 1, shape[2] - 10, shape[2], shape[2] + 10];
      } else if (shape[0] - 1 === shape[2]) {
        return [shape[2] + 10, shape[2] + 1, shape[2], shape[2] - 1];
      } else if (shape[0] - 10 === shape[2]) {
        return [shape[2] - 1, shape[2] + 10, shape[2], shape[2] - 10];
      } else {
        return [shape[2] - 10, shape[2] - 1, shape[2], shape[2] + 1];
      }
    }
    default: {
      return [];
    }
  }
};
