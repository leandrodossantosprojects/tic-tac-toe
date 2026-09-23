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

  const cleanBoard = () => {
    board.forEach((row) => {
      row.forEach((cell) => cell.cleanValue());
    });
  };

  return {
    getBoard,
    printBoard,
    selectCell,
    getCellValue,
    cleanBoard,
  };
}

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const cleanValue = () => (value = 0);

  return {
    addToken,
    getValue,
    cleanValue,
  };
}

const DisplayMarker = () => {
  const renderMarkers = () => {
    const display = document.querySelector("html");
    const markerContainer = document.createElement("div");
    const player1Marker = document.createElement("div");
    const player2Marker = document.createElement("div");
    markerContainer.innerHTML = `${player1Marker} <div class='versus'>VS</div> ${player2Marker}`;
    player1Marker.className = "marker-p1";
    player1Marker.innerText = "0";
    player2Marker.className = "marker-p2";
    player2Marker.innerText = "0";
    display.appendChild(markerContainer);
  };

  return {
    renderMarkers,
  };
};

const DisplayBoard = () => {
  const renderBoard = (board) => {
    const display = document.querySelector("body");
    const gameBoard = document.createElement("div");
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
      wins: 0,
    },
    {
      name: playerTwoName,
      token: 2,
      wins: 0,
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

  const playGame = (row, column) => {
    //Verify if game is over
    if (gameOver === true) return;
    console.log(`${getActivePlayer().name} select a empty cell`);

    let move = board.selectCell(row, column, getActivePlayer().token);

    if (move === false) return;

    const winner = winPlays.some((play) => {
      return play.every(([x, y]) => {
        return board.getCellValue(x, y) === getActivePlayer().token;
      });
    });

    const gameIsOver = () =>
      board
        .getBoard()
        .every((row) => row.every((cell) => cell.getValue() !== 0));

    if (winner === true) {
      console.log(`${getActivePlayer().name} won this game`);
      getActivePlayer().wins += 1;
      board.printBoard();
      if (getActivePlayer().wins === 2) {
        console.log(`${getActivePlayer().name} won this match`);
        gameOver = true;
        return;
      }
      board.cleanBoard();
    }
    if (gameIsOver() === true) {
      console.log("Draw game");
      board.cleanBoard();
    }
    switchPlayerTurn();
    printNewRound();
  };

  return {
    playGame,
    getActivePlayer,
  };
}

const game = Gameflow();

// Game 1: Player 2 wins
game.playGame(1, 2);
game.playGame(0, 0);
game.playGame(2, 2);
game.playGame(0, 1);
game.playGame(1, 1);
game.playGame(0, 2);

// Game 2: Player 1 wins
game.playGame(0, 0);
game.playGame(1, 0);
game.playGame(0, 1);
game.playGame(1, 1);
game.playGame(0, 2);

// Game 3: Player 2 wins the match
game.playGame(2, 0);
game.playGame(0, 0);
game.playGame(2, 1);
game.playGame(0, 1);
game.playGame(2, 2);
