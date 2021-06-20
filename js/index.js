const colors = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: 'red',
  8192: 'green',
  16384: 'blue',
  32768: 'pink',
  65536: 'magenta',
};

const game = {
  grid: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  emptyCells: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
  ],
  score: 0,
};

function isGameOver() {
  if (game.emptyCells.length === 0) {
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if (game.grid[row][col] === game.grid[row][col + 1]) {
          return false;
        }
      }
    }
    for (col = 0; col < 4; col += 1) {
      for (row = 0; row < 3; row += 1) {
        if (game.grid[row + 1][col] === game.grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

function display() {
  let cellId, cell;
  let gameStateStr = '';
  const gameover = document.getElementById('gameover');
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      cellId = row.toString() + col.toString();
      cell = document.getElementById(cellId);
      cell.classList.remove('animatedBox');
      if (game.grid[row][col] === 0) {
        cell.innerHTML = '';
        cell.style.background = 'rgba(238, 228, 218, 0.35)';
      } else {
        if (cell.innerHTML !== game.grid[row][col].toString()) {
          cell.innerHTML = game.grid[row][col];
          cell.style.background = colors[game.grid[row][col]];
          cell.classList.add('animatedBox');
        }
        if (game.grid[row][col] >= 8) {
          cell.style.color = 'white';
        } else {
          cell.style.color = 'gray';
        }
      }
      gameStateStr = gameStateStr + game.grid[row][col] + ',';
    }
    gameStateStr = gameStateStr + ';';
  }

  document.getElementById('score').innerHTML = 'SCORE: ' + game.score;

  if (typeof Storage) {
    localStorage.setItem('gameState', gameStateStr);
    localStorage.setItem('score', game.score);
  }

  if (isGameOver()) gameover.style.display = 'block';
}

function fillRandomCell() {
  if (game.emptyCells.length !== 0) {
    let num, cell_num, row, col;
    num = Math.random() < 0.9 ? 2 : 4;
    cell_num = Math.floor(Math.random() * game.emptyCells.length);
    row = game.emptyCells[cell_num][0];
    col = game.emptyCells[cell_num][1];
    game.emptyCells.splice(cell_num, 1);
    game.grid[row][col] = num;
  }
  setTimeout(display, 300);
}

function startGame() {
  const gameover = document.getElementById('gameover');
  gameover.style.display = 'none';
  game.grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  game.emptyCells = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
  ];
  game.score = 0;

  fillRandomCell(game);
  fillRandomCell(game);
}

function fillEmptyCells(ii, jj) {
  let row,
    col,
    change = false;
  for (let n = 0; n < game.emptyCells.length; n += 1) {
    row = game.emptyCells[0][0];
    col = game.emptyCells[0][1];
    game.emptyCells.shift();
    if (row + ii < 4 && row + ii > -1 && col + jj < 4 && col + jj > -1) {
      if (game.grid[row + ii][col + jj] !== 0) {
        change = true;
        game.grid[row][col] = game.grid[row + ii][col + jj];
        game.grid[row + ii][col + jj] = 0;
        game.emptyCells.unshift([row + ii, col + jj]);
        n = -1;
        continue;
      }
    }
    game.emptyCells.push([row, col]);
  }
  return change;
}

function up() {
  let change = fillEmptyCells(1, 0);
  for (let col = 0; col < 4; col += 1) {
    for (let row = 0; row < 3; row += 1) {
      if (game.grid[row][col] !== 0) {
        if (game.grid[row + 1][col] === game.grid[row][col]) {
          change = true;
          game.grid[row][col] *= 2;
          game.score += game.grid[row][col];
          game.grid[row + 1][col] = 0;
          game.emptyCells.push([row + 1, col]);
        }
      }
    }
  }
  if (change) {
    fillEmptyCells(1, 0);
    display();
    fillRandomCell();
  }
}

function down() {
  let change = fillEmptyCells(-1, 0);
  for (let col = 0; col < 4; col += 1) {
    for (let row = 3; row > 0; row -= 1) {
      if (game.grid[row][col] !== 0) {
        if (game.grid[row - 1][col] === game.grid[row][col]) {
          change = true;
          game.grid[row][col] *= 2;
          game.score += game.grid[row][col];
          game.grid[row - 1][col] = 0;
          game.emptyCells.push([row - 1, col]);
        }
      }
    }
  }
  if (change) {
    fillEmptyCells(-1, 0);
    display();
    fillRandomCell();
  }
}

function left() {
  let change = fillEmptyCells(0, 1);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (game.grid[row][col] !== 0) {
        if (game.grid[row][col + 1] === game.grid[row][col]) {
          change = true;
          game.grid[row][col] *= 2;
          game.score += game.grid[row][col];
          game.grid[row][col + 1] = 0;
          game.emptyCells.push([row, col + 1]);
        }
      }
    }
  }
  if (change) {
    fillEmptyCells(0, 1);
    display();
    fillRandomCell();
  }
}

function right() {
  let change = fillEmptyCells(0, -1);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 3; col > 0; col -= 1) {
      if (game.grid[row][col] !== 0) {
        if (game.grid[row][col - 1] === game.grid[row][col]) {
          change = true;
          game.grid[row][col] *= 2;
          game.score += game.grid[row][col];
          game.grid[row][col - 1] = 0;
          game.emptyCells.push([row, col - 1]);
        }
      }
    }
  }
  if (change) {
    fillEmptyCells(0, -1);
    display();
    fillRandomCell();
  }
}

document.onkeydown = function (event) {
  const { key } = event;
  switch (key) {
    case 'ArrowLeft':
      left();
      break;
    case 'ArrowUp':
      up();
      break;
    case 'ArrowRight':
      right();
      break;
    case 'ArrowDown':
      down();
      break;
  }
};

box = document.getElementById('box');

const hammertime = new Hammer(box);
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammertime.on('swipeleft', left);

hammertime.on('swiperight', right);

hammertime.on('swipeup', up);

hammertime.on('swipedown', down);

window.onload = function () {
  let gstr, ec, l, strGrid;
  if (typeof Storage && localStorage.getItem('gameState') && localStorage.getItem('score')) {
    gstr = localStorage.gameState;
    ec = [];
    game.score = parseInt(localStorage.score, 10);
    strGrid = gstr.split(';');
    for (let row = 0; row < 4; row += 1) {
      l = strGrid[row].split(',');
      for (let col = 0; col < 4; col += 1) {
        game.grid[row][col] = parseInt(l[col], 10);
        if (parseInt(l[col], 10) === 0) {
          ec.push([row, col]);
        }
      }
    }
    game.emptyCells = ec;
    display();
  } else {
    startGame();
  }
};
const button = document.getElementById('newGame');
button.addEventListener('click', startGame);
