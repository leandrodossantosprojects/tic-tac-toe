function Gameboard() {
  let board = [];
  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const selectCell = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      return false;
    } else {
      board[row][column].addToken(player);
      return true;
    }
  };
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues[0]);
    console.log(boardWithCellValues[1]);
    console.log(boardWithCellValues[2]);
  };

  return {
    getBoard,
    printBoard,
    selectCell,
  };
}

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

function Gameflow(playerOneName = "Player 1", playerTwoName = "Player 2") {
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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  let gameOver = false;

  const playRound = (row, column) => {
    if (gameOver === true) return;

    // Drop a token for the current player
    console.log(`${getActivePlayer().name} select a empty cell`);

    let round = board.selectCell(row, column, getActivePlayer().token);
    /*  This is where we would check for a winner and handle that logic,
          such as a win message. */

    // Switch player turn
    if (round === true) {
      if (jugadaGanadora(board, getActivePlayer().name) === true)
        gameOver = true;
      else {
        switchPlayerTurn();
        printNewRound();
      }
    } else {
      console.log(
        `${getActivePlayer().name} can't select ocuppied cell, select other cell`,
      );
      return;
    }
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const jugadaGanadora = (gameboard, player) => {
  const gameBoard = gameboard.getBoard();
  const boardWithCellValues = gameBoard.map((row) =>
    row.map((cell) => cell.getValue()),
  );
  if (
    boardWithCellValues[0][0] !== 0 &&
    boardWithCellValues[0][0] === boardWithCellValues[0][1] &&
    boardWithCellValues[0][2] === boardWithCellValues[0][1]
  ) {
    gameboard.printBoard();
    console.log(`${player} win`);
    return true;
  } else {
    return false;
  }
};

const game = Gameflow();

game.playRound(1, 2);
game.playRound(1, 2);
game.playRound(0, 2);
game.playRound(2, 2);
game.playRound(0, 1);
game.playRound(1, 1);
game.playRound(0, 0);
game.playRound(2, 0);
