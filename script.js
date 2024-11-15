let currentPlayer = 'X';
let gameMode = null;
let gameBoard = Array(9).fill('');
let gameActive = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function setGameMode(mode) {
    gameMode = mode;
    gameActive = true;
    resetGame();
    updateStatus(`${mode === '2player' ? 'Two Player' : 'vs AI'} mode - X's turn`);
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function makeMove(index) {
    if (!gameActive || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    document.querySelector(`[data-index="${index}"]`).textContent = currentPlayer;
    document.querySelector(`[data-index="${index}"]`).classList.add(currentPlayer);

    if (checkWinner()) {
        gameActive = false;
        updateStatus(`Player ${currentPlayer} wins!`);
        return;
    }

    if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        updateStatus("It's a draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);

    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeAIMove() {
    if (!gameActive) return;
    let moveIndex = findBestMove();
    makeMove(moveIndex);
}

function findBestMove() {
    // First, try to win
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            if (checkWinner()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }

    // Second, block player's winning move
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'X';
            if (checkWinner()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }

    // Third, try to take center
    if (gameBoard[4] === '') return 4;

    // Finally, take any available corner or side
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameBoard[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available spot
    const availableSpots = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function resetGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });

    if (gameMode) {
        updateStatus(`${gameMode === '2player' ? 'Two Player' : 'vs AI'} mode - X's turn`);
    } else {
        updateStatus('Select game mode to start');
    }
}

// Add click event listeners to all cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameMode) {
            updateStatus('Please select a game mode first!');
            return;
        }
        const index = parseInt(cell.getAttribute('data-index'));
        makeMove(index);
    });
});