console.log("Check JS file link");

// Reference: code structure refer to below link:
//  https://replit.com/@40percentzinc/ConnectFourConsole#script.js

/*
 ** A Cell represents one "square" on the board and can have one of values below
 ** value == 0: no token is in the square,
 ** value == 1: occupied by Player One's token,
 ** value == 2: occupied by Player Two's token

 ** The function includes two methods:
 ** 1. addToken: accept a player's token to change the value of the cell
 ** 2. getValue: retrieve the current value of this cell

 ** Note: 
 ** This function does not check whether the token is occupied or not
 ** Whether the action is allowed or not should be included in controller related functions (see below)
 */

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/*
 ** The Gameboard represents the state of the board, each equare holds a Cell.
 ** This function includes following methods:
 ** 1. printBoard: used to print our board to the console, helpful during development, won't need it after we build our UI.
 ** 2. getBoard: get the entire board that our UI will eventually need to render it.()
 ** 3. dropToken (row, column, player): drop player's token at cell[row, column]
 */

function Gameboard() {
  // Init game board
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // Row 0 - the top row, column 0 - the left-most column.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    ); // iterate each row; for each row, iterate each cell
    console.log(boardWithCellValues);
  };

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue) {
      board[row][column].addToken(player);
    } else {
      // TODO: temp testing, to be deleted.
      console.log("Tried to drop token in occupied cell.");
    }
  };

  // Provide an interface for the rest of our application to interact with the board.
  return { getBoard, dropToken, printBoard };
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
  playerTwoName = "PlayerTwo"
) {
  const board = Gameboard();

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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    board.dropToken(row, column, getActivePlayer().token);

    // TODO: add below logic
    /*  This is where we would check for a winner and handle that logic,
          such as a win message. */

    switchPlayerTurn(); // Switch player turn
    board.printBoard(); // print updated board
  };

  // Initial play game message
  // TODO: temp testing, to be deleted.
  console.log("Init game starts.");
  board.printBoard();
  console.log(`${getActivePlayer().name}'s turn.`);
  console.log("Init game finished.");

  // TODO: check below comments
  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
// TODO: temp testing, to be deleted.
game.playRound(1, 1);
game.playRound(2, 1);
