const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const winningMessageElement = document.getElementById('winningMessage');
const chooseXButton = document.getElementById('chooseX');
const chooseOButton = document.getElementById('chooseO');

let circleTurn;
let playerClass;
let computerClass;

const startGame = () => {
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS);
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessageElement.innerText = '';
    setBoardHoverClass();
};

const chooseMarker = (player) => {
    playerClass = player;
    computerClass = player === X_CLASS ? O_CLASS : X_CLASS;
    circleTurn = player === O_CLASS;
    document.querySelector('.game-setup').style.display = 'none';
    startGame();
};

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (circleTurn !== (playerClass === O_CLASS)) {
            setTimeout(computerMove, 500);
        }
    }
};

const placeMark = (cell, currentClass) => {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase(); 
};

const swapTurns = () => {
    circleTurn = !circleTurn;
};

const setBoardHoverClass = () => {
    board.classList.remove(X_CLASS, O_CLASS);
    if (circleTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
};

const checkWin = (currentClass) => {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
};

const isDraw = () => {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
};

const endGame = (draw) => {
    if (draw) {
        winningMessageElement.innerText = 'Draw!';
    } else {
        winningMessageElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    setTimeout(() => {
        document.querySelector('.game-setup').style.display = 'block';
        startGame();
    }, 2000);
};

const computerMove = () => {
    const emptyCells = [...cellElements].filter(cell => 
        !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(randomCell, computerClass);
    if (checkWin(computerClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
};

chooseXButton.addEventListener('click', () => chooseMarker(X_CLASS));
chooseOButton.addEventListener('click', () => chooseMarker(O_CLASS));
restartButton.addEventListener('click', startGame);

startGame();
