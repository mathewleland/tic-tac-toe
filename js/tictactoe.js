let playerMark,
  computerMark,
  difficulty = false,
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  pos,
  x,
  y,
  gameOver = false,
  markSelected = false,
  fullBoard = false,
  playerWins = 0,
  computerWins = 0,
  draws = 0;

///////select X or O on new game
document.getElementById('newGame').addEventListener('touchstart', clearBoard);

document.getElementById("pickX").addEventListener('touchstart', () => {
  clearBoard();
  playerMark = "X";
  computerMark = "O";
  markSelected = true;
  difficulty = document.getElementById('difficulty').checked;
});

document.getElementById("pickO").addEventListener('touchstart', () => {
  clearBoard();
  playerMark = "O";
  computerMark = "X";
  markSelected = true;
  difficulty = document.getElementById('difficulty').checked;
  computerMove();
});

/////////////////////////////


///update the baord after every move
function updateBoard(board) {
  fullBoard = true;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let position = [row, col].toString();
      if (board[row][col] == 0) {
        fullBoard = false;
        document.getElementById(position).innerHTML = '';
      } else {
        document.getElementById(position).innerHTML = board[row][col];
      }
    }
  }
}

//update scoreboard at end of game
function updateScore(winner) {
  gameOver = true;
  if (winner == computerMark) {
    computerWins++;
    document.getElementById('computerWins').innerHTML = computerWins;
    document.getElementById('endGameHeadline').innerHTML = "Looks like the 1s and 0s <br>is good with Xs and Os";
  }
  else if (winner == playerMark) {
    playerWins++;
    document.getElementById('playerWins').innerHTML = playerWins;
    document.getElementById('endGameHeadline').innerHTML = "Congratulations, you win!";
  }
  else if (winner == "draw") {
    draws++;
    document.getElementById('draws').innerHTML = draws;
    document.getElementById('endGameHeadline').innerHTML = 'Results were... inconclusive';
  }

  $('#largeModal').modal();
}

///each square can be touchstarted and adds playerMark to it
const squares = document.getElementsByClassName('card');

for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('touchstart', function() { //cannot use arrow function with 'this' inside
    if (this.innerHTML === '' && !gameOver && playerMark != undefined) {
      pos = this.id.split(',');
      x = Number(pos[0]);
      y = Number(pos[1]);
      board[x][y] = playerMark;
      // depressCard(this.id);
      updateBoard(board);
    }
    else if (this.innerHTML) return;
    checkWinners(playerMark);
    if (fullBoard && !gameOver) {
      updateScore("draw");
      gameOver = true;

    }
    if (!gameOver) computerMove();
  })
}


///check the rows and columns and diagonals to see if there is a winner
function checkRows(mark) {

  for (let row = 0; row < board.length; row++) {
    let winner = true;
    for (let i = 0; i < 3; i++) {
      if (board[row][i] != mark) {
        //take each of these squares and highlight them on a win!
        winner = false;
      }
    }
    if (winner) {
      console.log(mark + " wins across the row!");
      updateScore(mark);
      gameOver = true;
      return;
    }
  }
}

function checkColumns(mark) {
  for (let col = 0; col < board.length; col++) {
    let winner = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][col] != mark) {
        //highlight column
        winner = false;
      }
    }
    if (winner) {
      console.log(mark + " wins down the column!")
      gameOver = true;
      updateScore(mark);
      return;
    }
  }
}

function checkDiagonals(mark) {
  if (board[1][1] != mark) return;
  if ((board[0][0] == mark && board[2][2] == mark) || (board[0][2] == mark && board[2][0] == mark)) {
    updateScore(mark);
    gameOver = true;
  }
}

//combine checks into one function to be able to DRY up when called
function checkWinners(mark) {
  checkRows(mark);
  checkColumns(mark);
  checkDiagonals(mark);
}

//logic for each computer move
function computerMove() {
  //let compPos; first assign it a win if possible, then a block, then a corner, then a random move
  if (gameOver || computerMark == undefined) return;
  let compPos = undefined;

  if (difficulty) {
    const specialCase1 = [[playerMark, 0, 0],
              [0, computerMark, 0],
              [0, 0, playerMark]];
    const specialCase2 = [[0, 0, playerMark],
              [0, computerMark, 0],
              [playerMark, 0, 0]];
    const specialCase3 = [
      [0,0,0],
      [0,computerMark, playerMark],
      [0,playerMark, 0]
    ];
    if (board[1][1] == '') {
      compPos = [1,1];
    }
    else if ((board.equals(specialCase1)) //special case if two opposite corners are taken, do not set up a win
               ||
             (board.equals(specialCase2)) ) {
      compPos = [0,1];
    }
    else if ((board.equals(specialCase3))) {
      compPos = [2,2];
    }
  }

  if (compPos === undefined) compPos = checkThree(computerMark); //make the winning move
  if (compPos === undefined)  compPos = checkThree(playerMark); //if there's no winning move, check for a block

  if (compPos === undefined) {
    //find any corner, or side middles
    if (board[0][0] == '') {
      compPos = [0,0];
    }
    else if (board[0][2] == '') {
      compPos = [0,2];
    }
    else if (board[2][0] == '') {
      compPos = [2,0];
    }
    else if (board[2][2] == '') {
      compPos = [2,2];
    }
    else if (board[0][1] == '') {
      compPos = [0,1];
    }
    else if (board[1][0] == '') {
      compPos = [1,0];
    }
    else if (board[1][2] == '') {
      compPos = [1,2];
    }
    else if (board[2][1] == '') {
      compPos = [2,1];
    }
  }

  console.log(compPos);
  board[compPos[0]][compPos[1]] = computerMark; //this is assigning the compPos to the board
  // depressCard(compPos.toString());
  updateBoard(board);
  checkWinners(computerMark);
  if (fullBoard && !gameOver) {
      console.log("cats game!");
      updateScore("draw")
  }
}

function checkThree(mark) {
  const block2 = [mark, mark, 0];
  const block1 = [mark, 0, mark];
  const block0 = [0, mark, mark];

  let columns = transposeBoard(board);
  const diag1 = [board[0][0], board[1][1], board[2][2]]; //add diagonals  topleft, middle, bottomright
  const diag2 = [board[2][0], board[1][1], board[0][2]]; // bottomleft, middle, topright

  //check rows
  for (let row=0; row < board.length; row++) {
    if ((board[row]).equals(block2)) return [row, 2];
    if ((board[row]).equals(block1)) return [row,1];
    if ((board[row]).equals(block0)) return [row,0];
  }
  //check columns
  for (let col=0; col < board.length; col++) {
    if ((columns[col]).equals(block2)) return [2, col];
    if ((columns[col]).equals(block1)) return [1, col];
    if ((columns[col]).equals(block0)) return [0, col];
  }
  //check diagonals
  if (diag1.equals(block2)) return [2,2];
  if (diag1.equals(block1)) return [1,1];
  if (diag1.equals(block0)) return [0,0];
  if (diag2.equals(block2)) return [0,2];
  if (diag2.equals(block1)) return [1,1];
  if (diag2.equals(block0)) return [2,0];

  //no blocks or wins
  return undefined;
}

function clearBoard() {
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  updateBoard(board);
  gameOver = false;
}

/////Pulled from stackoverflow to compare arrays since comparison operators do not work on js arrays
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (let i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

function transposeBoard(board) {
  return board[0].map(function(col, i) {
    return board.map(function(row) {
      return row[i]
    })
  });
}
