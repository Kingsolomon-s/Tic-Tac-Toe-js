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

  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  return { getBoard, setMark, resetBoard, checkWinner, Player: createPlayer };
})();

const gameController = (function () {
  const player1 = gameBoard.Player("Player 1", "X");
  const player2 = gameBoard.Player("Player 2", "O");

  let currentPlayer = player1;
  let gameActive = true;

  const makeMove = (row, col) => {
    if (!gameActive) return `Game Over`;
    const markSucess = gameBoard.setMark(row, col, currentPlayer.marker);
    if (!markSucess) return `Invalid Choice`;

    return announceWinner();
  };

  const announceWinner = () => {
    const winner = gameBoard.checkWinner();

    if (winner) {
      gameActive = false;
    }

    if (winner === currentPlayer.marker) {
      return `${currentPlayer.name} wins!`;
    } else if (winner === "draw") {
      return `It's a draw`;
    } else {
      return switchTurns();
    }
  };

  const switchTurns = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    return `${currentPlayer.name}'s turn`;
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
  const gameContainer = document.querySelector(".game-container");
  const game = document.querySelector(".game");
  const statusPara = document.createElement("div");
  gameContainer.appendChild(statusPara);

  const renderBoard = () => {
    game.innerHTML = "";
    const board = gameBoard.getBoard();
    console.log(board);
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
    const result = gameController.makeMove(row, col);
    updateStatus(result);
    renderBoard();
  };

  const updateStatus = (
    message = `${gameController.getCurrentPlayer().name}'s turn`
  ) => {
    statusPara.textContent = message;
  };
  return {
    renderBoard,
  };
})();

displayGame.renderBoard();
