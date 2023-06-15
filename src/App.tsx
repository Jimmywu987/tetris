import { ControlButton } from "components/ControlButton";
import { InstructionManual } from "components/InstructionManual";
import { NextPuzzleDisplay } from "components/NextPuzzleDisplay";
import { EMPTY_BOARD } from "constants/emptyBoard";
import { GRID_COLORS } from "constants/gridColors";
import { GameStatus } from "enums/gameStatus";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Puzzle, Grid } from "types";
import { checkHorizontalLineIsFilled } from "utils/checkHorizontalLineIsFilled";
import { checkIsAtEdge } from "utils/checkIfAtEdge";
import { cn } from "utils/cn";
import { drawPuzzle } from "utils/drawPuzzle";
import { getNewPuzzlePosition } from "utils/getNewPuzzlePosition";

import { turnPuzzle } from "utils/turnPuzzle";

const App = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tetrisBoard, setTetrisBoard] = useState<Grid[]>(EMPTY_BOARD);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({
    shape: [],
    puzzleNum: 0,
  });
  const [storePuzzle, setStorePuzzle] = useState<Puzzle[]>([]);

  const [toClearInterval, setToClearInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [touchedGround, setTouchGround] = useState<boolean>(false);

  const [status, setStatus] = useState<string>(GameStatus.BEFORE_START);

  const [score, setScore] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const cleanUpBeforeNewPaint = () => {
    setTetrisBoard((board: Grid[]) =>
      board.map((each) =>
        !each.isFixed ? { puzzleNum: 0, isFixed: false } : each
      )
    );
  };

  useEffect(() => {
    if (status === GameStatus.STARTED && touchedGround) {
      const needEmptyingGridPosition: number[] = [];
      let score = 0;
      for (let i = 0; i < tetrisBoard.length; i += 10) {
        // check which line is all filled horizontally
        if (checkHorizontalLineIsFilled(tetrisBoard.slice(i, i + 10))) {
          needEmptyingGridPosition.push(i);
          score += 10;
          for (let x = 1; x < 10; x++) {
            needEmptyingGridPosition.push(i + x);
          }
        }
      }

      if (needEmptyingGridPosition.length !== 0) {
        // the filled line is removed
        const remainedBoard = tetrisBoard.filter(
          (_, index) => !needEmptyingGridPosition.includes(index)
        );
        const boardGridLeft = remainedBoard.length;

        // add new line on top
        remainedBoard.unshift(
          ...new Array(200 - boardGridLeft).fill({
            puzzleNum: 0,
            isFixed: false,
          })
        );

        // add score
        setScore((prevScore) => (prevScore += score));

        // update board to fix the puzzle at their positions
        setTetrisBoard(
          remainedBoard.map((each: Grid) =>
            each.puzzleNum !== 0
              ? {
                  puzzleNum: each.puzzleNum,
                  isFixed: true,
                }
              : each
          )
        );
      } else {
        // update board to fix the puzzle at their positions
        setTetrisBoard((board: Grid[]) =>
          board.map((each: Grid) =>
            each.puzzleNum !== 0
              ? {
                  puzzleNum: each.puzzleNum,
                  isFixed: true,
                }
              : each
          )
        );
      }
      setCurrentPuzzle({ shape: [], puzzleNum: 0 });
      setTouchGround(false);
    }
  }, [touchedGround]);

  useEffect(() => {
    if (status === GameStatus.STARTED) {
      setTetrisBoard((board: Grid[]) =>
        board.map((each, index: number) =>
          currentPuzzle.shape.includes(index)
            ? { puzzleNum: currentPuzzle.puzzleNum, isFixed: false }
            : !each.isFixed
            ? { puzzleNum: 0, isFixed: false }
            : each
        )
      );
    }
  }, [currentPuzzle]);

  const puzzleDownward = (puzzle: Puzzle) => {
    if (status === GameStatus.STARTED) {
      const newPosition = puzzle.shape.map((position) => position + 10);

      // check if the puzzle is at the bottom
      if (
        getNewPuzzlePosition(newPosition).some((position) => position > 199)
      ) {
        setTouchGround(true);
        return;
      }
      if (
        tetrisBoard
          .filter((_, index) =>
            getNewPuzzlePosition(newPosition).includes(index)
          )
          .some((grid: Grid) => grid.isFixed)
      ) {
        if (newPosition.some((e) => 20 <= e && e <= 29)) {
          setStatus(GameStatus.LOST);
        } else {
          setTouchGround(true);
        }
        return;
      }
      cleanUpBeforeNewPaint();
      setTouchGround(false);
      setCurrentPuzzle((original: Puzzle) => {
        const { puzzleNum } = original;
        return {
          puzzleNum,
          shape: newPosition,
        };
      });
    }
  };
  const pushPuzzleToBottom = (puzzle: Puzzle) => {
    if (status === GameStatus.STARTED) {
      for (let i = 10; i <= 200; i += 10) {
        const newPosition = puzzle.shape.map((position) => position + i);
        if (
          getNewPuzzlePosition(newPosition).some((e) => e > 199) ||
          tetrisBoard
            .filter((_, index) =>
              getNewPuzzlePosition(newPosition).includes(index)
            )
            .some((grid: Grid) => grid.isFixed)
        ) {
          cleanUpBeforeNewPaint();
          setCurrentPuzzle((original: Puzzle) => {
            return {
              ...original,
              shape: newPosition.map((e) => e - 10),
            };
          });
          setStep((prevStep) => prevStep + 1);
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (status === GameStatus.STARTED) {
      if (currentPuzzle.puzzleNum === 0) {
        setCurrentPuzzle(
          storePuzzle.length === 0 ? drawPuzzle() : storePuzzle[0]
        );
        setStorePuzzle((prePuzzle) => {
          prePuzzle.shift();
          prePuzzle.push(drawPuzzle());
          return [...prePuzzle];
        });
        return;
      }
      puzzleDownward(currentPuzzle);
    }
  }, [step]);

  const startGame = (gameRestart = false) => {
    if (status !== GameStatus.STARTED || gameRestart) {
      setStatus(GameStatus.STARTED);
      const time = setInterval(() => {
        if (status !== GameStatus.PAUSED) {
          setStep((preStep) => preStep + 1);
        }
      }, 1000);
      setToClearInterval(time);
    }
  };
  const pauseGame = () => {
    setStatus(GameStatus.PAUSED);
  };
  const resetGame = () => {
    setTetrisBoard(EMPTY_BOARD);
    if (toClearInterval) {
      clearInterval(toClearInterval);
    }
    setStatus(GameStatus.BEFORE_START);
    setStep(0);
    setScore(0);
    setStorePuzzle([]);
    setCurrentPuzzle({ shape: [], puzzleNum: 0 });
  };

  const checkIfGridIsOccupiedWhenTurn = (puzzle: number[]): boolean =>
    tetrisBoard
      .filter((_, index) => puzzle.includes(index))
      .map((e) => e.isFixed)
      .every((puzzle: boolean) => !puzzle);

  const moveHorizontally = (move: number, puzzle: Puzzle) => {
    if (status === GameStatus.STARTED) {
      const newFill = puzzle.shape.map((position) => position + move);
      const isStraightLine = puzzle.puzzleNum === 1;

      // if the puzzle is straight line, check if it is at the edge
      if (isStraightLine) {
        const linePositions = puzzle.shape.map((e) => e % 10);
        if (
          linePositions.every((e) => e === linePositions[0]) &&
          (linePositions[0] + move === 10 || linePositions[0] + move === -1)
        ) {
          return;
        }
      }
      if (
        !tetrisBoard
          .filter((_, index) => newFill.includes(index))
          .map((position) => position.isFixed)
          .every((allIsFixed) => !allIsFixed)
      ) {
        return;
      }
      if (checkIsAtEdge(newFill)) {
        cleanUpBeforeNewPaint();
        setCurrentPuzzle((original: Puzzle) => {
          return {
            ...original,
            shape: newFill,
          };
        });
      }
    }
  };
  const turnPuzzleClockwise = () => {
    if (status === GameStatus.STARTED) {
      const updatePuzzle = turnPuzzle(currentPuzzle);
      if (
        checkIsAtEdge(updatePuzzle) &&
        checkIfGridIsOccupiedWhenTurn(updatePuzzle)
      ) {
        cleanUpBeforeNewPaint();
        setCurrentPuzzle((previousPuzzle) => {
          return { ...previousPuzzle, shape: updatePuzzle };
        });
      }
    }
  };
  const boardKeyDownControl = (element: KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowUp", "8", "w"].includes(element.key)) {
      turnPuzzleClockwise();
      return;
    }
    if (["ArrowRight", "6", "d"].includes(element.key)) {
      moveHorizontally(1, currentPuzzle);
      return;
    }
    if (["ArrowLeft", "4", "a"].includes(element.key)) {
      moveHorizontally(-1, currentPuzzle);
      return;
    }
    if (["ArrowDown", "2", "s"].includes(element.key)) {
      puzzleDownward(currentPuzzle);
      return;
    }
    if (["0", "x", "5"].includes(element.key)) {
      pushPuzzleToBottom(currentPuzzle);
    }
  };
  return (
    <div
      className="flex flex-col md:flex-row justify-center md:space-x-4 my-4"
      onKeyDown={(keyEvent) => boardKeyDownControl(keyEvent)}
      onClick={() => {
        if (ref.current) {
          ref.current.focus();
        }
      }}
    >
      <div className="flex justify-around">
        <div className="flex flex-col space-y-2 md:mr-3">
          <button
            className={`border px-4 py-1 rounded ${
              status === GameStatus.STARTED && "bg-gray-500 text-white"
            }`}
            ref={ref}
            onClick={() => startGame()}
          >
            Start
          </button>
          <button
            className={`border px-4 py-1 rounded ${
              status === GameStatus.PAUSED && "bg-gray-500 text-white"
            }`}
            onClick={() => pauseGame()}
          >
            Pause
          </button>
          <button
            className="border px-4 py-1 rounded"
            onClick={() => resetGame()}
          >
            Reset
          </button>
          <p className="border px-3 py-1 flex justify-center">{score}</p>
          {status === GameStatus.LOST && (
            <p className="text-2xl text-center font-bold text-red-700">Lost</p>
          )}
          <NextPuzzleDisplay
            storePuzzle={storePuzzle}
            className="grid grid-cols-6 md:hidden"
          />
        </div>
        <div className="grid grid-cols-10 gap-0">
          {tetrisBoard.map((grid, index) => (
            <div
              key={index}
              className={cn(
                "border border-gray-300 w-6 h-6 md:w-9 md:h-9",
                GRID_COLORS[grid.puzzleNum],
                // here set the starting line
                10 <= index && index <= 19 && "border-b-2 border-b-gray-800"
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-col items-start mx-2">
        <NextPuzzleDisplay
          storePuzzle={storePuzzle}
          className="md:grid grid-cols-6 hidden"
        />
        <InstructionManual />
        <div className="flex flex-col items-center w-full space-y-4 my-6 border py-4">
          <ControlButton onClick={() => turnPuzzleClockwise()} controlKey="w" />
          <div className="space-x-4">
            <ControlButton
              onClick={() => moveHorizontally(-1, currentPuzzle)}
              controlKey="a"
            />
            <ControlButton
              onClick={() => puzzleDownward(currentPuzzle)}
              controlKey="s"
            />
            <ControlButton
              onClick={() => moveHorizontally(1, currentPuzzle)}
              controlKey="d"
            />
          </div>
          <ControlButton
            onClick={() => pushPuzzleToBottom(currentPuzzle)}
            controlKey="x"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
