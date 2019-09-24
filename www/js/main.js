
const BOARD_SIZE = 10;
const MINES_NUMBER = 10;

class Board {
      constructor() {
            this.board = new Array(BOARD_SIZE);
            // this.buildBoard = this.buildBoard.bind(this);
            this.buildBoard();
            this.buildMines();
            this.paintBoard();
      }

      buildBoard() {
            for (let i = 0; i < this.board.length; i++) {
                  this.board[i] = new Array(BOARD_SIZE);
                  for (let j = 0; j < this.board[i].length; j++) {
                        this.board[i][j] = new Square(i, j);
                  }
            }
            // this.logBoard();
      }

      buildMines() {
            for (let i = 0; i < MINES_NUMBER; i++) {
                  let mineadded = false;
                  while (!mineadded) {
                        const randomRowNumber = Math.floor((Math.random() * BOARD_SIZE));
                        const randomColumnNumber = Math.floor((Math.random() * BOARD_SIZE));
                        if (!this.board[randomRowNumber][randomColumnNumber].isMine) {
                              this.board[randomRowNumber][randomColumnNumber].setMine();
                              mineadded = true;
                        }
                  }
            }
      }

      paintBoard() {
            for (let i = 0; i < this.board.length; i++) {
                  var newDiv = document.createElement('div');
                  newDiv.classList.add('row');
                  for (let j = 0; j < this.board[i].length; j++) {
                        const element = document.createElement('button');
                        const id = this.board[i][j].getId();
                        element.setAttribute('id', id);
                        element.setAttribute('value', '');
                        this.board[i][j].minesAround = this.getMinesAround(i, j);
                        var textSpan = document.createElement('span')
                        textSpan.innerHTML = this.board[i][j].minesAround;
                        textSpan.style.display = 'none';
                        element.appendChild(textSpan);
                        element.addEventListener('contextmenu', function (ev) {
                              ev.preventDefault();
                              if (element.className == 'bandera') {
                                    element.className = '';
                              } else {
                                    element.className = 'bandera';
                              }
                        }, false);
                        element.addEventListener('click', (ev) => {
                              this.uncoverSquare(i, j);
                        }, false);
                        newDiv.appendChild(element);
                  }
                  document.body.appendChild(newDiv);
            }
      }

      logBoard() {
            for (let i = 0; i < this.board.length; i++) {
                  for (let j = 0; j < this.board[i].length; j++) {
                        console.log(this.board[i][j].getId() + ' - ' + this.board[i][j].isMine);
                  }
            }
      }

      uncoverMines() {
            for (let i = 0; i < this.board.length; i++) {
                  for (let j = 0; j < this.board[i].length; j++) {
                        if (this.board[i][j].isMine)
                              this.board[i][j].getElement().className = 'mina';
                        console.log(this.board[i][j].getId());
                  }
            }
      }

      getMinesAround(x, y) {
            let mines = 0;
            // número de vecinos, verticales y horizontales en su posición por índice desde -1 a 2
            for (let i = -1; i < 2; i++) {
                  for (let j = -1; j < 2; j++) {
                        if (!(i == 0 && j == 0)) {
                              if (this.insideLimits(x + i, y + j)) {
                                    if (this.board[x + i][y + j].isMine) {
                                          mines++;
                                    }
                              }
                        }
                  }
            }
            return mines;
      }

      insideLimits(rowAround, columnAround) {
            if ((rowAround >= 0) && (rowAround < BOARD_SIZE) && (columnAround >= 0) && (columnAround < BOARD_SIZE)) {
                  return true;
            }
            return false;
      }

      uncoverSquare(row, column) {
            if (this.board[row][column].isMine) {
                  this.uncoverMines();
            } else {
                  if (!this.board[row][column].uncover) {
                        this.board[row][column].setUncover();
                        if (this.board[row][column].minesAround == 0) {
                              this.uncoverSquareAround(row, column);
                        }
                  }
            }
      }

      uncoverSquareAround(row, column) {
            for (let i = -1; i < 2; i++) {
                  for (let j = -1; j < 2; j++) {
                        if (!(i == 0 && j == 0)) {
                              if (this.insideLimits(row + i, column + j)) {
                                    this.uncoverSquare(row + i, column + j);
                              }
                        }
                  }
            }
      }
}

class Square {
      constructor(x, y) {
            this._isMine = false;
            this._xPosition = x;
            this._yPosition = y;
            this._minesAround = undefined;
            this._uncover = false;
            this.vecinos = {

            };
      }

      get isMine() {
            return this._isMine;
      }

      get minesAround() {
            return this._minesAround;
      }

      set minesAround(mines) {
            this._minesAround = mines;
      }

      get uncover() {
            return this._uncover;
      }

      setUncover() {
            this._uncover = true;
            this.getText().style.display = 'block';
      }

      setMine() {
            this._isMine = true;
      }

      getId() {
            return this._xPosition.toString() + this._yPosition.toString();
      }

      getElement() {
            return document.getElementById(this.getId());
      }

      getText() {
            return document.getElementById(this.getId()).firstChild;
      }
}

let tablero = new Board();
