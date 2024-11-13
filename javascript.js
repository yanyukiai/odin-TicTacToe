// console.log("Check JS file link");

// Reference: code structure refer to below link:
//  https://replit.com/@40percentzinc/ConnectFourConsole#script.js

/*
 ** A Cell represents one "square" on the board and can have one of values below
 ** value == 0: no token is in the square,
 ** value == 1: occupied by Player One's token,
 ** value == 2: occupied by Player Two's token

 ** Note: 
 ** This function does not check whether the token is occupied or not
 ** Whether the action is allowed or not should be included in controller related functions (see below)
 */

function Cell() {
  let value = 0;

  // accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // retrieve the current value of this cell
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/* The Gameboard represents the state of the board, each equare holds a Cell. */
function Gameboard(dimension) {
  // Init game board
  const rows = dimension;
  const columns = dimension;
  const board = [];

  // Initialization
  // Create a 2d array that will represent the state of the game board
  // Row 0 - the top row, column 0 - the left-most column.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // get the entire board that our UI will eventually need to render it.()
  const getBoard = () => board;

  // dropToken (row, column, player): drop player's token at cell[row, column]
  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
    } else {
      // Another validation is added inside addEventListener, this line should not run
      console.log("Tried to drop token in occupied cell.");
    }
  };

  // Provide an interface for the rest of our application to interact with the board.
  return { getBoard, dropToken };
}

/*
 ** The GameController will be responsible for controlling the flow and state of the game's turns.
 ** Below methods are included:
 ** 1. switchPlayerTurn: each player drops token in turns (PlayerOne plays a move, PlayerTwo follows, then PlayerOne again ...)
 ** 2. getActivePlayer: get which player should play a move now.
 ** 3. playRound: play one round (active player plays a move), switch active player, and update the board.
 */
function GameController(
  playerOneName = "PlayerOne",
  playerTwoName = "PlayerTwo",
  dimension
) {
  const board = Gameboard(dimension);

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  let winner = null;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // This method check if the player with input token is the winner
  const checkWinner = (board, token) => {
    const size = board.length;

    // Check rows
    for (let row = 0; row < size; row++) {
      if (board[row].every((cell) => cell.getValue() === token)) {
        return true;
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if (board.every((row) => row[col].getValue() === token)) {
        return true;
      }
    }

    // Check main diagonal
    if (board.every((row, index) => row[index].getValue() === token)) {
      return true;
    }

    // Check anti-diagonal
    if (
      board.every((row, index) => row[size - 1 - index].getValue() === token)
    ) {
      return true;
    }

    return false; // The player with the token is not winner
  };

  // This method check if all cells are occupied - tie. //
  const checkTieCase = (board) => {
    const flattenedBoard = board.flat();
    const emptyCells = flattenedBoard.filter(
      (cell) => cell.getValue() === 0
    ).length;
    return emptyCells === 0 ? true : false;
  };

  /* 
    This method plays one round by dropping a token, 
    Return true/false; true - game finished, false - game NOT finished.
  */
  const playRound = (row, column) => {
    board.dropToken(row, column, activePlayer.token);

    /*  Check if the active player is the winner. */
    if (checkWinner(board.getBoard(), activePlayer.token)) {
      winner = activePlayer; // Store the winner
      document.getElementById(
        "gameResult"
      ).textContent = `${winner.name} wins!`;
      return true; // End the game if there's a winner
    }

    /*  Check if the game is tie results. */
    if (checkTieCase(board.getBoard())) {
      document.getElementById("gameResult").textContent = "It's a tie!";
      return true;
    }

    switchPlayerTurn(); // Switch player turn
    return false;
  };

  return {
    playRound,
    getActivePlayer,
  };
}

function initialize(dimension) {
  // Reset game board
  const oldGameBoard = document.getElementById("game-board");
  if (oldGameBoard) {
    oldGameBoard.remove();
  }
  // Reset results
  const oldResult = document.getElementById("gameResult");
  oldResult.textContent = "No results yet.";

  // Initialize the game board
  const gameContainer = document.getElementById("game-container");
  const gameBoard = document.createElement("div");
  gameBoard.id = "game-board";
  gameBoard.style.gridTemplateColumns = `repeat(${dimension}, 100px)`;
  gameBoard.style.gridTemplateRows = `repeat(${dimension}, 100px)`;
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      gameBoard.appendChild(cell);
    }
  }
  gameContainer.appendChild(gameBoard);
}

function playGame(playerOneName, playerTwoName, dimension) {
  // console.log("Init game starts."); // for testing purpose

  let isGameFinished = false;
  const gameController = GameController(
    playerOneName,
    playerTwoName,
    dimension
  );

  // Create a 2d array that will represent the state of the game board
  // Row 0 - the top row, column 0 - the left-most column.
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (isGameFinished) {
        alert("Game finished! Please start a new game!");
        return;
      }
      if (
        !cell.classList.contains("PlayerOne") &&
        !cell.classList.contains("PlayerTwo")
      ) {
        // "PlayerOne" and "PlayerTwo" are also used for styling
        cell.classList.add(
          gameController.getActivePlayer().token === 1
            ? "PlayerOne"
            : "PlayerTwo"
        );

        cell.textContent =
          gameController.getActivePlayer().token === 1 ? "X" : "O";

        isGameFinished = gameController.playRound(
          cell.dataset.row,
          cell.dataset.col
        );
      } else {
        console.log("Cell already occupied!");
      }
    });
  });
}

const startBtn = document.getElementById("start");
// TODO: Future improvement: let user to input boardgame dimensions
startBtn.addEventListener("click", () => {
  const player1NameInput = document.getElementById("playerOneName").value;
  const player2NameInput = document.getElementById("playerTwoName").value;

  initialize(3);
  playGame(player1NameInput, player2NameInput, 3);
});
