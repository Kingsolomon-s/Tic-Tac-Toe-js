const gameBoard = (function () {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const getBoard = () => board;

  const setMark = (row, col, mark) => {
    if (board[row][col] === "") {
      board[row][col] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = "";
      }
    }
  };

  const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
      //check for row win
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return board[i][0];
      }
    }

    //check for column
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return board[0][i];
      }
    }

    //check for diagonal
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }
    if (
      board.every((row) => {
        return row.every((cell) => cell);
      })
    ) {
      return "draw";
    }
    return null;
  };

  return { getBoard, setMark, resetBoard, checkWinner };
})();

const playerFactory = (function () {
  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  return {
    Player: createPlayer,
  };
})();

const score = (function () {
  let player1Score = 0;
  let player2Score = 0;
  let roundPlayed = 0;
  let maxRound = 0;
  let gameOver = false;

  const setMaxRound = (value) => {
    maxRound = value;
  };

  const updateScore = () => {
    const player1Para = document.querySelector(".player1");
    const player2Para = document.querySelector(".player2");

    const player1ScoreDiv = document.querySelector(".player-1-score");
    const player2ScoreDiv = document.querySelector(".player-2-score");

    player1Para.textContent = `Player 1 `;
    player1ScoreDiv.textContent = `${player1Score}  - `;
    player2ScoreDiv.textContent = ` ${player2Score}`;
    player2Para.textContent = `Player 2`;
  };

  const updatePlayer1Score = () => {
    player1Score++;
    updateScore();
  };

  const updatePlayer2Score = () => {
    player2Score++;
    updateScore();
  };

  const updateDraw = () => {
    updateScore();
  };

  const incrementRound = () => {
    roundPlayed++;
  };

  const getRound = () => roundPlayed;

  const isGameOver = () => gameOver || roundPlayed >= maxRound;

  const setGameOver = () => {
    gameOver = true;
  };

  const reset = () => {
    player1Score = 0;
    player2Score = 0;
    roundPlayed = 0;
    gameOver = false;
    updateScore();
  };

  return {
    updatePlayer1Score,
    updatePlayer2Score,
    updateDraw,
    getRound,
    isGameOver,
    reset,
    getPlayer1Score: () => player1Score,
    getPlayer2Score: () => player2Score,
    setMaxRound,
    incrementRound,
    setGameOver,
  };
})();

const gameController = (function () {
  const player1 = playerFactory.Player("Player 1", "X");
  const player2 = playerFactory.Player("Player 2", "O");

  let currentPlayer = player1;
  let gameActive = true;

  const makeMove = (row, col) => {
    if (!gameActive) return;
    const markSucess = gameBoard.setMark(row, col, currentPlayer.marker);
    if (!markSucess) return `Invalid Choice`;

    return announceWinner();
  };

  const announceWinner = () => {
    const winner = gameBoard.checkWinner();
    if (winner === currentPlayer.marker) {
      gameActive = false;
      if (currentPlayer.marker === "X") {
        score.updatePlayer1Score();
      } else {
        score.updatePlayer2Score();
      }
      addScoreBg();
      scheduleReset();
      return `${currentPlayer.name}  wins!`;
    } else if (winner === "draw") {
      gameActive = false;
      score.updateDraw();
      addScoreBg();
      scheduleReset();
      return `Draw`;
    } else {
      return switchTurns();
    }
  };

  function addScoreBg() {
    const scoreEl = document.querySelector(".score");
    scoreEl.classList.add("score-bg");
  }

  const scheduleReset = () => {
    setTimeout(() => {
      score.incrementRound();

      if (score.isGameOver()) {
        const player1Score = score.getPlayer1Score();
        const player2Score = score.getPlayer2Score();

        score.setGameOver();

        if (player1Score > player2Score) {
          displayGame.updateStatus(
            `Wasted(${player2.name}) <br> ${player1.name} wins 🏆`
          );
        } else if (player2Score > player1Score) {
          displayGame.updateStatus(
            `Wasted(${player1.name}) <br> ${player2.name} wins 🏆`
          );
        } else {
          displayGame.updateStatus("🤝 It's an overall draw!");
        }

        return;
      }

      const resetMessage = resetGame();
      displayGame.removeStatusBg();
      displayGame.renderBoard();
      displayGame.updateStatus();
    }, 1500);
  };

  const switchTurns = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    return `${currentPlayer.name}'s  turn`;
  };

  const resetGame = () => {
    gameActive = true;
    currentPlayer = player1;
    gameBoard.resetBoard();
    return `New Game: Player 1 starts.`;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  return {
    makeMove,
    resetGame,
    getCurrentPlayer,
  };
})();

const displayGame = (function () {
  const game = document.querySelector(".game");
  const statusPara = document.querySelector(".status-para");

  const renderBoard = () => {
    game.innerHTML = "";
    const board = gameBoard.getBoard();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.textContent = cell;

        if (cell === "X") {
          gridCell.classList.add("color-x");
        } else if (cell === "O") {
          gridCell.classList.add("color-o");
        }

        gridCell.addEventListener("click", () =>
          handleCellClick(rowIndex, colIndex)
        );
        game.appendChild(gridCell);
      });
    });
  };

  const handleCellClick = (row, col) => {
    if (score.isGameOver()) return;
    const result = gameController.makeMove(row, col);
    updateStatus(result);
    renderBoard();
  };

  const resetGameButton = () => {
    const resetButton = document.querySelector(".reset");
    resetButton.addEventListener("click", () => {
      gameController.resetGame();
      updateStatus();
      removeStatusBg();
      score.reset();
      renderBoard();
    });
  };

  const updateStatus = (
    message = `${gameController.getCurrentPlayer().name}'s turn`
  ) => {
    const roundInfo = `Round ${score.getRound() + 1}`;

    if (score.isGameOver()) {
      statusPara.innerHTML = message;
    } else {
      statusPara.innerHTML = `${message} <br> ${roundInfo}`;
    }

    if (message) {
      statusPara.classList.add("status-bg");
    }
  };

  const removeStatusBg = () => {
    statusPara.classList.remove("status-bg");
  };

  const init = () => {
    renderBoard();
    resetGameButton();
    updateStatus();
  };

  return {
    renderBoard,
    removeStatusBg,
    updateStatus,
    init,
  };
})();

const homePage = (function () {
  const homeScreen = document.querySelector(".home");
  const gameContainer = document.querySelector(".game-screen");
  const play = document.querySelector(".solo");

  const switchScreen = (from, to) => {
    from.classList.remove("active");
    to.classList.add("active");
  };

  const getModeValue = () => {
    const selectedMode = document.querySelector('input[name="mode"]:checked');
    if (!selectedMode) {
      alert("Please select a mode.");
      return;
    }
    const rounds = selectedMode ? Number(selectedMode.value) : 3;
    console.log(rounds);
    score.setMaxRound(rounds);
  };

  const playButton = () => {
    play.addEventListener("click", () => {
      getModeValue();
      switchScreen(homeScreen, gameContainer);
    });
  };
  return {
    playButton,
  };
})();

homePage.playButton();
displayGame.init();
