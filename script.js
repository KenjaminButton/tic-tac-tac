// Initialize game variables
let currentPlayer = 'X';  // Track current player (X or O)
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Represent the game board state
let gameActive = true;  // Track if game is still active

// Get DOM elements
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('resetBtn');

// Update the status message to show current player
function updateStatus() {
    status.textContent = `Player ${currentPlayer}'s turn`;
}

// Initialize the game
function initGame() {
    updateStatus();
}

// Handle a player's move
function handleMove(clickedCell, clickedCellIndex) {
    // If cell is already filled or game is not active, ignore the click
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the game board and cell display
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Check if current player has won
    if (checkWin()) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    // Check if game is a draw
    if (checkDraw()) {
        status.textContent = "Game is a draw!";
        gameActive = false;
        return;
    }

    // Switch to next player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

// Check for win conditions
function checkWin() {
    const winConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left
        [2, 4, 6]  // Diagonal from top-right
    ];

    // Check each winning combination
    return winConditions.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] !== '' &&
               gameBoard[a] === gameBoard[b] &&
               gameBoard[a] === gameBoard[c];
    });
}

// Check if game is a draw
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear all cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
    
    updateStatus();
}

// Add click event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleMove(cell, index));
});

// Add click event listener to reset button
resetButton.addEventListener('click', resetGame);

// Start the game
initGame();
