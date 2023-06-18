## Tetris

<img width="300" alt="Bildschirmfoto 2023-06-18 um 4 54 03 PM" src="https://github.com/Jimmywu987/tetris/assets/65562227/7491dda7-a611-4b79-bf29-059725e165b0">

### How this is built

1. Set all shapes of [Tetromino](https://tetris.wiki/Tetromino#:~:text=The%20seven%20one%2Dsided%20tetrominoes,previously%20called%20tetraminoes%20around%201999.) (Assign each shape a number and set the positions (indexes that appear on top of the board) of each shape into an array <-- all shapes can be rendered by an array of indexes.).
  <img width="264" alt="Bildschirmfoto 2023-06-18 um 5 53 53 PM" src="https://github.com/Jimmywu987/tetris/assets/65562227/971de335-2abf-4c92-8096-33cbf3c9c88a">

2. An array of 10 * 20 objects of ``` { puzzleNum:0, isFixed:false } ``` is created at first to be the base.
3. A function will randomly draw two Tetrominos at first and put them into an array. The first index of the array will be shown on top of the board, the second index will be shown on the right side for a perview of the next Tetromino.

<img width="300" alt="Bildschirmfoto 2023-06-18 um 5 34 32 PM" src="https://github.com/Jimmywu987/tetris/assets/65562227/02e30113-4107-4d1b-aad8-2439cb5aa217">

4. A setTimeInterval will also be triggered to execute a function every second. The function is to move down the puzzle one block <-- updates the Tetromino's position (index) + 10, and re-render the boards.
5. A function will loop through the board, to paint the block with the corresponding colors base on the puzzleNum or remove the background color when the puzzleNum is 0. That will make it appear to be moving down the board.
6. A function is set for user to move the puzzle horizontally to left (indexex - 1) or to right (indexes + 1) and check if the puzzle is at the edge, when yes, then it won't be moved to cross the edge.
<img width="586" alt="Bildschirmfoto 2023-06-18 um 7 54 48 PM" src="https://github.com/Jimmywu987/tetris/assets/65562227/4727300d-38da-4de9-90d8-452dd809b95c">

7. when the puzzle hit the bottom of the board or on top of another puzzle, it will check if any whole set of horizontal blocks are filled, if yes, these blocks will be removed, and add the same amounts of blocks at the end of the board array.
8. Then all these puzzle blocks' isFixed is set to true.
9. The preview puzzle will be put onto the top of the board and another puzzle will be drawn for preview.



### Tech tools

<a href="https://www.typescriptlang.org/"><img src="https://camo.githubusercontent.com/ff660f3b34106793e1a8008592156f3127d8465adc82e103b9f2e0ce012c70ec/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f747970657363726970742e737667" alt="typescript" width="40" height="40"></a>
<a href="https://reactjs.org/" target="_blank"> <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" alt="react" width="40" height="40"/> </a>
<a href="https://tailwindcss.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a>
