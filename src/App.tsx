import { useState, useEffect } from "react";

type Puzzle = {
  fill:number[];
  puzzle: number;
  right:number[];
  left:number[];
  turn:string[];
}
type Grid = {
  puzzle: number;
  fixed: boolean;
}
function App() {
  const [tetrisBoard, setTetrisBoard] = useState<Grid[]>(new Array(10 * 20).fill({puzzle:0, fixed: false}))
  // const [tetrisBoard, setTetrisBoard] = useState(new Array(10 * 20).fill(0))
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({fill:[], puzzle:0, right:[], left:[], turn:[]})
  const [score, setScore] = useState(0)
  const [toClearInterval, setToClearInterval] = useState<any>(null)
  const [touchedGround, setTouchGround] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [lost, setLost] = useState(false)
  const [pause, setPause] = useState(false)
  const [step, setStep] = useState(0)


  const linePuzzle:Puzzle ={
    fill:[13,14,15,16],
    puzzle:1,
    right:[1,1,1,0], left:[0,1,1,1],
    turn:['0010','0100']
  }
  const LToRightPuzzle:Puzzle ={
    fill:[4,14,15,16],
    puzzle:2,
    right:[0,2,2,0], left:[0,0,2,2],
    turn:['0020','0200']

  }
  const LToLeftPuzzle:Puzzle = {
    fill:[6,14,15,16],
    puzzle:3,
    right:[0,3,3,0], left:[0,0,3,3],
    turn:['0030','0300']
  }
  const squarePuzzle:Puzzle ={
    fill:[4,5,14,15],
    puzzle:4,
    right:[4,0,4,0], left:[0,4,0,4],
    turn:['4444']

  }
  const stairToRightPuzzle:Puzzle = {
    fill:[5,6,14,15],
    puzzle:5,
    right:[5,0,5,0], left:[0,5,0,5],
    turn:['0550','0055']

  }
  const stairToLeftPuzzle:Puzzle = {
    fill:[4,5,15,16],
    puzzle:6,
    right:[6,0,6,0], left:[0,6,0,6],
    turn:['6060','0660']

  }
  const TPuzzle:Puzzle= {
    fill:[4,13,14,15],
    puzzle:7,
    right:[0,7,7,0], left:[0,0,7,7],
    turn:['7770','0777']

  }


  const turnPuzzle = (puzzle:Puzzle):Puzzle|false => {
    let turnArr:number[] = []
    let rightArr : number[] = []
    let leftArr:number[] = []
    switch(puzzle.puzzle) { 
      case 1: { 
         if(puzzle.fill[0] + 1 === puzzle.fill[1]){

          turnArr = [puzzle.fill[2] - 20, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] + 10]
          rightArr = [0,0,0,0]
          leftArr = [0,0,0,0]
         }else if(puzzle.fill[0] + 10 === puzzle.fill[1]){

          turnArr= [puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1, puzzle.fill[2] - 2]
          rightArr =[1,1,1,0]
          leftArr = [0,1,1,1]

         }else if(puzzle.fill[0] - 1 === puzzle.fill[1]){

          turnArr=  [puzzle.fill[2] + 20, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]
          rightArr = [0,0,0,0]
          leftArr = [0,0,0,0]
         }else{
          turnArr=  [puzzle.fill[2] -1, puzzle.fill[2], puzzle.fill[2] + 1, puzzle.fill[2] + 2]
          rightArr =[1,1,1,0]
          leftArr = [0,1,1,1]
         } 
         break;
      } 
      case 2: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[1]){

          turnArr = [puzzle.fill[2] - 10 + 1, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] + 10]
          rightArr =[2,0,0,0]
          leftArr = [0,2,0,0]
         }else if(puzzle.fill[0] - 1 === puzzle.fill[1]){

          turnArr= [puzzle.fill[2] + 10 + 1, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]
          rightArr = [2,2,0,0]
          leftArr = [0,2,2,0]
         }else if(puzzle.fill[0] - 10 === puzzle.fill[1]){

          turnArr=  [puzzle.fill[2] + 10 - 1, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]
          rightArr =[0,0,2,0]
          leftArr = [0,0,0,2]

         }else{

          turnArr=  [puzzle.fill[2] -1 -10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
          rightArr = [0,2,2,0]
          leftArr = [0,0,2,2]
         } 
         break; 
      }
      case 3: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[3]){

          turnArr = [puzzle.fill[2] + 10 +1, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
          rightArr = [0,0,3,0]
          leftArr = [0,0,0,3]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[3]){

          turnArr= [puzzle.fill[2] -1  + 10, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]
          rightArr = [3,3,0,0]
          leftArr = [0,3,3,0]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[3]){

          turnArr=  [puzzle.fill[2] - 10 -1, puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2]+ 10]
          rightArr = [3,0,0,0]
          leftArr = [0,3,0,0]

         }else{

          turnArr=  [puzzle.fill[2] + 1 - 10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
          rightArr =[0,3,3,0]
          leftArr = [0,0,3,3]
         }  
        break; 
      } 
      case 4: { 
        turnArr = puzzle.fill
        rightArr = [4,0,4,0]
          leftArr = [0,4,0,4]
        break; 
      } 
      case 5: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[3], puzzle.fill[3] + 10 , puzzle.fill[3] - 10 - 1, puzzle.fill[3] - 1]
          rightArr = [0,5,0,0]
          leftArr = [0,0,5,0]
         }else {
          turnArr= [puzzle.fill[0]-10, puzzle.fill[0] - 10 + 1, puzzle.fill[0] - 1, puzzle.fill[0]]
          rightArr = [5,0,5,0]
          leftArr = [0,5,0,5]
         }
        break; 
      } 
      case 6: { 
        if(puzzle.fill[0] + 1 === puzzle.fill[1]){
          turnArr = [puzzle.fill[2] - 10, puzzle.fill[2], puzzle.fill[2] - 1, puzzle.fill[2] - 1 + 10]
          rightArr = [0,6,0,0]
          leftArr = [0,0,6,0]
         }else {
          turnArr= [puzzle.fill[1]-10 - 1, puzzle.fill[1] - 10, puzzle.fill[1], puzzle.fill[1]+1]
          rightArr = [6,0,6,0]
          leftArr = [0,6,0,6]
         }
        break; 
      } 
      case 7: { 
        if(puzzle.fill[0] + 10 === puzzle.fill[2]){

          turnArr = [puzzle.fill[2] + + 1, puzzle.fill[2] - 10 , puzzle.fill[2], puzzle.fill[2] + 10]
          rightArr = [0,7,0,0]
          leftArr = [0,0,7,0]
  
         }else if(puzzle.fill[0] - 1 === puzzle.fill[2]){

          turnArr= [puzzle.fill[2] + 10, puzzle.fill[2] + 1, puzzle.fill[2], puzzle.fill[2] - 1]
          rightArr = [7,7,0,0]
          leftArr = [0,7,7,0]

         }else if(puzzle.fill[0] - 10 === puzzle.fill[2]){

          turnArr=  [puzzle.fill[2] -1, puzzle.fill[2] + 10, puzzle.fill[2], puzzle.fill[2] - 10]
          rightArr = [0,7,0,0]
          leftArr = [0,0,7,0]

         }else{

          turnArr=  [puzzle.fill[2] - 10, puzzle.fill[2] - 1, puzzle.fill[2], puzzle.fill[2] + 1]
          rightArr = [0,7,7,0]
          leftArr = [0,0,7,7]
         }  
        break; 
      } 
      default: { 
        return false
      } 
   } 
   if(checkIfOutOfGrid(turnArr) && checkIfGridIsOccupiedWhenTurn(turnArr, puzzle.turn)){
     return {
       fill: turnArr,
       puzzle: puzzle.puzzle,
       left:leftArr,
       right:rightArr,
       turn:puzzle.turn
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
    // setTetrisBoard((board:number[])=>{
    //   return board.map((each,index:number)=>{
    //     if(currentPuzzle.fill.includes(index)){
    //       return 0
    //     }
    //     return each
    //   })
    // })
    setTetrisBoard((board:Grid[])=>{
      return board.map((each,index:number)=>{
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
         setCurrentPuzzle({fill:[], puzzle:0,right:[], left:[],turn:[]})
         setTouchGround(false)
      }
    }
  },[touchedGround])
  useEffect(()=>{
    if(gameStarted){
      if(step !== 0){
        // setTetrisBoard((board:number[])=>{
        //   return board.map((each,index:number)=>{
        //     if(currentPuzzle.fill.includes(index)){
        //       return currentPuzzle.puzzle
        //     }
        //     else if(currentPuzzle.fill.map((e)=>{
        //       if(e-10 > 0){
        //         return e-10
        //       }
        //        return e
        //     }).includes(index)){
        //       return 0
        //     }
        //     return each
        //   })
        // })
        setTetrisBoard((board:Grid[])=>{
          return board.map((each,index:number)=>{
            if(currentPuzzle.fill.includes(index)){
              return {puzzle:currentPuzzle.puzzle, fixed:false}
            }
            else if(!each.fixed){
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
    if(tetrisBoard.filter((_,index)=>checkIfPuzzleIsFlat(newPosition).includes(index)).some((grid:Grid)=> grid.puzzle !== 0)){
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
  useEffect(()=>{
    if(step > 0){
        if(currentPuzzle.puzzle === 0){
          setCurrentPuzzle(drawPuzzle())
        }else{
          puzzleDownward()
         
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
    const time = setInterval(()=>{
      if(!pause){
        setStep((e)=>e+1)
      }
    },1000)
    setToClearInterval(time)
    
  }
  const pauseGame = () => {
    clearInterval(toClearInterval)
    setPause((e)=>{
      return !e})
    

  }
  const restartGame = () => {
    setTetrisBoard(new Array(10 * 20).fill({puzzle:0, fixed: false}))
    clearInterval(toClearInterval)
    setPause(false)
    setStep(0)
    setLost(false)
    setScore(0)
    setCurrentPuzzle({fill:[], puzzle:0, left:[], right:[],turn:[]})
    startGame()
  }
  const checkIfOutOfGrid = (arr:number[]):boolean => {
    const modulized = arr.map((e)=>e % 10)
    const largestNum = Math.max(...modulized)
    const smallestNum = Math.min(...modulized)

    if(4 > (largestNum - smallestNum ) ){
      return true
    }
    return false
  }
  const checkIfGridIsOccupiedWhenTurn = (arr:number[], turnArr:string[]):boolean=>{
   const existGrid = tetrisBoard.filter((_,index)=>arr.includes(index)).map((e)=>e.puzzle).join("")
    return turnArr.includes(existGrid)
  }
  return (
    <div className="flex justify-center space-x-4 my-4" onKeyDown={(e)=>{
      if(gameStarted){

        if(e.key === 'ArrowUp'){
          const updatePuzzle = turnPuzzle(currentPuzzle)
          if(updatePuzzle){
            cleaningBeforeNewPaint()
            setCurrentPuzzle(()=>{
              return updatePuzzle
            })
          }
         
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

          if(tetrisBoard.filter((_,index)=>newFill.includes(index)).map((e)=>e.puzzle).join("") !== currentPuzzle.right.join("")){
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

          if(tetrisBoard.filter((_,index)=>newFill.includes(index)).map((e)=>e.puzzle).join("") !== currentPuzzle.left.join("")){
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
        }else if(e.key === 'ArrowDown'){
          puzzleDownward()
        }
       

      }
    }}>
      <div className="flex flex-col space-y-2">
        <button className="border px-4 py-1 rounded" onClick={()=>startGame()}>Start</button>
        <button className={`border px-4 py-1 rounded ${pause && "bg-gray-500 text-white"}`} onClick={()=>pauseGame()}>Pause</button>
        <button className="border px-4 py-1 rounded" onClick={()=>restartGame()}>Restart</button>
        <p className="border px-3 py-1 flex justify-center">{score}</p>
        {lost && <p>Lost</p>}
      </div>
      <div className="flex justify-center ">
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
