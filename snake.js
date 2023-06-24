/* board details */
const BLOCK_SIZE = 25; // each block is 5x5 pixels
const ROWS = 25;
const COLS = 25;
let board;
let context;

/* snake details */
let snakeX = BLOCK_SIZE * 5; // 5 chosen randomly
let snakeY = BLOCK_SIZE * 5;

/* food details */
let foodX; // 5 chosen randomly
let foodY;

window.onload = () => {
  board = document.getElementById('board');
  board.height = COLS * BLOCK_SIZE; // i.e. 625 pixels
  board.width = ROWS * BLOCK_SIZE;
  context = board.getContext('2d');

  placeFood();
  updateBoard();
}

const updateBoard = () => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = 'lime';
  context.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);

  context.fillStyle = 'red';
  context.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
};

const placeFood = () => {
  foodX  = Math.floor(Math.random() * COLS) * BLOCK_SIZE;
  foodY= Math.floor(Math.random() * ROWS) * BLOCK_SIZE;
}