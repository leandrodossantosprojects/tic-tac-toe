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

const renderDOM = () => {
  const display = document.querySelector("body");
  const main = document.createElement("main");
  const p1Marker = document.createElement("div");
  const p1Name = document.createElement("p");
  const p2Marker = document.createElement("div");
  const p2Name = document.createElement("p");
  const vsText = document.createElement("div");

  p1Marker.className = "marker";
  p1Marker.id = "p1-marker";
  p2Marker.className = "marker";
  p2Marker.id = "2-marker";

  vsText.innerText = "VS";

  const renderMarkers = (players) => {
    display.appendChild(main);
    main.appendChild(p1Marker);
    main.appendChild(vsText);
    main.appendChild(p2Marker);
    p1Marker.appendChild(p1Name);
    p2Marker.appendChild(p2Name);
    p1Marker.innerText = `${players[0].gamesWon}`;
    p1Name.innerText = `${players[0].name}`;
    p2Marker.innerText = `${players[1].gamesWon}`;
    p2Name.innerText = `${players[1].name}`;
  };

  const gameBoard = document.createElement("div");
  gameBoard.className = "board";

  const renderBoard = (board, game) => {
    display.appendChild(gameBoard);
    for (let i = 0; i < 3; i++) {
      const boardRow = document.createElement("div");
      boardRow.className = "board-row";
      gameBoard.appendChild(boardRow);
      for (let j = 0; j < 3; j++) {
        const boardCell = document.createElement("div");
        boardCell.className = "board-cell";
        boardCell.innerText = `${board.getCellValue(i, j)}`;
        boardRow.appendChild(boardCell);
        boardCell.addEventListener("click", () => {
          game.playGame(i, j);
          boardCell.innerText = `${board.getCellValue(i, j)}`;
        });
      }
    }
  };

  const winnerModal = document.createElement("dialog");
  winnerModal.open = false;
  winnerModal.id = "win-modal";

  const renderWinner = (player) => {
    winnerModal.innerText = `${player.name} won!`;
    winnerModal.open = true;
    display.appendChild(winnerModal);
  };

  return {
    renderMarkers,
    renderBoard,
    renderWinner,
  };
};

function Gameflow(playerOneName = "Player 1", playerTwoName = "Player 2") {
  const board = Gameboard();
  const getBoard = () => board;
  const players = [
    {
      name: playerOneName,
      token: 1,
      gamesWon: 0,
    },
    {
      name: playerTwoName,
      token: 2,
      gamesWon: 0,
    },
  ];
  let getPlayers = () => {
    return players;
  };
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
  let winner;

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

    const won = winPlays.some((play) => {
      return play.every(([x, y]) => {
        return board.getCellValue(x, y) === getActivePlayer().token;
      });
    });

    const gameIsOver = () =>
      board
        .getBoard()
        .every((row) => row.every((cell) => cell.getValue() !== 0));

    if (won === true) {
      console.log(`${getActivePlayer().name} won this game`);
      getActivePlayer().gamesWon += 1;
      board.printBoard();
      if (getActivePlayer().gamesWon === 2) {
        console.log(`${getActivePlayer().name} won this match`);
        winner = getActivePlayer().name;
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

  const getWinner = () => winner;

  return {
    playGame,
    getBoard,
    getPlayers,
    getActivePlayer,
    getWinner,
  };
}

const play = () => {
  const game = Gameflow();
  const board = game.getBoard();
  const render = renderDOM();

  render.renderMarkers(game.getPlayers());
  render.renderBoard(board, game);
};

play();

// Game 1: Player 2 gamesWon
//game.playGame(1, 2);
//game.playGame(0, 0);
//game.playGame(2, 2);
//game.playGame(0, 1);
//game.playGame(1, 1);
//game.playGame(0, 2);
//
//// Game 2: Player 1 gamesWon
//game.playGame(0, 0);
//game.playGame(1, 0);
//game.playGame(0, 1);
//game.playGame(1, 1);
//game.playGame(0, 2);
//
//// Game 3: Player 2 gamesWon the match
//game.playGame(2, 0);
//game.playGame(0, 0);
//game.playGame(2, 1);
//game.playGame(0, 1);
//game.playGame(2, 2);
