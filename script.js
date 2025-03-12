// Initialize game variables
let currentPlayer = 'X';  // Track current player (X or O)
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Represent the game board state
let gameActive = true;  // Track if game is still active
let playerName = ''; // Store player's name

// Player Selection Logic
const playerSelection = document.getElementById('playerSelection');
const gameContainer = document.getElementById('gameContainer');
const chooseXButton = document.getElementById('chooseX');
const chooseOButton = document.getElementById('chooseO');
const playerNameInput = document.getElementById('playerName');

// Get DOM elements
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('resetBtn');

// Update the status message to show current player
function updateStatus() {
    const currentPlayerName = currentPlayer === playerName.symbol ? playerName.name : 'Player 2';
    status.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
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
        celebrateWin();
        const winner = currentPlayer === playerName.symbol ? playerName.name : 'Player 2';
        status.textContent = `${winner} wins!`;
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
    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left
        [2, 4, 6]  // Diagonal from top-right
    ];

    for (let i = 0; i <= 7; i++) {
        const [a, b, c] = winningConditions[i];
        if (
            gameBoard[a] !== '' &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            // Highlight winning cells
            document.querySelector(`[data-index="${a}"]`).classList.add('winner');
            document.querySelector(`[data-index="${b}"]`).classList.add('winner');
            document.querySelector(`[data-index="${c}"]`).classList.add('winner');
            return true;
        }
    }
    return false;
}

// Check if game is a draw
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = playerName.symbol;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); // Remove winner highlight
    });
    updateStatus();
}

// Handle player symbol selection
function handleSymbolSelection(symbol) {
    // Validate name input
    const name = playerNameInput.value.trim();
    if (!name) {
        alert('Please enter your name first!');
        return;
    }
    
    // Store player info
    playerName = {
        name: name,
        symbol: symbol
    };
    
    // Set the initial player
    currentPlayer = symbol;
    
    // Hide selection screen and show game board
    playerSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    
    // Initialize the game with selected symbol
    initGame();
}

// Add click event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleMove(cell, index));
});

// Add click event listener to reset button
resetButton.addEventListener('click', resetGame);

// Add click handlers for symbol selection
chooseXButton.addEventListener('click', () => handleSymbolSelection('X'));
chooseOButton.addEventListener('click', () => handleSymbolSelection('O'));

// Function to celebrate a win
function celebrateWin() {
    // Create multiple bursts of confetti that repeat
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        spread: 360,
        ticks: 100,  // Increased ticks for longer duration
        gravity: 0,
        decay: 0.97, // Slower decay for longer-lasting confetti
        startVelocity: 30,
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    // Function to create one round of celebrations
    function celebrationRound(delay) {
        setTimeout(() => {
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.94,
                scalar: 0.8,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.95,
                scalar: 1.2,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }, delay);
    }

    // Trigger 5 rounds of celebration with delays
    for (let i = 0; i < 5; i++) {
        celebrationRound(i * 1500); // Space out each round by 1.5 seconds
    }
}

// Start the game
// initGame();
