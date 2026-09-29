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

  let matchOver = false;
  let matchWinner = "";
  let matchResult = "";
  let winner = "";
  let winningPlay = [];

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

    let move = board.selectCell(row, column, getActivePlayer().token);
    if (move === false) return;

    const won = winPlays.find((play) => {
      return play.every(([x, y]) => {
        return board.getCellValue(x, y) === getActivePlayer().token;
      });
    });

    const draw = () => {
      return board
        .getBoard()
        .every((row) => row.every((cell) => cell.getValue() !== 0));
    };

    if (won) {
      getActivePlayer().gamesWon += 1;
      board.printBoard();
      matchOver = true;
      matchResult = "player won";
      matchWinner = getActivePlayer();
      winningPlay = won;
      if (getActivePlayer().gamesWon === 2) {
        winner = getActivePlayer().name;
        return;
      }
      return;
    }
    if (draw() === true) {
      matchOver = true;
      matchResult = "draw";
      return;
    }
    switchPlayerTurn();
  };

  const getGameStatus = () => {
    return {
      matchOver: matchOver,
      matchWinner: matchWinner,
      winningPlay: winningPlay,
      winner: winner,
      matchResult: matchResult,
    };
  };

  const startNewMatch = () => {
    matchOver = false;
    board.cleanBoard();
    matchWinner = "";
    matchResult = "";
    winningPlay = null;
    switchPlayerTurn();
  };

  const startNewGame = () => {
    players.forEach((player) => (player.gamesWon = 0));
    winner = "";
    startNewMatch();
  };

  return {
    playMatch,
    getBoard,
    getPlayers,
    getActivePlayer,
    getGameStatus,
    startNewMatch,
    startNewGame,
  };
}

const renderDOM = () => {
  const display = document.querySelector("body");
  const main = document.createElement("main");
  const markersCont = document.createElement("div");
  const p1Marker = document.createElement("div");
  const p1Wins = document.createElement("span");
  const p1Name = document.createElement("p");
  const p2Marker = document.createElement("div");
  const p2Wins = document.createElement("span");
  const p2Name = document.createElement("p");
  const vsText = document.createElement("div");
  const svgNS = "http://www.w3.org/2000/svg";
  const svgX = document.createElementNS(svgNS, "svg");
  const svgO = document.createElementNS(svgNS, "svg");
  const pathSvgX = `
     <path
       d="M18 6L6 18M6 6l12 12"
       stroke="#ffffff"
       stroke-width="2"
       stroke-linecap="round"
       stroke-linejoin="round"
       filter="url(#white-glow)"
     />
  `;
  const pathSvgO = `
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke="#ffffff"
      stroke-width="2"
      filter="url(#white-glow)"
    />
  `;
  const whiteGlow = `
  <defs>
    <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5"
        flood-color="#ffffff" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="5"
        flood-color="#ffffff" flood-opacity="0.5" />
    </filter>
  </defs>
  `;
  const greenGlow = `
  <defs>
    <filter id="green-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5"
        flood-color="#2dfe54" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="5"
        flood-color="#2dfe54" flood-opacity="0.5" />
    </filter>
  </defs>
  `;
  const redGlow = `
  <defs>
    <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5"
        flood-color="#f80e0b" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="5"
        flood-color="#f80e0b" flood-opacity="0.5" />
    </filter>
  </defs>
  `;

  function changeFilterDrawGame() {
    const tokens = document.getElementsByClassName("token");
    for (let i = 0; i < tokens.length; i++) {
      console.log(tokens[i]);
      const path = tokens[i].childNodes[1];
      path.setAttribute("filter", "url(#red-glow)");
    }
  }

  function changeFilterWonGame(play) {
    const winningColor = "#2dfe54";
    play.forEach((cell) => {
      const coordinate = `${cell[0]}-${cell[1]}`;
      const token = document.getElementById("cell-" + coordinate).firstChild;
      token.firstElementChild.setAttribute("stroke", winningColor);
      token.firstElementChild.setAttribute("filter", "url(#green-glow)");
    });
  }

  function changeSvgColor(color) {
    const svgs = document.getElementsByTagName("svg");
    for (let i = 0; i < svgs.length; i++) {
      svgs[i].childNodes[1].setAttribute("stroke", color);
    }
  }

  const whiteGlowFilter = document.createElementNS(svgNS, "svg");
  whiteGlowFilter.innerHTML = whiteGlow;
  whiteGlowFilter.class = "white-glow-filter";
  whiteGlowFilter.setAttribute("width", "0");
  whiteGlowFilter.setAttribute("height", "0");
  whiteGlowFilter.style.position = "absolute";
  whiteGlowFilter.style.overflow = "hidden";
  document.body.appendChild(whiteGlowFilter);

  const redGlowFilter = document.createElementNS(svgNS, "svg");
  redGlowFilter.innerHTML = redGlow;
  redGlowFilter.class = "red-glow-filter";
  redGlowFilter.setAttribute("width", "0");
  redGlowFilter.setAttribute("height", "0");
  redGlowFilter.style.position = "absolute";
  redGlowFilter.style.overflow = "hidden";
  document.body.appendChild(redGlowFilter);

  const greenGlowFilter = document.createElementNS(svgNS, "svg");
  greenGlowFilter.innerHTML = greenGlow;
  greenGlowFilter.class = "green-glow-filter";
  greenGlowFilter.setAttribute("width", "0");
  greenGlowFilter.setAttribute("height", "0");
  greenGlowFilter.style.position = "absolute";
  greenGlowFilter.style.overflow = "hidden";
  document.body.appendChild(greenGlowFilter);

  svgX.setAttribute("viewBox", "0 0 24 24");
  svgX.setAttribute("fill", "none");
  svgO.setAttribute("viewBox", "0 0 24 24");
  svgO.setAttribute("fill", "none");
  svgO.setAttribute("class", "token");
  svgX.setAttribute("class", "token");
  svgX.innerHTML = pathSvgX;
  svgO.innerHTML = pathSvgO;

  markersCont.className = "markers";
  p1Marker.className = "marker";
  p1Marker.id = "p1-marker";
  p2Marker.className = "marker";
  p2Marker.id = "p2-marker";
  p1Wins.className = "wins";
  p2Wins.className = "wins";
  p1Wins.id = "p1-wins";
  p2Wins.id = "p2-wins";
  p1Name.className = "name";
  p2Name.className = "name";
  vsText.className = "vs";
  vsText.innerText = "VS";

  const renderMarkers = (players) => {
    display.appendChild(main);
    main.appendChild(markersCont);
    markersCont.appendChild(p1Marker);
    markersCont.appendChild(vsText);
    markersCont.appendChild(p2Marker);
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
    main.appendChild(gameBoard);

    const nextMatchModal = document.createElement("dialog");
    nextMatchModal.open = false;
    nextMatchModal.id = "next-match";
    const nextMatchModalTxt = document.createElement("span");
    const nextMatchBtn = document.createElement("button");
    nextMatchBtn.className = "dialog-btn";
    nextMatchBtn.innerText = "Next match";
    nextMatchModal.appendChild(nextMatchModalTxt);
    nextMatchModal.appendChild(nextMatchBtn);
    display.appendChild(nextMatchModal);

    nextMatchBtn.addEventListener("click", () => {
      cleanRenderedBoard();
      game.startNewMatch();
      nextMatchModal.close();
      changeSvgColor("#ffffff");
    });

    const renderMatchOver = (game) => {
      if (game.getGameStatus().matchResult === "draw") {
        nextMatchModalTxt.innerText = `Draw Game`;
        const drawColor = "#f80e0b";
        changeFilterDrawGame();
        changeSvgColor(drawColor);
      }
      if (game.getGameStatus().matchResult === "player won") {
        const winningPlay = game.getGameStatus().winningPlay;
        changeFilterWonGame(winningPlay);
        nextMatchModalTxt.innerText = `${game.getActivePlayer().name} won!`;
      }
      nextMatchModal.showModal();
    };

    const winnerModal = document.createElement("dialog");
    winnerModal.open = false;
    winnerModal.id = "win-modal";
    const winnerModalTxt = document.createElement("span");
    const nextGameBtn = document.createElement("button");
    nextGameBtn.className = "dialog-btn";
    nextGameBtn.innerText = "Play Again!";
    winnerModal.appendChild(winnerModalTxt);
    winnerModal.appendChild(nextGameBtn);
    display.appendChild(winnerModal);

    const renderWinner = (game) => {
      const winningPlay = game.getGameStatus().winningPlay;
      changeFilterWonGame(winningPlay);
      winnerModalTxt.innerText = `${game.getActivePlayer().name} won!`;
      winnerModal.open = true;
    };

    nextGameBtn.addEventListener("click", () => {
      game.getBoard().cleanBoard();
      cleanRenderedBoard();
      winnerModal.open = false;
      game.startNewGame();
      refreshMarkers(game.getPlayers());
      changeSvgColor("#ffffff");
    });

    for (let i = 0; i < 3; i++) {
      const boardRow = document.createElement("div");
      boardRow.className = "row";
      gameBoard.appendChild(boardRow);
      for (let j = 0; j < 3; j++) {
        const boardCell = document.createElement("div");
        boardCell.className = "cell";
        coordinates = `${i}-${j}`;
        boardCell.id = `cell-${coordinates}`;
        boardRow.appendChild(boardCell);
        boardCell.addEventListener("click", () => {
          if (game.getGameStatus().matchOver === true) return;
          game.playMatch(i, j);
          console.log(game.getGameStatus());
          if (boardCell.innerHTML !== "") {
            return;
          }
          if (board.getCellValue(i, j) === 1) {
            const value = svgO.cloneNode(true);
            boardCell.appendChild(value);
          } else {
            const value = svgX.cloneNode(true);
            boardCell.appendChild(value);
          }
          refreshMarkers(game.getPlayers());
          if (game.getGameStatus().winner !== "") {
            renderWinner(game);
            return;
          }
          if (game.getGameStatus().matchResult !== "") {
            renderMatchOver(game);
            return;
          }
        });
      }
    }
  };

  const cleanRenderedBoard = () => {
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = "";
    }
  };

  return {
    renderMarkers,
    renderBoard,
    cleanRenderedBoard,
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
