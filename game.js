var colors = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
  4096: "red",
  8192: "green",
  16384: "blue",
  32768: "pink",
  65536: "magenta"
};

var game = {
  grid: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
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
    [3, 3]
  ],
  score: 0
};

function isGameOver() {
  "use strict";
  var i, j;
  if (game.emptyCells.length === 0) {
    for (i = 0; i < 4; i += 1) {
      for (j = 0; j < 3; j += 1) {
        if (game.grid[i][j] === game.grid[i][j + 1]) {
          return false;
        }
      }
    }
    for (j = 0; j < 4; j += 1) {
      for (i = 0; i < 3; i += 1) {
        if (game.grid[i + 1][j] === game.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

function display() {
  "use strict";
  var i,
    j,
    id,
    str,
    g = document.getElementById("gameover");
  str = "";
  for (i = 0; i < 4; i += 1) {
    for (j = 0; j < 4; j += 1) {
      id = "" + i + j;
      if (game.grid[i][j] === 0) {
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.background =
          "rgba(238, 228, 218, 0.35)";
      } else {
        document.getElementById(id).innerHTML = game.grid[i][j];
        document.getElementById(id).style.background = colors[game.grid[i][j]];
        if (game.grid[i][j] >= 8) {
          document.getElementById(id).style.color = "white";
        } else {
          document.getElementById(id).style.color = "gray";
        }
      }
      str = str + game.grid[i][j] + ",";
    }
    str = str + ";";
  }

  document.getElementById("score").innerHTML = "SCORE: " + game.score;

  if (typeof Storage !== "undefined") {
    localStorage.setItem("gameState", str);
    localStorage.setItem("score", game.score);
  }

  if (isGameOver()) {
    //display game over
    g.style.display = "block";
  }
}

function fillRandomCell() {
  "use strict";
  if (game.emptyCells.length !== 0) {
    var num, cell_num, i, j;
    num = Math.random() < 0.9 ? 2 : 4;
    cell_num = 0;
    cell_num = Math.floor(Math.random() * game.emptyCells.length); //(game.emptyCells.length);
    i = game.emptyCells[cell_num][0];
    j = game.emptyCells[cell_num][1];
    game.emptyCells.splice(cell_num, 1);
    game.grid[i][j] = num;
  }
  setTimeout(display, 300);
}

function startGame() {
  "use strict";
  var g = document.getElementById("gameover");
  g.style.display = "none";
  game.grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
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
    [3, 3]
  ];
  game.score = 0;

  fillRandomCell(game);
  fillRandomCell(game);
}

function fillEmptyCells(ii, jj) {
  "use strict";
  var n,
    i,
    j,
    change = false;
  for (n = 0; n < game.emptyCells.length; n += 1) {
    i = game.emptyCells[0][0];
    j = game.emptyCells[0][1];
    game.emptyCells.shift();
    if (i + ii < 4 && i + ii > -1 && j + jj < 4 && j + jj > -1) {
      if (game.grid[i + ii][j + jj] !== 0) {
        change = true;
        game.grid[i][j] = game.grid[i + ii][j + jj];
        game.grid[i + ii][j + jj] = 0;
        game.emptyCells.unshift([i + ii, j + jj]);
        n = -1;
        continue;
      }
    }
    game.emptyCells.push([i, j]);
  }
  return change;
}

function up() {
  "use strict";
  var i,
    j,
    change = false;
  change = fillEmptyCells(1, 0);
  for (j = 0; j < 4; j += 1) {
    for (i = 0; i < 3; i += 1) {
      if (game.grid[i][j] !== 0) {
        if (game.grid[i + 1][j] === game.grid[i][j]) {
          change = true;
          game.grid[i][j] *= 2;
          game.score += game.grid[i][j];
          game.grid[i + 1][j] = 0;
          game.emptyCells.push([i + 1, j]);
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
  "use strict";
  var i,
    j,
    change = false;
  change = fillEmptyCells(-1, 0);
  for (j = 0; j < 4; j += 1) {
    for (i = 3; i > 0; i -= 1) {
      if (game.grid[i][j] !== 0) {
        if (game.grid[i - 1][j] === game.grid[i][j]) {
          change = true;
          game.grid[i][j] *= 2;
          game.score += game.grid[i][j];
          game.grid[i - 1][j] = 0;
          game.emptyCells.push([i - 1, j]);
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
  "use strict";
  var i,
    j,
    change = false;
  change = fillEmptyCells(0, 1);
  for (i = 0; i < 4; i += 1) {
    for (j = 0; j < 3; j += 1) {
      if (game.grid[i][j] !== 0) {
        if (game.grid[i][j + 1] === game.grid[i][j]) {
          change = true;
          game.grid[i][j] *= 2;
          game.score += game.grid[i][j];
          game.grid[i][j + 1] = 0;
          game.emptyCells.push([i, j + 1]);
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
  "use strict";
  var i,
    j,
    change = false;
  change = fillEmptyCells(0, -1);
  for (i = 0; i < 4; i += 1) {
    for (j = 3; j > 0; j -= 1) {
      if (game.grid[i][j] !== 0) {
        if (game.grid[i][j - 1] === game.grid[i][j]) {
          change = true;
          game.grid[i][j] *= 2;
          game.score += game.grid[i][j];
          game.grid[i][j - 1] = 0;
          game.emptyCells.push([i, j - 1]);
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

document.onkeydown = function(event) {
  "use strict";
  var key = event.keyCode || event.which;
  switch (key) {
    case 37:
      left(); // execute a function by passing parameter
      break;
    case 38:
      up();
      break;
    case 39:
      right();
      break;
    case 40:
      down();
      break;
  }
};

box = document.getElementById("box");

var hammertime = new Hammer(box);
hammertime.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

hammertime.on("swipeleft", function() {
  left();
});

hammertime.on("swiperight", function() {
  right();
});

hammertime.on("swipeup", function() {
  up;
});

hammertime.on("swipedown", function() {
  down();
});
window.onload = function() {
  "use strict";
  var gstr, ec, i, j, l, strGrid;
  if (
    typeof Storage !== "undefined" &&
    localStorage.getItem("gameState") !== null &&
    localStorage.getItem("score") !== null
  ) {
    gstr = localStorage.gameState;
    ec = [];
    game.score = parseInt(localStorage.score, 10);
    strGrid = gstr.split(";");
    for (i = 0; i < 4; i += 1) {
      l = strGrid[i].split(",");
      for (j = 0; j < 4; j += 1) {
        game.grid[i][j] = parseInt(l[j], 10);
        if (parseInt(l[j], 10) === 0) {
          ec.push([i, j]);
        }
      }
    }
    game.emptyCells = ec;
    display();
  } else {
    startGame();
  }
};
var button = document.getElementById("newGame");
button.onclick = startGame;
