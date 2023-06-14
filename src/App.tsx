import { ControlButton } from "components/ControlButton";
import { InstructionManual } from "components/InstructionManual";
import { NextPuzzleDisplay } from "components/NextPuzzleDisplay";
import { EMPTY_BOARD } from "constants/emptyBoard";
import { GRID_COLORS } from "constants/gridColors";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Puzzle, Grid } from "types";
import { cn } from "utils/cn";
import { drawPuzzle } from "utils/drawPuzzle";

import { turnPuzzle } from "utils/turnPuzzle";

const App = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tetrisBoard, setTetrisBoard] = useState<Grid[]>(EMPTY_BOARD);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({
    shape: [],
    puzzleNum: 0,
  });
  const [storePuzzle, setStorePuzzle] = useState<Puzzle[]>([]);
  const [score, setScore] = useState<number>(0);
  const [toClearInterval, setToClearInterval] = useState<NodeJS.Timer | null>(
    null
  );
  const [touchedGround, setTouchGround] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const checkIfPuzzleIsFlat = (puzzle: number[]): number[] => {
    const largestNumberSet: number[] = [];

    const remainCheck = puzzle.map((position) => position + 10);
    for (let i = 0; i < remainCheck.length; i++) {
      if (!puzzle.includes(remainCheck[i])) {
        largestNumberSet.push(puzzle[i]);
      }
    }
    return largestNumberSet;
  };
  const boardChecking = (arr: Grid[]): boolean => {
    return arr.every((e) => e.puzzleNum !== 0);
  };
  const cleaningBeforeNewPaint = () => {
    setTetrisBoard((board: Grid[]) => {
      return board.map((each) => {
        if (!each.isFixed) {
          return { puzzleNum: 0, isFixed: false };
        }
        return each;
      });
    });
  };
  useEffect(() => {
    if (gameStarted && touchedGround) {
      if (step !== 0) {
        const needRemoveIndex: number[] = [];
        let score = 0;
        for (let i = 0; i < tetrisBoard.length; i += 10) {
          if (boardChecking(tetrisBoard.slice(i, i + 10))) {
            needRemoveIndex.push(i);
            score += 10;
            for (let x = 1; x < 10; x++) {
              needRemoveIndex.push(i + x);
            }
          }
        }

        if (needRemoveIndex.length !== 0) {
          const remainedBoard = tetrisBoard.filter(
            (_, index) => !needRemoveIndex.includes(index)
          );
          const boardGridLeft = remainedBoard.length;

          remainedBoard.unshift(
            ...new Array(200 - boardGridLeft).fill({
              puzzleNum: 0,
              isFixed: false,
            })
          );
          setScore((e) => (e += score));
          setTetrisBoard(
            remainedBoard.map((each: Grid) => {
              if (each.puzzleNum !== 0) {
                return {
                  puzzleNum: each.puzzleNum,
                  isFixed: true,
                };
              }
              return each;
            })
          );
        } else {
          setTetrisBoard((board: Grid[]) => {
            return board.map((each: Grid) => {
              if (each.puzzleNum !== 0) {
                return {
                  puzzleNum: each.puzzleNum,
                  isFixed: true,
                };
              }
              return each;
            });
          });
        }
        setCurrentPuzzle({ shape: [], puzzleNum: 0 });
        setTouchGround(false);
      }
    }
  }, [touchedGround]);

  useEffect(() => {
    if (gameStarted) {
      if (step !== 0) {
        setTetrisBoard((board: Grid[]) => {
          return board.map((each, index: number) => {
            if (currentPuzzle.shape.includes(index)) {
              return { puzzleNum: currentPuzzle.puzzleNum, isFixed: false };
            } else if (!each.isFixed) {
              return { puzzleNum: 0, isFixed: false };
            }
            return each;
          });
        });
      }
    }
  }, [currentPuzzle]);

  const puzzleDownward = () => {
    if (gameStarted && !pause && !lost) {
      let canProcess = true;
      const newPosition = currentPuzzle.shape.map((e) => e + 10);
      if (checkIfPuzzleIsFlat(newPosition).some((e) => e > 199)) {
        setTouchGround(true);
        canProcess = false;
      }
      if (
        tetrisBoard
          .filter((_, index) =>
            checkIfPuzzleIsFlat(newPosition).includes(index)
          )
          .some((grid: Grid) => grid.isFixed)
      ) {
        if (newPosition.some((e) => 20 <= e && e <= 29)) {
          setLost(true);
        } else {
          setTouchGround(true);
        }
        canProcess = false;
      }
      if (canProcess) {
        cleaningBeforeNewPaint();
        setCurrentPuzzle((original: Puzzle) => {
          return {
            ...original,
            shape: newPosition,
          };
        });
      }
    }
  };
  const pushPuzzleToBottom = () => {
    if (gameStarted && !pause && !lost) {
      for (let i = 10; i <= 200; i += 10) {
        const newPosition = currentPuzzle.shape.map((e) => e + i);
        if (
          checkIfPuzzleIsFlat(newPosition).some((e) => e > 199) ||
          tetrisBoard
            .filter((_, index) =>
              checkIfPuzzleIsFlat(newPosition).includes(index)
            )
            .some((grid: Grid) => grid.isFixed)
        ) {
          cleaningBeforeNewPaint();
          setCurrentPuzzle((original: Puzzle) => {
            return {
              ...original,
              shape: newPosition.map((e) => e - 10),
            };
          });
          setStep((e) => e + 1);
          break;
        }
      }
    }
  };
  useEffect(() => {
    if (step > 0 && !pause && !lost) {
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
      puzzleDownward();
    }
  }, [step]);

  const startGame = (gameRestart = false) => {
    if (!gameStarted || gameRestart) {
      setGameStarted(true);
      const time = setInterval(() => {
        if (!pause) {
          setStep((preStep) => preStep + 1);
        }
      }, 1000);
      setToClearInterval(time);
    }
  };
  const pauseGame = () => {
    setPause((isPause) => !isPause);
  };
  const restartGame = () => {
    setTetrisBoard(EMPTY_BOARD);
    if (toClearInterval) {
      clearInterval(toClearInterval);
    }
    setPause(false);
    setStep(0);
    setLost(false);
    setScore(0);
    setStorePuzzle([]);
    setCurrentPuzzle({ shape: [], puzzleNum: 0 });
    startGame(true);
  };
  const checkIfOutOfGrid = (arr: number[]): boolean => {
    const modulized = arr.map((e) => e % 10);
    const largestNum = Math.max(...modulized);
    const smallestNum = Math.min(...modulized);
    return 4 > largestNum - smallestNum && smallestNum - 1 >= -1;
  };
  const checkIfGridIsOccupiedWhenTurn = (arr: number[]): boolean => {
    return tetrisBoard
      .filter((_, index) => arr.includes(index))
      .map((e) => e.isFixed)
      .every((e: boolean) => !e);
  };
  const moveHorizontally = (move: number) => {
    if (gameStarted && !pause && !lost) {
      const newFill = currentPuzzle.shape.map((e) => e + move);
      const isStraightLine = currentPuzzle.puzzleNum === 1;
      let canProcess = true;
      if (isStraightLine) {
        const linePositions = currentPuzzle.shape.map((e) => e % 10);
        if (
          linePositions.every((e) => e === linePositions[0]) &&
          linePositions[0] + move === 10
        ) {
          canProcess = false;
        }
      }
      if (
        !tetrisBoard
          .filter((_, index) => newFill.includes(index))
          .map((e) => e.isFixed)
          .every((e) => !e)
      ) {
        canProcess = false;
      }
      if (checkIfOutOfGrid(newFill) && canProcess) {
        cleaningBeforeNewPaint();
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
    if (gameStarted && !pause && !lost) {
      const updatePuzzle = turnPuzzle(currentPuzzle);
      if (
        checkIfOutOfGrid(updatePuzzle) &&
        checkIfGridIsOccupiedWhenTurn(updatePuzzle)
      ) {
        cleaningBeforeNewPaint();
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
      moveHorizontally(1);
      return;
    }
    if (["ArrowLeft", "4", "a"].includes(element.key)) {
      moveHorizontally(-1);
      return;
    }
    if (["ArrowDown", "2", "s"].includes(element.key)) {
      puzzleDownward();
      return;
    }
    if (["0", "x", "5"].includes(element.key)) {
      pushPuzzleToBottom();
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
              gameStarted && "bg-gray-500 text-white"
            }`}
            ref={ref}
            onClick={() => startGame()}
          >
            Start
          </button>
          <button
            className={`border px-4 py-1 rounded ${
              pause && "bg-gray-500 text-white"
            }`}
            onClick={() => pauseGame()}
          >
            Pause
          </button>
          <button
            className="border px-4 py-1 rounded"
            onClick={() => restartGame()}
          >
            Restart
          </button>
          <p className="border px-3 py-1 flex justify-center">{score}</p>
          {lost && (
            <p className="text-2xl text-center font-bold text-red-700">Lost</p>
          )}
          <NextPuzzleDisplay
            storePuzzle={storePuzzle}
            className="grid grid-cols-6 md:hidden"
          />
        </div>
        <div className="flex justify-center">
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
              onClick={() => moveHorizontally(-1)}
              controlKey="a"
            />
            <ControlButton onClick={() => puzzleDownward()} controlKey="s" />
            <ControlButton onClick={() => moveHorizontally(1)} controlKey="d" />
          </div>
          <ControlButton onClick={() => pushPuzzleToBottom()} controlKey="x" />
        </div>
      </div>
    </div>
  );
};

export default App;
