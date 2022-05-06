import { useState, useEffect } from "react";

type Puzzle = {
  fill:number[];
  puzzle: number
}
function App() {
  const [tetrisBoard, setTetrisBoard] = useState(new Array(10 * 20).fill(0))
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({fill:[], puzzle:0})
  const [gameStarted, setGameStarted] = useState(false)
  const [step, setStep] = useState(0)
  const linePuzzle:Puzzle ={
    fill:[13,14,15,16],
    puzzle:1
  }
  const LToRightPuzzle:Puzzle ={
    fill:[4,14,15,16],
    puzzle:2
  }
  const LToLeftPuzzle:Puzzle = {
    fill:[6,14,15,16],
    puzzle:3
  }
  const squarePuzzle:Puzzle ={
    fill:[4,5,14,15],
    puzzle:4
  }
  const stairToRightPuzzle:Puzzle = {
    fill:[5,6,14,15],
    puzzle:5
  }
  const stairToLeftPuzzle:Puzzle = {
    fill:[4,5,15,16],
    puzzle:6
  }
  const TPuzzle:Puzzle= {
    fill:[4,13,14,15],
    puzzle:7
  }
  const checkIfPuzzleIsFlat = (puzzle:number[]):number[] => {
    const largestNumberSet:number[] = []
    const largestNum:number = Math.max(...puzzle)
    largestNumberSet.push(largestNum)
    for(let i = 1 ; i <= 4;i++){
      if(puzzle.includes(largestNum - i)){
        largestNumberSet.push(largestNum - i)
      }
    }
    return largestNumberSet

  }
  useEffect(()=>{
    if(gameStarted){
      if(step !== 0){
        setTetrisBoard((board:number[])=>{
          return board.map((each,index:number)=>{
            if(currentPuzzle.fill.includes(index)){
              return currentPuzzle.puzzle
            }else if(currentPuzzle.fill.map((e)=>{
              if(e-10 > 0){
                return e-10
              }
               return e
            }).includes(index)){
              return 0
            }
            return each
          })
        })
      }
    }

  },[currentPuzzle])
  useEffect(()=>{
    if(step > 0){
        if(currentPuzzle.puzzle === 0){
          setCurrentPuzzle(drawPuzzle())
        }else{
          setCurrentPuzzle((original:Puzzle)=>{
            const newPosition = original.fill.map(e=>e + 10)
            if(checkIfPuzzleIsFlat(newPosition).every((e)=>e>199)){
              setCurrentPuzzle({fill:[], puzzle:0})
              return original
            }
            if(tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:number)=> grid !== 0)){
              setCurrentPuzzle({fill:[], puzzle:0})
              return original
            }
            return {
              ...original,
              fill: newPosition
            }
          })
        }
    }

  },[step])

  const drawPuzzle = ():Puzzle =>{
    const allPuzzles = [linePuzzle,LToRightPuzzle,LToLeftPuzzle,squarePuzzle,stairToRightPuzzle,stairToLeftPuzzle,TPuzzle]
    return allPuzzles[Math.floor(Math.random() * allPuzzles.length)]
  }
  const fillColor = (num: number) => ['bg-white', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-amber-500'][num]
  const startGame = () => {
    setGameStarted(true)
    setInterval(()=>{

    setStep((e)=>e+1)
  },1000)

    
  }
  const pauseGame = () => {

  }
  const restartGame = () => {

  }
  return (
    <div className="flex justify-center space-x-4 my-4" onKeyDown={(e)=>{
      if(gameStarted){
        console.log(e.key)

      }
    }}>
      <div className="flex flex-col space-y-2">
        <button className="border px-4 py-1 rounded" onClick={()=>startGame()}>Start</button>
        <button className="border px-4 py-1 rounded" onClick={()=>pauseGame()}>Pause</button>
        <button className="border px-4 py-1 rounded" onClick={()=>restartGame()}>Restart</button>
      </div>
      <div className="flex justify-center ">
        <div className="grid grid-cols-10 gap-0 ">
            {tetrisBoard.map((grid:number,index:number)=>{
              return <div key={index} className={`border border-gray-300 w-10 h-10 ${fillColor(grid)}`}></div>
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
