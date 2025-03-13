import {
    gameState,
    elements,
    startGame,
    handleCellClick,
    makeMove,
    makeComputerMove,
    checkForWin,
    endGame,
    resetGame
} from './script.js';

// Mock DOM elements
beforeEach(() => {
    // Reset game state
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.isActive = true;
    gameState.isPlayerTurn = true;
    gameState.scores = { player: 0, computer: 0, draws: 0 };
    gameState.player = { name: '', symbol: '' };
    gameState.computerSymbol = '';

    // Mock DOM elements
    document.body.innerHTML = `
        <div id="playerSelection">
            <input id="playerName" type="text" />
        </div>
        <div id="gameContainer" style="display: none;">
            <div id="scoreBoard">
                <span id="playerNameDisplay"></span>
                <span id="playerScore">0</span>
                <span id="computerScore">0</span>
                <span id="drawScore">0</span>
            </div>
            <div id="status"></div>
            <div id="board">
                ${Array(9).fill('<div class="cell"></div>').join('')}
            </div>
            <button id="resetBtn">Reset</button>
        </div>
    `;

    // Update elements object with new DOM elements
    Object.assign(elements, {
        cells: document.querySelectorAll('.cell'),
        status: document.getElementById('status'),
        resetBtn: document.getElementById('resetBtn'),
        playerSetup: document.getElementById('playerSelection'),
        gameBoard: document.getElementById('gameContainer'),
        nameInput: document.getElementById('playerName'),
        scoreDisplay: {
            player: document.getElementById('playerScore'),
            computer: document.getElementById('computerScore'),
            draws: document.getElementById('drawScore'),
            nameDisplay: document.getElementById('playerNameDisplay')
        }
    });
});

// =============== GAME SETUP TESTS ===============
describe('Game Setup', () => {
    test('should not start game without player name', () => {
        elements.nameInput.value = '';
        const result = startGame('X');
        expect(result).toBe(false);
        expect(gameState.player.symbol).toBe('');
    });

    test('should start game with valid player name', () => {
        elements.nameInput.value = 'John';
        const result = startGame('X');
        expect(result).toBe(true);
        expect(gameState.player.name).toBe('John');
        expect(gameState.player.symbol).toBe('X');
        expect(gameState.computerSymbol).toBe('O');
        expect(elements.gameBoard.style.display).toBe('block');
    });
});

// =============== GAME MOVES TESTS ===============
describe('Game Moves', () => {
    beforeEach(() => {
        elements.nameInput.value = 'John';
        startGame('X');
    });

    test('should allow valid player move', () => {
        const result = makeMove(0, gameState.player.symbol);
        expect(gameState.board[0]).toBe('X');
        expect(elements.cells[0].textContent).toBe('X');
        expect(result).toBe(false); // No win condition
    });

    test('should not allow move on occupied cell', () => {
        makeMove(0, gameState.player.symbol);
        const result = handleCellClick(elements.cells[0], 0);
        expect(result).toBe(false);
        expect(gameState.board[0]).toBe('X');
    });

    test('should make computer move', () => {
        makeMove(0, gameState.player.symbol);
        const result = makeComputerMove();
        const computerMoveIndex = gameState.board.findIndex(cell => cell === 'O');
        expect(computerMoveIndex).not.toBe(-1);
        expect(elements.cells[computerMoveIndex].textContent).toBe('O');
    });
});

// =============== WIN DETECTION TESTS ===============
describe('Win Detection', () => {
    beforeEach(() => {
        elements.nameInput.value = 'John';
        startGame('X');
    });

    test('should detect horizontal win', () => {
        // X X X
        // - - -
        // - - -
        gameState.board[0] = 'X';
        gameState.board[1] = 'X';
        gameState.board[2] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[1].textContent = 'X';
        elements.cells[2].textContent = 'X';
        expect(checkForWin()).toBe(true);
    });

    test('should detect vertical win', () => {
        // X - -
        // X - -
        // X - -
        gameState.board[0] = 'X';
        gameState.board[3] = 'X';
        gameState.board[6] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[3].textContent = 'X';
        elements.cells[6].textContent = 'X';
        expect(checkForWin()).toBe(true);
    });

    test('should detect diagonal win', () => {
        // X - -
        // - X -
        // - - X
        gameState.board[0] = 'X';
        gameState.board[4] = 'X';
        gameState.board[8] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[4].textContent = 'X';
        elements.cells[8].textContent = 'X';
        expect(checkForWin()).toBe(true);
    });

    test('should detect draw', () => {
        // X O X
        // X O X
        // O X O
        const moves = ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'];
        moves.forEach((symbol, index) => {
            gameState.board[index] = symbol;
            elements.cells[index].textContent = symbol;
        });
        expect(gameState.board.every(cell => cell !== '')).toBe(true);
        expect(checkForWin()).toBe(false);
    });
});

// =============== SCORE TRACKING TESTS ===============
describe('Score Tracking', () => {
    beforeEach(() => {
        elements.nameInput.value = 'John';
        startGame('X');
    });

    test('should increment player score on win', () => {
        const initialScore = gameState.scores.player;
        gameState.board[0] = 'X';
        gameState.board[1] = 'X';
        gameState.board[2] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[1].textContent = 'X';
        elements.cells[2].textContent = 'X';
        const result = endGame('player');
        expect(result).toBe('player');
        expect(gameState.scores.player).toBe(initialScore + 1);
        expect(elements.scoreDisplay.player.textContent).toBe('1');
    });

    test('should increment computer score on win', () => {
        const initialScore = gameState.scores.computer;
        gameState.board[0] = 'O';
        gameState.board[1] = 'O';
        gameState.board[2] = 'O';
        elements.cells[0].textContent = 'O';
        elements.cells[1].textContent = 'O';
        elements.cells[2].textContent = 'O';
        const result = endGame('computer');
        expect(result).toBe('computer');
        expect(gameState.scores.computer).toBe(initialScore + 1);
        expect(elements.scoreDisplay.computer.textContent).toBe('1');
    });

    test('should increment draw count on draw', () => {
        const initialDraws = gameState.scores.draws;
        const moves = ['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O'];
        moves.forEach((symbol, index) => {
            gameState.board[index] = symbol;
            elements.cells[index].textContent = symbol;
        });
        const result = endGame('draw');
        expect(result).toBe('draw');
        expect(gameState.scores.draws).toBe(initialDraws + 1);
        expect(elements.scoreDisplay.draws.textContent).toBe('1');
    });
});

// =============== RESET FUNCTIONALITY TESTS ===============
describe('Reset Functionality', () => {
    beforeEach(() => {
        elements.nameInput.value = 'John';
        startGame('X');
    });

    test('should reset game state', () => {
        // Make some moves
        gameState.board[0] = 'X';
        gameState.board[1] = 'O';
        gameState.board[4] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[1].textContent = 'O';
        elements.cells[4].textContent = 'X';
        
        const result = resetGame();
        expect(result).toBe(true);
        expect(gameState.board.every(cell => cell === '')).toBe(true);
        expect(gameState.isActive).toBe(true);
        expect(gameState.isPlayerTurn).toBe(true);
        expect(elements.cells[0].textContent).toBe('');
        expect(elements.cells[1].textContent).toBe('');
        expect(elements.cells[4].textContent).toBe('');
    });

    test('should maintain scores after reset', () => {
        // Win a game
        gameState.board[0] = 'X';
        gameState.board[1] = 'X';
        gameState.board[2] = 'X';
        elements.cells[0].textContent = 'X';
        elements.cells[1].textContent = 'X';
        elements.cells[2].textContent = 'X';
        endGame('player');
        const playerScore = gameState.scores.player;
        resetGame();
        expect(gameState.scores.player).toBe(playerScore);
    });
});

// =============== EVENT LISTENER TESTS ===============
describe('Event Listeners', () => {
    beforeEach(() => {
        // Reset game state
        gameState.board = ['', '', '', '', '', '', '', '', ''];
        gameState.isActive = true;
        gameState.isPlayerTurn = true;
        gameState.scores = { player: 0, computer: 0, draws: 0 };
        gameState.player = { name: '', symbol: '' };
        gameState.computerSymbol = '';

        // Reset DOM
        document.body.innerHTML = `
            <div id="playerSelection">
                <input id="playerName" type="text" />
                <button id="chooseX">X</button>
                <button id="chooseO">O</button>
            </div>
            <div id="gameContainer" style="display: none;">
                <div id="scoreBoard">
                    <span id="playerNameDisplay"></span>
                    <span id="playerScore">0</span>
                    <span id="computerScore">0</span>
                    <span id="drawScore">0</span>
                </div>
                <div id="status"></div>
                <div id="board">
                    ${Array(9).fill('<div class="cell"></div>').join('')}
                </div>
                <button id="resetBtn">Reset</button>
            </div>
        `;

        // Update elements object with new DOM elements
        Object.assign(elements, {
            cells: document.querySelectorAll('.cell'),
            status: document.getElementById('status'),
            resetBtn: document.getElementById('resetBtn'),
            playerSetup: document.getElementById('playerSelection'),
            gameBoard: document.getElementById('gameContainer'),
            nameInput: document.getElementById('playerName'),
            scoreDisplay: {
                player: document.getElementById('playerScore'),
                computer: document.getElementById('computerScore'),
                draws: document.getElementById('drawScore'),
                nameDisplay: document.getElementById('playerNameDisplay')
            }
        });

        // Dispatch DOMContentLoaded to trigger event listeners
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    test('should start game when X is chosen', () => {
        elements.nameInput.value = 'John';
        const xButton = document.getElementById('chooseX');
        xButton.click();

        expect(gameState.player.symbol).toBe('X');
        expect(gameState.computerSymbol).toBe('O');
        expect(elements.gameBoard.style.display).toBe('block');
    });

    test('should start game when O is chosen', () => {
        elements.nameInput.value = 'John';
        const oButton = document.getElementById('chooseO');
        oButton.click();

        expect(gameState.player.symbol).toBe('O');
        expect(gameState.computerSymbol).toBe('X');
        expect(elements.gameBoard.style.display).toBe('block');
    });

    test('should handle cell clicks correctly', () => {
        // Start game first
        elements.nameInput.value = 'John';
        document.getElementById('chooseX').click();

        // Click first cell
        const firstCell = document.querySelectorAll('.cell')[0];
        firstCell.click();

        expect(gameState.board[0]).toBe('X');
        expect(firstCell.textContent).toBe('X');
        expect(gameState.isPlayerTurn).toBe(false);
    });

    test('should handle reset button click', () => {
        // Start game and make some moves
        elements.nameInput.value = 'John';
        document.getElementById('chooseX').click();
        
        const cells = document.querySelectorAll('.cell');
        cells[0].click(); // Player move
        
        // Click reset
        document.getElementById('resetBtn').click();

        expect(gameState.board.every(cell => cell === '')).toBe(true);
        expect(gameState.isActive).toBe(true);
        expect(gameState.isPlayerTurn).toBe(true);
    });
});
