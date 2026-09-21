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

  const getCellValue = (row, column) => {
    const values = board[row][column].getValue();
    return values;
  };

  return {
    getBoard,
    printBoard,
    selectCell,
    getCellValue,
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

const DisplayBoard = () => {
  const renderBoard = (board) => {
    const display = document.querySelector("html");
    const gameBoard = document.createElement("div");
    display.innerHTML = "";
    display.appendChild(gameBoard);
    gameBoard.className = "board";
    for (let i = 0; i < 3; i++) {
      const boardRow = document.createElement("div");
      boardRow.className = "board-row";
      gameBoard.appendChild(boardRow);
      for (let j = 0; j < 3; j++) {
        const boardCell = document.createElement("div");
        boardCell.className = "board-cell";
        boardCell.innerText = `${board.getCellValue(i, j)}`;
        boardRow.appendChild(boardCell);
      }
    }
  };

  return {
    renderBoard,
  };
};

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

  const winPlays = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];

  const playRound = (row, column) => {
    //Verify if game is over
    if (gameOver === true) return;
    // Drop a token for the current player
    console.log(`${getActivePlayer().name} select a empty cell`);

    let round = board.selectCell(row, column, getActivePlayer().token);
    /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
    const winner = winPlays.some((play) => {
      return play.every(([x, y]) => {
        return board.getCellValue(x, y) === getActivePlayer().token;
      });
    });

    // Switch player turn
    if (round === true) {
      if (winner === true) {
        gameOver = true;
        console.log(`${getActivePlayer().name} won`);
        return;
      } else {
        DisplayBoard().renderBoard(board);
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

const game = Gameflow();

game.playRound(1, 2);
game.playRound(0, 0);
game.playRound(2, 2);
game.playRound(0, 1);
game.playRound(1, 1);
game.playRound(0, 2);
