// =============== GAME VARIABLES ===============
// Store all the important game information
export const gameState = {
    board: ['', '', '', '', '', '', '', '', ''], // Empty board (9 cells)
    isActive: true,                              // Is game still being played?
    scores: {
        player: 0,
        computer: 0,
        draws: 0
    },
    player: {
        name: '',
        symbol: ''  // Will be 'X' or 'O'
    },
    computerSymbol: '',  // Will be opposite of player's symbol
    isPlayerTurn: true   // Track whose turn it is
};

// =============== DOM ELEMENTS ===============
// Get all the HTML elements we need to work with
export const elements = {
    cells: document.querySelectorAll('.cell'),           // All game board cells
    status: document.getElementById('status'),           // Game status message
    resetBtn: document.getElementById('resetBtn'),       // Reset game button
    playerSetup: document.getElementById('playerSelection'), // Player setup screen
    gameBoard: document.getElementById('gameContainer'),     // Main game screen
    nameInput: document.getElementById('playerName'),        // Player name input
    scoreDisplay: {
        player: document.getElementById('playerScore'),
        computer: document.getElementById('computerScore'),
        draws: document.getElementById('drawScore'),
        nameDisplay: document.getElementById('playerNameDisplay')
    }
};

// =============== GAME SETUP ===============
// Handle when player chooses X or O
export function startGame(chosenSymbol) {
    // Make sure player entered their name
    const playerName = elements.nameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name first!');
        return false;
    }

    // Save player information
    gameState.player.name = playerName;
    gameState.player.symbol = chosenSymbol;
    gameState.computerSymbol = chosenSymbol === 'X' ? 'O' : 'X';
    gameState.isPlayerTurn = true;
    
    // Show game board, hide setup screen
    elements.playerSetup.style.display = 'none';
    elements.gameBoard.style.display = 'block';
    elements.scoreDisplay.nameDisplay.textContent = playerName;
    
    // Update status message
    updateGameStatus();
    return true;
}

// =============== GAME LOGIC ===============
// Handle when a cell is clicked
export function handleCellClick(clickedCell, cellIndex) {
    // Ignore click if cell is taken or game is over or not player's turn
    if (gameState.board[cellIndex] || !gameState.isActive || !gameState.isPlayerTurn) return false;

    // Make player's move
    makeMove(cellIndex, gameState.player.symbol);
    
    // If game isn't over, let computer play
    if (gameState.isActive) {
        gameState.isPlayerTurn = false;
        updateGameStatus();
        setTimeout(makeComputerMove, 500); // Wait 0.5 seconds before computer moves
        return true;
    }
    return false;
}

// Make a move (works for both player and computer)
export function makeMove(cellIndex, symbol) {
    // Update board array and cell display
    gameState.board[cellIndex] = symbol;
    elements.cells[cellIndex].textContent = symbol;

    // Check if this move won the game
    if (checkForWin()) {
        const winner = (symbol === gameState.player.symbol) ? 'player' : 'computer';
        endGame(winner);
        return true;
    }

    // Check if game is a draw
    if (gameState.board.every(cell => cell !== '')) {
        endGame('draw');
        return true;
    }
    return false;
}

// Computer's turn
export function makeComputerMove() {
    // Find all empty cells
    const emptyCells = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);

    // Pick random empty cell
    const computerChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const result = makeMove(computerChoice, gameState.computerSymbol);
    
    // If game is still active, it's player's turn
    if (gameState.isActive) {
        gameState.isPlayerTurn = true;
        updateGameStatus();
    }
    return result;
}

// Check if current board has a winner
export function checkForWin() {
    // All possible winning combinations
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Check each winning pattern
    for (const [a, b, c] of winPatterns) {
        if (gameState.board[a] &&
            gameState.board[a] === gameState.board[b] &&
            gameState.board[a] === gameState.board[c]) {
            
            // Highlight winning cells
            [a, b, c].forEach(index => {
                elements.cells[index].classList.add('winner');
            });
            return true;
        }
    }
    return false;
}

// End the game and update scores
export function endGame(result) {
    gameState.isActive = false;

    // Update scores and display
    if (result === 'player') {
        gameState.scores.player++;
        elements.scoreDisplay.player.textContent = gameState.scores.player;
        elements.status.textContent = `${gameState.player.name} wins!`;
        celebrateWin();
        return 'player';
    } else if (result === 'computer') {
        gameState.scores.computer++;
        elements.scoreDisplay.computer.textContent = gameState.scores.computer;
        elements.status.textContent = 'Computer wins!';
        return 'computer';
    } else {
        gameState.scores.draws++;
        elements.scoreDisplay.draws.textContent = gameState.scores.draws;
        elements.status.textContent = "It's a draw!";
        return 'draw';
    }
}

// Update the game status message
export function updateGameStatus() {
    elements.status.textContent = `${gameState.isPlayerTurn ? gameState.player.name : 'Computer'}'s turn`;
}

// Reset the game board
export function resetGame() {
    // Clear the board
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.isActive = true;
    gameState.isPlayerTurn = true;
    
    // Reset the display
    elements.cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
    
    // Stop any celebrations
    confetti.reset();
    
    // Update status
    updateGameStatus();
    return true;
}

// Celebrate a win with confetti
export function celebrateWin() {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    
    confetti({
        particleCount: 100,
        spread: 70,
        colors: colors,
        origin: { y: 0.6 }
    });
}

// =============== EVENT LISTENERS ===============
// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up symbol choice handlers
    document.getElementById('chooseX').addEventListener('click', () => startGame('X'));
    document.getElementById('chooseO').addEventListener('click', () => startGame('O'));
    
    // Set up game board click handlers
    elements.cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index));
    });
    
    // Set up reset button handler
    elements.resetBtn.addEventListener('click', resetGame);
});
