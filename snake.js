/* board details */
const BLOCK_SIZE = 25; // each block is 5x5 pixels
const ROWS = 25;
const COLS = 25;
let board;
let context;

/* snake details */
let snakeX = BLOCK_SIZE * 5; // 5 chosen randomly
let snakeY = BLOCK_SIZE * 5;
let velocityX = 0;
let velocityY = 0;

/* food details */
let foodX; // 5 chosen randomly
let foodY;

window.onload = () => {
  board = document.getElementById('board');
  board.height = COLS * BLOCK_SIZE; // i.e. 625 pixels
  board.width = ROWS * BLOCK_SIZE;
  context = board.getContext('2d');

  placeFood();
  document.addEventListener('keyup', changeDirection);

  setInterval(updateBoard, 100);
}

const updateBoard = () => {
  // console.log('updated!');
  createBoard();
  updateFood();
  checkIfFoodEaten();
  updateSnake();
};

const checkIfFoodEaten = () => {
  if (snakeX === foodX && snakeY === foodY) {
    placeFood();
  }
}

const placeFood = () => {
  foodX  = Math.floor(Math.random() * COLS) * BLOCK_SIZE;
  foodY= Math.floor(Math.random() * ROWS) * BLOCK_SIZE;
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

const createBoard = () => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, board.width, board.height);
};

const updateSnake = () => {
  context.fillStyle = 'lime';
  snakeX += velocityX * BLOCK_SIZE;
  snakeY += velocityY * BLOCK_SIZE;
  context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);
};

const updateFood = () => {
  context.fillStyle = 'red';
  context.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
};