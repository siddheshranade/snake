const BOX_SIZE = 25; // pixels
const ROWS = 20;
const COLS = 20;
let board;
let context;

window.onload = () => {
  board = document.getElementById('board');
  board.height = COLS * BOX_SIZE; // i.e. 500 pixels
  board.width = ROWS * BOX_SIZE;
  context = board.getContext('2d');

  updateBoard();
}

const updateBoard = () => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, board.width, board.height)
};