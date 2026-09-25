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

  let matchOver = false;
  let winner = "";

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

  const playMatch = (row, column) => {
    //Verify if game is over
    if (matchOver === true) return;

    console.log(`${getActivePlayer().name} select a empty cell`);
    let move = board.selectCell(row, column, getActivePlayer().token);
    if (move === false) return;

    const won = winPlays.some((play) => {
      return play.every(([x, y]) => {
        return board.getCellValue(x, y) === getActivePlayer().token;
      });
    });

    const drawGame = () => {
      board
        .getBoard()
        .every((row) => row.every((cell) => cell.getValue() !== 0));
    };

    if (won === true) {
      getActivePlayer().gamesWon += 1;
      board.printBoard();
      matchOver = true;
      if (getActivePlayer().gamesWon === 2) {
        console.log(`${getActivePlayer().name} won this match`);
        winner = getActivePlayer().name;
        return;
      }
      board.cleanBoard();
      return;
    }
    if (drawGame() === true) {
      console.log("Draw game");
      board.cleanBoard();
      matchOver = true;
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  const getStatus = () => {
    return {
      matchOver: matchOver,
      winner: winner,
    };
  };

  const startNewMatch = () => {
    matchOver = false;
  };

  const startNewGame = () => {
    winner = "";
    players.forEach((player) => (player.gamesWon = 0));
    startNewMatch();
  };

  return {
    playMatch,
    getBoard,
    getPlayers,
    getActivePlayer,
    getStatus,
    startNewMatch,
    startNewGame,
  };
}

const renderDOM = () => {
  const display = document.querySelector("body");
  const main = document.createElement("main");
  const p1Marker = document.createElement("div");
  const p1Wins = document.createElement("span");
  const p1Name = document.createElement("p");
  const p2Marker = document.createElement("div");
  const p2Wins = document.createElement("span");
  const p2Name = document.createElement("p");
  const vsText = document.createElement("div");
  //const svgX = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none">
  //    <path
  //      d="M18 6L6 18M6 6l12 12"
  //      stroke="#06b6d4"
  //      stroke-width="2.5"
  //      stroke-linecap="round"
  //      stroke-linejoin="round"
  //      filter="url(#neon-glow)"
  //    />
  //  </svg>`;
  //const svgO = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none">
  //  <circle
  //    cx="12"
  //    cy="12"
  //    r="8.5"
  //    stroke="#06b6d4"
  //    stroke-width="2.5"
  //    filter="url(#neon-glow)"
  //  />
  //</svg>`;
  //const svgXGlow = `
  //  <defs>
  //    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
  //      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#06b6d4" flood-opacity="0.9" />
  //      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#06b6d4" flood-opacity="0.5" />
  //    </filter>
  //  </defs>
  //`;
  //const svgOGlow = `
  //  <defs>
  //    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
  //      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#06b6d4" flood-opacity="0.9" />
  //      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#06b6d4" flood-opacity="0.5" />
  //    </filter>
  //  </defs>
  //
  //`;

  p1Marker.className = "marker";
  p1Marker.id = "p1-marker";
  p2Marker.className = "marker";
  p2Marker.id = "2-marker";
  p1Wins.className = "p1-wins";
  p2Wins.className = "p2-wins";

  vsText.innerText = "VS";

  const renderMarkers = (players) => {
    display.appendChild(main);
    main.appendChild(p1Marker);
    main.appendChild(vsText);
    main.appendChild(p2Marker);
    p1Marker.appendChild(p1Wins);
    p2Marker.appendChild(p2Wins);
    p1Marker.appendChild(p1Name);
    p2Marker.appendChild(p2Name);
    p1Wins.innerText = "0";
    p1Name.innerText = `${players[0].name}`;
    p2Wins.innerText = "0";
    p2Name.innerText = `${players[1].name}`;
  };

  function refreshMarkers(players) {
    p1Wins.innerText = `${players[0].gamesWon}`;
    p2Wins.innerText = `${players[1].gamesWon}`;
  }

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
          if (game.getStatus().winner !== "") {
            renderWinner(game);
            return;
          }
          if (game.getStatus().matchOver === true) {
            renderNextMatch(game);
            return;
          }
          game.playMatch(i, j);
          boardCell.innerText = `${board.getCellValue(i, j)}`;
          refreshMarkers(game.getPlayers());
        });
      }
    }
  };

  const cleanRenderedBoard = () => {
    const cells = document.getElementsByClassName("board-cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = "";
    }
  };

  const winnerModal = document.createElement("dialog");
  winnerModal.open = false;
  winnerModal.id = "win-modal";
  const winnerModalTxt = document.createElement("span");
  const nextMatchBtn = document.createElement("button");
  nextMatchBtn.className = "dialog-btn";
  nextMatchBtn.innerText = "Play Again!";
  winnerModal.appendChild(winnerModalTxt);
  winnerModal.appendChild(nextMatchBtn);
  display.appendChild(winnerModal);

  const renderWinner = (game) => {
    winnerModalTxt.innerText = `${game.getActivePlayer().name} won!`;
    winnerModal.open = true;
    nextMatchBtn.addEventListener("click", () => {
      game.getBoard().cleanBoard();
      cleanRenderedBoard();
      game.startNewGame();
      winnerModal.open = false;
    });
  };

  const nextGameModal = document.createElement("dialog");
  nextGameModal.open = false;
  nextGameModal.id = "next-game-modal";
  const nextGameModalTxt = document.createElement("span");
  const nextGameBtn = document.createElement("button");
  nextGameBtn.className = "dialog-btn";
  nextGameBtn.innerText = "Next game";
  nextGameModal.appendChild(nextGameModalTxt);
  nextGameModal.appendChild(nextGameBtn);
  display.appendChild(nextGameModal);

  const renderNextMatch = (game) => {
    nextGameModalTxt.innerText = `${game.getActivePlayer().name} won!`;
    nextGameModal.open = true;
    nextGameBtn.addEventListener("click", () => {
      game.getBoard().cleanBoard();
      cleanRenderedBoard();
      nextGameModal.open = "false";
      game.startNewMatch();
      nextGameModal.open = false;
    });
  };

  return {
    renderMarkers,
    renderBoard,
    renderWinner,
    cleanRenderedBoard,
    renderNextMatch,
  };
};

const play = () => {
  const game = Gameflow();
  const board = game.getBoard();
  const render = renderDOM();

  render.renderMarkers(game.getPlayers());
  render.renderBoard(board, game);
};

play();

console.log(Gameflow().getStatus());
// Game 1: Player 2 gamesWon
//game.playMatch(1, 2);
//game.playMatch(0, 0);
//game.playMatch(2, 2);
//game.playMatch(0, 1);
//game.playMatch(1, 1);
//game.playMatch(0, 2);
//
//// Game 2: Player 1 gamesWon
//game.playMatch(0, 0);
//game.playMatch(1, 0);
//game.playMatch(0, 1);
//game.playMatch(1, 1);
//game.playMatch(0, 2);
//
//// Game 3: Player 2 gamesWon the match
//game.playMatch(2, 0);
//game.playMatch(0, 0);
//game.playMatch(2, 1);
//game.playMatch(0, 1);
//game.playMatch(2, 2);
