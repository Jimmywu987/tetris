import { useState, useEffect } from "react";

type Puzzle = {
  fill:number[];
  puzzle: number
}
function App() {
  const [tetrisBoard, setTetrisBoard] = useState(new Array(10 * 20).fill(0))
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({fill:[], puzzle:0})
  const [touchedGround, setTouchGround] = useState(false)
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
  const turnPuzzle = (direction:string, puzzle:Puzzle):number[] => {
    let turnArr:number[] = []
    switch(puzzle.puzzle) { 
      case 1: { 
         if(puzzle.fill[0] + 1 === puzzle.fill[1]){

          turnArr = [puzzle.fill[2] - 20, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] + 10]
  
         }else if(puzzle.fill[0] + 10 === puzzle.fill[1]){

          turnArr= [puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1, puzzle.fill[2] - 2]

         }else if(puzzle.fill[0] - 1 === puzzle.fill[1]){

          turnArr=  [puzzle.fill[2] + 20, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]

         }else{

          turnArr=  [puzzle.fill[2] -1, puzzle.fill[2], puzzle.fill[2] + 1, puzzle.fill[2] + 2]
         } 
         break;
      } 
      case 2: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[1]){

          turnArr = [puzzle.fill[2] - 10 + 1, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] + 10]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[1]){

          turnArr= [puzzle.fill[2] + 10 + 1, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[1]){

          turnArr=  [puzzle.fill[2] + 10 - 1, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]

         }else{

          turnArr=  [puzzle.fill[2] -1 -10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
         } 
         break; 
      }
      case 3: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[3]){

          turnArr = [puzzle.fill[2] + 10 +1, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[3]){

          turnArr= [puzzle.fill[2] -1  + 10, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[3]){

          turnArr=  [puzzle.fill[2] - 10 -1, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2]+ 10]

         }else{

          turnArr=  [puzzle.fill[2] + 1 - 10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
         }  
        break; 
      } 
      case 4: { 
        turnArr = puzzle.fill
        break; 
      } 
      case 5: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[3], puzzle.fill[3] + 10 , puzzle.fill[3] - 10 - 1, puzzle.fill[3] - 1]
         }else {
          turnArr= [puzzle.fill[0]-10, puzzle.fill[0] - 10 + 1, puzzle.fill[0] - 1, puzzle.fill[0]]
         }
        break; 
      } 
      case 6: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] - 1, puzzle.fill[2] - 1 + 10]
         }else {
          turnArr= [puzzle.fill[1]-10 - 1, puzzle.fill[1] - 10, puzzle.fill[1], puzzle.fill[1]+1]
         }
        break; 
      } 
      case 7: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[2]){

          turnArr = [puzzle.fill[2] + + 1, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[2]){

          turnArr= [puzzle.fill[2] + 10, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[2]){

          turnArr=  [puzzle.fill[2] -1, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]

         }else{

          turnArr=  [puzzle.fill[2] - 10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
         }  
        break; 
      } 
      default: { 
        return puzzle.fill
      } 
   } 
   if(checkIfOutOfGrid(turnArr)){
     return turnArr
   }
   return puzzle.fill
  }
  const checkIfPuzzleIsFlat = (puzzle:number[]):number[] => {
    const largestNumberSet:number[] = []
    // const largestNum:number = Math.max(...puzzle)
    // largestNumberSet.push(largestNum)
    // for(let i = 1 ; i <= 4;i++){
    //   if(puzzle.includes(largestNum - i)){
    //     largestNumberSet.push(largestNum - i)
    //   }
    // }
    const remainCheck = puzzle.map(e=>e+10)
    for(let i = 0 ; i < remainCheck.length ; i++){
      if(!puzzle.includes(remainCheck[i])){
        largestNumberSet.push(puzzle[i])
      }
    }
    return largestNumberSet

  }
  const boardChecking = (arr: number[]):boolean => {
    return arr.every((e)=>e!== 0)
  }
  useEffect(()=>{
    if(gameStarted && touchedGround){
    
      if(step !== 0){
  
        const needRemoveIndex:number[] = []
         for(let i = 0 ; i < tetrisBoard.length ; i+=10){
            if(boardChecking(tetrisBoard.slice(i, i+10))){
              needRemoveIndex.push(i)
              for(let x = 1; x < 10 ; x ++){
                needRemoveIndex.push( i + x)
               }
            }
         }

         if(needRemoveIndex.length!== 0){
           const remainedBoard = tetrisBoard.filter((_,index)=>!needRemoveIndex.includes(index))
           const boardGridLeft = remainedBoard.length
           remainedBoard.unshift(...new Array(200 -boardGridLeft).fill(0))
          setTetrisBoard(remainedBoard)
         }
         setCurrentPuzzle({fill:[], puzzle:0})
         setTouchGround(false)
      }
    }
  },[touchedGround])
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
            if(checkIfPuzzleIsFlat(newPosition).some((e)=>e>199)){
              setTouchGround(true)

              return original
            }
            if(tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:number)=> grid !== 0)){
              setTouchGround(true)

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
  const checkIfOutOfGrid = (arr:number[]):boolean => {
    const modulized = arr.map((e)=>e % 10)
    const largestNum = Math.max(...modulized)
    const smallestNum = Math.min(...modulized)
    if(4 > (largestNum - smallestNum )){
      return true
    }
    return false
  }
  return (
    <div className="flex justify-center space-x-4 my-4" onKeyDown={(e)=>{
      if(gameStarted){
        if(e.key === 'ArrowUp'){
          setTetrisBoard((board:number[])=>{
            return board.map((each,index:number)=>{
              if(currentPuzzle.fill.includes(index)){
                return 0
              }
              return each
            })
          })
          setCurrentPuzzle((original:Puzzle)=>{
            return {
              ...original,
              fill: turnPuzzle("right",original) as any
            }
          })
        }else if(e.key === 'ArrowRight'){
          const newFill = currentPuzzle.fill.map(e=>e+1)
          const isStraightLine = currentPuzzle.puzzle ===1
          let canProcess=true
          if(isStraightLine ){
            const linePositions = currentPuzzle.fill.map((e)=>e%10)
            if(linePositions.every((e)=>e === linePositions[0]) && (linePositions[0] + 1) === 10){
              canProcess = false
            }
          }
          if(checkIfOutOfGrid(newFill)&& canProcess){
            setTetrisBoard((board:number[])=>{
              return board.map((each,index:number)=>{
                if(currentPuzzle.fill.includes(index)){
                  return 0
                }
                return each
              })
            })
            setCurrentPuzzle((original:Puzzle)=>{
              return {
                ...original,
                fill: newFill
              }
            })

          }

         
        }else if (e.key === 'ArrowLeft'){
          const newFill = currentPuzzle.fill.map(e=>e-1)
          const isStraightLine = currentPuzzle.puzzle ===1
          let canProcess=true
          if(isStraightLine ){
            const linePositions = currentPuzzle.fill.map((e)=>e%10)
            if(linePositions.every((e)=>e === linePositions[0]) && (linePositions[0] - 1) < 0){
              canProcess = false
            }
          }
          if(checkIfOutOfGrid(newFill) && canProcess){
            setTetrisBoard((board:number[])=>{
              return board.map((each,index:number)=>{
                if(currentPuzzle.fill.includes(index)){
                  return 0
                }
                return each
              })
            })
            setCurrentPuzzle((original:Puzzle)=>{
              return {
                ...original,
                fill: newFill
              }
            })
          
          }
        }else if(e.key === 'ArrowDown'){
          setCurrentPuzzle((original:Puzzle)=>{
            const newPosition = original.fill.map(e=>e + 10)
            if(checkIfPuzzleIsFlat(newPosition).some((e)=>e>199)){
              setTouchGround(true)
              return original
            }
            if(tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:number)=> grid !== 0)){
              setTouchGround(true)
              return original
            }
            return {
              ...original,
              fill: newPosition
            }
          })
        }
       

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
