/* board details */
const BLOCK_SIZE = 18;
const ROWS = 25;
const COLS = 25;
const BOARD_HEIGHT = ROWS * BLOCK_SIZE;
const BOARD_WIDTH = COLS * BLOCK_SIZE;
let board;
let context;

/* snake details */
let snakeX = BLOCK_SIZE * 5; // 5 chosen randomly
let snakeY = BLOCK_SIZE * 5;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

/* food details */
let foodX;
let foodY;

/* game styles */
const BOARD_COLOR = '#82DDF0'; // #222
const FOOD_COLOR = '#A57548 ';
const SNAKE_COLOR = '#5296A5'; // lime

/* game state */
let gameOver = false;
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let scoreElement = document.getElementById('score');
let gameOverElement = document.getElementById('game-over');

/* methods */
window.onload = () => {
  document.getElementById('highscore').innerHTML = `Highscore: ${highscore}`;

  board = document.getElementById('board');
  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;
  context = board.getContext('2d');

  setNewFoodLocation();
  document.addEventListener('keyup', changeDirection);

  setInterval(updateBoard, 76);
}

const updateBoard = () => {
  if (gameOver) return;

  refreshBoard();
  updateFoodOnBoard();
  eatFoodIfPossible();
  updateSnakeOnBoard();
  checkIfGameOver();
};

const updateSnakeOnBoard = () => {
  // moveSnakeThroughWalls();

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
  context.fillStyle = SNAKE_COLOR;
  context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);

  // drawing rest of the snake body - element at 0 is prev head so snake looks attached
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], 
      snakeBody[i][1], BLOCK_SIZE, BLOCK_SIZE);
  } 
};

/* not using for now */
// const moveSnakeThroughWalls = () => {
//   if (snakeX < 0) {
//     snakeX = COLS * BLOCK_SIZE;
//   } else if (snakeX > COLS * BLOCK_SIZE) {
//     snakeX = 0;
//   } else if (snakeY < 0) {
//     snakeY = ROWS * BLOCK_SIZE;
//   } else if (snakeY > ROWS * BLOCK_SIZE) {
//     snakeY = 0;
//   } 
// }

const checkIfGameOver = () => {
  if (snakeX < 0 || snakeX > BOARD_WIDTH || snakeY < 0 || snakeY > BOARD_HEIGHT) {
    setGameOver();
    return;
  }

  // if (snakeX < 0) {
  //   snakeX = 0;
  //   setGameOver();
  // } else if (snakeX > BOARD_WIDTH) {
  //   snakeX = BOARD_WIDTH;
  //   setGameOver();
  // } else if (snakeY < 0) {
  //   snakeY = 0;
  //   setGameOver();
  // } else if (snakeY > BOARD_HEIGHT) {
  //   snakeY = BOARD_HEIGHT;
  //   setGameOver();
  // }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      setGameOver();
      return;
    }
  }
}

const setGameOver = () => {
  gameOver = true;
  velocityX = velocityY = 0;
  gameOverElement.classList.toggle("hide-element");
  localStorage.setItem('highscore', Math.max(highscore, score));
}

const eatFoodIfPossible = () => {
  if (snakeX === foodX && snakeY === foodY) {
    score++;
    scoreElement.innerHTML = `Score: ${score}`;
    highscore = Math.max(highscore, score);
    snakeBody.push([snakeX, snakeY]);
    setNewFoodLocation();
  }
};

const setNewFoodLocation = () => {
  foodX = Math.floor(Math.random() * COLS) * BLOCK_SIZE;
  foodY = Math.floor(Math.random() * ROWS) * BLOCK_SIZE;
};

const changeDirection = e => {
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
    location.reload();
    // velocityX = velocityY = 0;
    // gameOver = true;
  }
};

const refreshBoard = () => {
  context.fillStyle = BOARD_COLOR;
  context.fillRect(0, 0, board.width, board.height);
};

const updateFoodOnBoard = () => {
  context.fillStyle = FOOD_COLOR;
  context.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
};