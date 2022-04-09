const grid = document.querySelector(".grid");

// creating 3 X 3 Board

let cellCount = 0;
for (let i = 0; i < 3; i++) {
  const cellGroup = document.createElement("div");
  cellGroup.className = "cell-group";
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("div");
    cell.id = cellCount;
    cell.className = "cell";
    cellCount++;
    cellGroup.appendChild(cell);
  }
  grid.appendChild(cellGroup);
}

// board validate array

const possibleCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

let board;
const humanPlayer = "X";
let aiPlayer = "O";
const cells = document.querySelectorAll(".cell");
let player = humanPlayer;
startGame();

function startGame() {
  // resetting everything
  // original Board
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  document.querySelector(".back-drop").style.display = "none";
  player = humanPlayer;
  document.querySelector(".X-turn").style.backgroundColor = "green";
  document.querySelector(".O-turn").style.backgroundColor = "red";

  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.style.removeProperty("background-color");
    cell.addEventListener("click", onSelectCell, false);
  });
}
async function onSelectCell(cell) {
  if (typeof board[cell.target.id] === "number") {
    const dropdownValue = document.getElementById("playerType").value;
    if (dropdownValue === "friend") {
      turn(cell.target.id, player);
      // check for win or draw match
      if (!checkMatchWin(board, player) && !checkDrawMatch()) {
        player = player === aiPlayer ? humanPlayer : aiPlayer;
        const opponent = player === aiPlayer ? humanPlayer : aiPlayer;
        document.querySelector("." + player + "-turn").style.backgroundColor =
          "green";
        document.querySelector("." + opponent + "-turn").style.backgroundColor =
          "red";
      }
    }

    if (dropdownValue === "computer") {
      turn(cell.target.id, humanPlayer);
      player = player === aiPlayer ? humanPlayer : aiPlayer;
      const opponent = player === aiPlayer ? humanPlayer : aiPlayer;
      document.querySelector("." + player + "-turn").style.backgroundColor =
        "green";
      document.querySelector("." + opponent + "-turn").style.backgroundColor =
        "red";
        await sleep(100);
      // AI Player turn
      // check if game over or tie condition
      if (!checkMatchWin(board, humanPlayer) && !checkDrawMatch()) {
        // AI Player turn
        turn(minimax(board, aiPlayer).index, aiPlayer);
        document.querySelector("." + player + "-turn").style.backgroundColor =
        "red";
      document.querySelector("." + opponent + "-turn").style.backgroundColor =
        "green";
      player = player === aiPlayer ? humanPlayer : aiPlayer;
      }
    }
  }
}
function turn(cellId, player) {
  board[cellId] = player;
  document.getElementById(cellId).innerText = player;
  const gameWon = checkMatchWin(board, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkMatchWin(newBoard, player) {
  const plays = newBoard.reduce(
    (a, e, i) => (e === player ? a.concat(i) : a),
    []
  );

  for (const [index, row] of possibleCombinations.entries()) {
    if (row.every((elm) => plays.indexOf(elm) > -1)) {
      return { index, player };
    }
  }
  return null;
}

function gameOver(gameWon) {
  for (let i = 0; i < possibleCombinations[gameWon.index].length; i++) {
    document.getElementById(
      possibleCombinations[gameWon.index][i]
    ).style.backgroundColor = "green";
  }
  dynamicGif(gameWon.player);
  declareWinner(gameWon.player + " won the game.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkDrawMatch() {
  if (!emptyCells().length) {
    dynamicGif();
    declareWinner("Draw Match");
    return true;
  }
  return false;
}

function emptyCells() {
  return board.filter((cell) => typeof cell !== "string");
}

// reusable method

function declareWinner(result) {
  document.querySelector(".back-drop").style.display = "block";
  document.querySelector(".match-result").innerHTML = result;
}

// MINIMAX ALGO for AI best move

function minimax(newBoard, player) {
  // possible moves array
  const moves = [];
  const availCells = emptyCells();
  if (checkMatchWin(newBoard, humanPlayer)) {
    return {score: -10};
  } else if (checkMatchWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if(!availCells.length) {
    return {score: 0}
  }

  for (let i = 0; i < availCells.length; i++) {
    const move = {};
    // storing current index
    move.index = newBoard[availCells[i]];
    // pushing the player value to the board
    newBoard[availCells[i]] = player;

    if (player === humanPlayer) {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    }
    newBoard[availCells[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === humanPlayer) {
    let bestScore = Infinity;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }

  }
  if (player === aiPlayer) {
    let bestScore = -Infinity;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }

  }
  return moves[bestMove];
}

function dynamicGif(value = null) {
  const gifLink =
    value === humanPlayer || value === aiPlayer
      ? "https://c.tenor.com/3nT4Kr56fKIAAAAM/monkeyy-kapaul.gif"
      : "https://c.tenor.com/uTD8BlN66boAAAAM/vijayakanth-angry-angry.gif";
  document.querySelector(".result-gif").src = gifLink;
  document.querySelector(".result-gif").alt = value || "Draw";
}

function OnChangeOption() {
  startGame();
}
