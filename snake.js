/* board details */
const BLOCK_SIZE = 25; // each block is 5x5 pixels
const ROWS = 20;
const COLS = 20;
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

/* game state */
let gameOver = false;

window.onload = () => {
  board = document.getElementById('board');
  board.height = COLS * BLOCK_SIZE; // i.e. 625 pixels
  board.width = ROWS * BLOCK_SIZE;
  context = board.getContext('2d');

  setNewFoodLocation();
  document.addEventListener('keyup', changeDirection);

  setInterval(updateBoard, 100);
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
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  snakeX += velocityX * BLOCK_SIZE;
  snakeY += velocityY * BLOCK_SIZE;

  context.fillStyle = 'lime';
  context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], 
      snakeBody[i][1], BLOCK_SIZE, BLOCK_SIZE);
  }
};

const checkIfGameOver = () => {
  if (snakeX < 0 || snakeX > COLS * BLOCK_SIZE || snakeY < 0 || snakeY > ROWS * BLOCK_SIZE) {
    gameOver = true;
    alert('GAME OVER');
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      gameOver = true;
      alert('GAME OVER');
    }
  }
}

const eatFoodIfPossible = () => {
  if (snakeX === foodX && snakeY === foodY) {
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
    velocityX = velocityY = 0;
  }
};

const refreshBoard = () => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, board.width, board.height);
};

const updateFoodOnBoard = () => {
  context.fillStyle = 'red';
  context.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
};