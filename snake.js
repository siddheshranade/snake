/* board details */
const BLOCK_SIZE = 18;
const ROWS = 25;
const COLS = 25;
const BOARD_HEIGHT = ROWS * BLOCK_SIZE;
const BOARD_WIDTH = COLS * BLOCK_SIZE;

/* canvas details */
const BOARD = document.querySelector('.board-defaults');
const CONTEXT = BOARD.getContext('2d');
BOARD.height = BOARD_HEIGHT;
BOARD.width = BOARD_WIDTH;

/* color theme */
const COLOR = {};

/* game state - difficulty level */
const LEVELS = { easy: 'easy', hard: 'hard' };
let currentLevel = localStorage.getItem('level') || LEVELS.easy;
let levelsPicklistElement = document.getElementById('levels-picklist');
levelsPicklistElement.value = currentLevel;
BOARD.classList.toggle('board-level-hard', currentLevel === LEVELS.hard); // adds walls to board

/* game state - scores */
let gameOver = false;
let score = 0;
let highscore = localStorage.getItem(`${currentLevel}-highscore`) || 0;
let highscoreElement = document.getElementById('highscore');
highscoreElement.innerHTML = `${currentLevel}-highscore: ${highscore}`;
let scoreElement = document.getElementById('score');
let gameOverElement = document.getElementById('game-over');

/* snake details */
// snake start position is fixed at (5, 5) for now
let snakeX = BLOCK_SIZE * 5;
let snakeY = BLOCK_SIZE * 5;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

/* food details */
let foodX;
let foodY;

/* methods */
window.onload = () => {
  setTheme();
  setNewFoodLocation();
  addListeners();

  setInterval(updateBoard, getBoardRefreshRate());
};

const addListeners = () => {
  levelsPicklistElement.addEventListener('change', toggleDifficultyLevels);
  document.addEventListener('keyup', changeSnakeDirection);
}

const updateBoard = () => {
  if (gameOver) return;

  refreshBoard();
  updateFoodOnBoard();
  eatFoodIfPossible();  
  moveSnakeOnBoard();
  checkIfGameOver();
};

const moveSnakeOnBoard = () => {
  if (currentLevel === LEVELS.easy) {
    allowMovementThroughWalls();  
  }
  
  // getting rid of last element (tail) because snake is moving ahead
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // adding head from the previous render
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY]; 
  }

  // calculating new head position
  snakeX += velocityX * BLOCK_SIZE;
  snakeY += velocityY * BLOCK_SIZE;

  // drawing new head but NOT adding it to snakeBody; that will happen in next render
  drawBlock(COLOR.snake, snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);

  // drawing rest of the snake body - element at 0 is prev head so snake looks attached
  for (let i = 0; i < snakeBody.length; i++) {
    drawBlock(COLOR.snake, snakeBody[i][0], snakeBody[i][1], 
      BLOCK_SIZE, BLOCK_SIZE);
  } 
};

const allowMovementThroughWalls = () => {
  if (snakeX < 0) {
    snakeX = COLS * BLOCK_SIZE;
  } else if (snakeX > COLS * BLOCK_SIZE) {
    snakeX = 0;
  } else if (snakeY < 0) {
    snakeY = ROWS * BLOCK_SIZE;
  } else if (snakeY > ROWS * BLOCK_SIZE) {
    snakeY = 0;
  } 
};

const toggleDifficultyLevels = e => {
  let newLevel = e.target.value;
  localStorage.setItem('level', newLevel);
  location.reload(); // game must immedaitely restart whenever the level is toggled
};

const setTheme = () => {
  let rootElementStyles = getComputedStyle(document.documentElement);

  COLOR.board = rootElementStyles.getPropertyValue('--board-color');
  COLOR.snake = rootElementStyles.getPropertyValue('--snake-color');
  COLOR.food = rootElementStyles.getPropertyValue('--food-color');
};

const checkIfGameOver = () => {
  if (currentLevel === LEVELS.hard) {
    checkIfAnyWallTouched();
  }

  checkIfSnakeTouchedItself();
};

const checkIfAnyWallTouched = () => {
  if (snakeX < 0) {
    drawBlock(COLOR.snake, 0, snakeY, BLOCK_SIZE, BLOCK_SIZE);
    setGameOver();
  } else if (snakeX > BOARD_WIDTH) {
    drawBlock(COLOR.snake, BOARD_WIDTH - BLOCK_SIZE, snakeY, 
      BLOCK_SIZE, BLOCK_SIZE);
    setGameOver();
  } else if (snakeY < 0) {
    drawBlock(COLOR.snake, snakeX, 0, BLOCK_SIZE, BLOCK_SIZE);
    setGameOver();
  } else if (snakeY > BOARD_HEIGHT) {
    drawBlock(COLOR.snake, snakeX, BOARD_HEIGHT - BLOCK_SIZE, 
      BLOCK_SIZE, BLOCK_SIZE);
    setGameOver();
  }
};

const checkIfSnakeTouchedItself = () => {
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      setGameOver();
      return;
    }
  }
};

const setGameOver = () => {
  gameOver = true;
  velocityX = velocityY = 0;
  gameOverElement.classList.toggle("hide-element");
  localStorage.setItem(`${currentLevel}-highscore`, Math.max(highscore, score));
};

const eatFoodIfPossible = () => {
  if (snakeX === foodX && snakeY === foodY) {
    score++;
    scoreElement.innerHTML = `Score: ${score}`;
    snakeBody.push([snakeX, snakeY]); // only place snake grows from
    setNewFoodLocation();
  }
};

const setNewFoodLocation = () => {
  foodX = Math.floor(Math.random() * COLS) * BLOCK_SIZE;
  foodY = Math.floor(Math.random() * ROWS) * BLOCK_SIZE;
};

const changeSnakeDirection = e => {
  if (e.code === 'ArrowUp' && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === 'ArrowDown' && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === 'ArrowLeft' && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === 'ArrowRight' && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.code === 'Space') {
    // refreshes the page i.e. restarts game
    location.reload();
  }
};

const getBoardRefreshRate = () => {
  return currentLevel === LEVELS.easy ? 90 : 76;
}

const refreshBoard = () => {
  // in this case the block is the entire board
  drawBlock(COLOR.board, 0, 0, BOARD_WIDTH, BOARD_HEIGHT);
};

const updateFoodOnBoard = () => {
  drawBlock(COLOR.food, foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
};

const drawBlock = (blockColor, x, y, width, height) => {
  CONTEXT.fillStyle = blockColor;
  CONTEXT.fillRect(x, y, width, height);
};