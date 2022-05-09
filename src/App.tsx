import { useState, useEffect,useRef } from "react";
import { Puzzle, Grid } from "./utils/type";
import { Puzzles } from "./utils/puzzles";



function App() {
  const ref = useRef<any>(null)
  const [tetrisBoard, setTetrisBoard] = useState<Grid[]>(new Array(10 * 20).fill({puzzle:0, fixed: false}))
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({fill:[], puzzle:0})
  const [score, setScore] = useState(0)
  const [toClearInterval, setToClearInterval] = useState<any>(null)
  const [touchedGround, setTouchGround] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [lost, setLost] = useState(false)
  const [pause, setPause] = useState(false)
  const [step, setStep] = useState(0)


  const turnPuzzle = (puzzle:Puzzle):Puzzle|false => {
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

          turnArr = [puzzle.fill[2] -9, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] + 10]
         }else if(puzzle.fill[0] - 1 === puzzle.fill[1]){

          turnArr= [puzzle.fill[2] + 11, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]
         }else if(puzzle.fill[0] - 10 === puzzle.fill[1]){

          turnArr=  [puzzle.fill[2] + 9, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]

         }else{

          turnArr=  [puzzle.fill[2] -11, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
         } 
         break; 
      }
      case 3: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[3]){

          turnArr = [puzzle.fill[2] + 11, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[3]){

          turnArr= [puzzle.fill[2] +9, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[3]){

          turnArr=  [puzzle.fill[2] - 11, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2]+ 10]

         }else{

          turnArr=  [puzzle.fill[2]- 9, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
         }  
        break; 
      } 
      case 4: { 
        turnArr = puzzle.fill
        break; 
      } 
      case 5: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[3], puzzle.fill[3] + 10 , puzzle.fill[3] - 11, puzzle.fill[3] - 1]
         }else {
          turnArr= [puzzle.fill[0]-10, puzzle.fill[0] - 9, puzzle.fill[0] - 1, puzzle.fill[0]]
         }
        break; 
      } 
      case 6: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] - 1, puzzle.fill[2] +9]
         }else {
          turnArr= [puzzle.fill[1]-11, puzzle.fill[1] - 10, puzzle.fill[1], puzzle.fill[1]+1]
         }
        break; 
      } 
      case 7: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[2]){

          turnArr = [puzzle.fill[2] + 1, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
  
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
        return false
      } 
    } 
   if(checkIfOutOfGrid(turnArr) && checkIfGridIsOccupiedWhenTurn(turnArr)){
     return {
       fill: turnArr,
       puzzle: puzzle.puzzle
     }
   }
   return false
  }
  const checkIfPuzzleIsFlat = (puzzle:number[]):number[] => {
    const largestNumberSet:number[] = []

    const remainCheck = puzzle.map(e=>e+10)
    for(let i = 0 ; i < remainCheck.length ; i++){
      if(!puzzle.includes(remainCheck[i])){
        largestNumberSet.push(puzzle[i])
      }
    }
    return largestNumberSet

  }
  const boardChecking = (arr: Grid[]):boolean => {
    return arr.every((e)=>e.puzzle!== 0)
  }
  const cleaningBeforeNewPaint = () => {

    setTetrisBoard((board:Grid[])=>{
      return board.map((each)=>{
        if(!each.fixed){
          return {puzzle:0, fixed: false}
        }
        return each
      })
    })
  }
  useEffect(()=>{
    if(gameStarted && touchedGround){
    
      if(step !== 0){
  
        const needRemoveIndex:number[] = []
        let score = 0
         for(let i = 0 ; i < tetrisBoard.length ; i+=10){
            if(boardChecking(tetrisBoard.slice(i, i+10))){
              needRemoveIndex.push(i)
              score+=10
              for(let x = 1; x < 10 ; x ++){
                needRemoveIndex.push( i + x)
               }
            }
         }

         if(needRemoveIndex.length!== 0){
           const remainedBoard = tetrisBoard.filter((_,index)=>!needRemoveIndex.includes(index))
           const boardGridLeft = remainedBoard.length
          
           remainedBoard.unshift(...new Array(200 -boardGridLeft).fill({puzzle:0, fixed: false}))
           setScore((e)=>e+=score)
          setTetrisBoard(remainedBoard.map((each:Grid)=>{
            if(each.puzzle !==0){
              return {
                puzzle:each.puzzle, fixed: true
              }
            }
            return each
          }))
         }else{
          setTetrisBoard((board:Grid[])=>{
            return board.map((each:Grid)=>{
              if(each.puzzle !==0){
                return {
                  puzzle:each.puzzle, fixed: true
                }
              }
              return each
            })
          })
         }
         setCurrentPuzzle({fill:[], puzzle:0})
         setTouchGround(false)
      }
    }
  },[touchedGround])
  useEffect(()=>{
    if(gameStarted){
      if(step !== 0){
  
        setTetrisBoard((board:Grid[])=>{
          return board.map((each,index:number)=>{
            if(currentPuzzle.fill.includes(index)){
              return {puzzle:currentPuzzle.puzzle, fixed:false}
            }else if(!each.fixed){
              return {puzzle:0, fixed:false}
            }
            return each
          })
        })
      }
    }

  },[currentPuzzle])
  const puzzleDownward = () => {
    let canProcess = true
    const newPosition = currentPuzzle.fill.map(e=>e + 10)
    if(checkIfPuzzleIsFlat(newPosition).some((e)=>e>199)){
      setTouchGround(true)
      canProcess= false
    }
    if(tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:Grid)=> grid.fixed)){
      if(newPosition.some((e)=>(20 <=e && e<=29))){
        setLost(true)
      }else{
        setTouchGround(true)
       
      }
      canProcess= false
    }
    if(canProcess){
      cleaningBeforeNewPaint()
      setCurrentPuzzle((original:Puzzle)=>{
        return {
          ...original,
          fill: newPosition
        }
      })
    }

  }
  const PushPuzzleToBottom = () => {
    for(let i = 10 ; i <= 200 ; i+=10){
      const newPosition = currentPuzzle.fill.map(e=>e + i)
      if(checkIfPuzzleIsFlat(newPosition).some((e)=>e>199) || tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:Grid)=> grid.fixed)){
        cleaningBeforeNewPaint()
        setCurrentPuzzle((original:Puzzle)=>{
          return {
            ...original,
            fill: newPosition.map(e=>e - 10)
          }
        })
        setStep((e)=>e+1)
        break
      }
    }

  }
  useEffect(()=>{
    if(step > 0 && !pause){
        if(currentPuzzle.puzzle === 0){
          setCurrentPuzzle(drawPuzzle())
        }else{
          puzzleDownward()
         
        }
    }

  },[step])


  const drawPuzzle = ():Puzzle =>{
    return Puzzles[Math.floor(Math.random() * Puzzles.length)]
  }
  const fillColor = (num: number) => ['bg-white', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-amber-500'][num]
  const startGame = () => {
    if(!gameStarted){
      setGameStarted(true)
      const time = setInterval(()=>{
        if(!pause){
          setStep((e)=>e+1)
        }
      },1000)
      setToClearInterval(time)
    }
  }
  const pauseGame = () => {
    setPause((e)=>{
      return !e
    })
  }
  const restartGame = () => {
    setTetrisBoard(new Array(10 * 20).fill({puzzle:0, fixed: false}))
    clearInterval(toClearInterval)
    setPause(false)
    setStep(0)
    setLost(false)
    setScore(0)
    setCurrentPuzzle({fill:[], puzzle:0})
    startGame()
  }
  const checkIfOutOfGrid = (arr:number[]):boolean => {
    const modulized = arr.map((e)=>e % 10)
    const largestNum = Math.max(...modulized)
    const smallestNum = Math.min(...modulized)
    return 4 > (largestNum - smallestNum ) 
  }
  const checkIfGridIsOccupiedWhenTurn = (arr:number[]):boolean=>{
    return tetrisBoard.filter((_,index)=>arr.includes(index)).map((e)=>e.fixed).every((e:boolean)=>!e)  
  }
  const boardKeyDownControl = (element:React.KeyboardEvent<HTMLDivElement>) => {
    if(gameStarted && !pause){

      if(element.key === 'ArrowUp'){
        const updatePuzzle = turnPuzzle(currentPuzzle)
        if(updatePuzzle){
          cleaningBeforeNewPaint()
          setCurrentPuzzle(()=>{
            return updatePuzzle
          })
        }
       
      }else if(element.key === 'ArrowRight'){
        const newFill = currentPuzzle.fill.map(e=>e+1)
        const isStraightLine = currentPuzzle.puzzle ===1
        let canProcess=true
        if(isStraightLine ){
          const linePositions = currentPuzzle.fill.map((e)=>e%10)
          if(linePositions.every((e)=>e === linePositions[0]) && (linePositions[0] + 1) === 10){
            canProcess = false
          }
        }

        if(!tetrisBoard.filter((_,index)=>newFill.includes(index)).map((e)=>e.fixed).every((e)=>!e)){
          canProcess = false
        }

        if(checkIfOutOfGrid(newFill)&& canProcess){
          cleaningBeforeNewPaint()
          setCurrentPuzzle((original:Puzzle)=>{
            return {
              ...original,
              fill: newFill
            }
          })

        }

       
      }else if (element.key === 'ArrowLeft'){
        const newFill = currentPuzzle.fill.map(e=>e-1)
        const isStraightLine = currentPuzzle.puzzle ===1
        let canProcess=true
        if(isStraightLine ){
          const linePositions = currentPuzzle.fill.map((e)=>e%10)
          if(linePositions.every((e)=>e === linePositions[0]) && (linePositions[0] - 1) < 0){
            canProcess = false
          }
        }

        if(!tetrisBoard.filter((_,index)=>newFill.includes(index)).map((e)=>e.fixed).every((e)=>!e)){
          canProcess = false
        }

        if(checkIfOutOfGrid(newFill) && canProcess){
          cleaningBeforeNewPaint()
          setCurrentPuzzle((original:Puzzle)=>{
            return {
              ...original,
              fill: newFill
            }
          })
        
        }
      }else if(element.key === 'ArrowDown'){
        puzzleDownward()
      }else if (element.key === '0'){
        PushPuzzleToBottom()
      }
     

    }
  }
  return (
    <div className="flex justify-center space-x-4 my-4" onKeyDown={(e)=>boardKeyDownControl(e)} onClick={()=>{
      if(ref.current){
        ref.current.focus();
      }
    }}>
      <div className="flex flex-col space-y-2">
        <button className={`border px-4 py-1 rounded ${gameStarted && "bg-gray-500 text-white"}`} ref={ref} onClick={()=>startGame()}>Start</button>
        <button className={`border px-4 py-1 rounded ${pause && "bg-gray-500 text-white"}`} onClick={()=>pauseGame()}>Pause</button>
        <button className="border px-4 py-1 rounded" onClick={()=>restartGame()}>Restart</button>
        <p className="border px-3 py-1 flex justify-center">{score}</p>
        {lost && <p>Lost</p>}
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-10 gap-0 ">
            {tetrisBoard.map((grid:Grid,index:number)=>{
              return <div key={index} className={`border border-gray-300 w-9 h-9 ${fillColor(grid.puzzle)} ${(10 <=index && index<=19) && 'border-b-2 border-b-gray-800' }`}></div>
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
