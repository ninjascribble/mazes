export default class GameState extends Phaser.State {
  create () {
    var graphics = this.game.add.graphics(20, 20);
    var renderer = new MazeRenderer(graphics);
    var grid = new Grid(10, 10);

    graphics.lineStyle(3, 0xFFFFFF, 1);
    renderer.draw(grid);
  }
}

function Box(w, h) {
  this.geometry = new Phaser.Rectangle(0 - w / 2, 0 - h / 2, w, h);
  this.walls = {
    "top":    false,
    "right":  false,
    "bottom": false,
    "left":   false
  };
}

function Grid(w, h) {
  this.w = w;
  this.h = h;
  this.boxes = [];

  for (var i = 0; i < w * h; i++) {
    this.boxes.push(new Box(10, 10));
  }
}

function GridRenderer(graphics) {
  this.graphics = graphics;
}

GridRenderer.prototype.draw = function(grid) {
  var cols = grid.w;
  var rows = grid.h;
  var row = -1;
  var boxes = grid.boxes;

  boxes.forEach((box, i) => {
    if (i % cols === 0) {
      row++;
    }

    let x = box.geometry.x + (i % cols) * box.geometry.width;
    let y = box.geometry.y + row * box.geometry.height;
    let w = box.geometry.width;
    let h = box.geometry.height;

    this.graphics.drawRect(x, y, w, h);
  });
}

function MazeRenderer(graphics) {
  this.graphics = graphics;
}

MazeRenderer.prototype.draw = function(grid) {
  var cols = grid.w;
  var rows = grid.h;
  var boxes = grid.boxes;
  var current = [];
  var previous = [];

  // Create one row at a time...
  for (let row = 0; row < rows; row++) {
    current = boxes.slice(row * cols, (row * cols) + cols);

    // Join any cells not members of a set to their own unique set
    current.forEach((box, col) => {
      box.walls.top = (row === 0) ? true : false;
      box.walls.right = false;
      box.walls.bottom = false;
      box.walls.left = (col === 0) ? true : false;

      if (previous[col] && previous[col].walls.bottom === false) {
        box.set = previous[col].set;
        previous[col].set.add(box);
      }
      else {
        box.set = new Set();
        box.set.add(box);
      }
    });

    current.forEach((box, col) => {
      let neighbor = current[col + 1];

      if (!neighbor) {
        box.walls.right = true;
      }
      else if (neighbor.set === box.set) {
        box.walls.right = true;
      }
      else if (Math.random() >= .5) {
        box.walls.right = true;
      }
      else {
        box.walls.right = false;
        neighbor.set = box.set;
        box.set.add(neighbor);
      }

      let numOpenWalls = 0;

      current.forEach((otherBox) => {
        if (otherBox !== box && otherBox.set === box.set && otherBox.walls.bottom === false) {
          numOpenWalls++;
        }
      });

      box.walls.bottom = (numOpenWalls > 1) ? Math.random() > .5 : false;
    });

    if (row === rows - 1) {
      current.forEach((box, col) => {
        let neighbor = current[col + 1];

        box.walls.bottom = true;

        if (!!neighbor && box.set === neighbor.set) {
          box.walls.right = false;
          neighbor.set = box.set;
          box.set.add(neighbor);
        }
      });
    }

    previous = [].concat(current);
  }

  let row = 0;

  boxes.forEach((box, i) => {

    if (i % cols === 0) {
      row++;
    }

    let x = box.geometry.x + (i % cols) * box.geometry.width;
    let y = box.geometry.y + row * box.geometry.height;
    let w = box.geometry.width;
    let h = box.geometry.height;

    this.graphics.moveTo(x, y);

    if (box.walls.top === true) {
      this.graphics.lineTo(x + w, y);
    } else {
      this.graphics.moveTo(x + w, y);
    }

    if (box.walls.right === true) {
      this.graphics.lineTo(x + w, y + h);
    } else {
      this.graphics.moveTo(x + w, y + h);
    }

    if (box.walls.bottom === true) {
      this.graphics.lineTo(x, y + h);
    } else {
      this.graphics.moveTo(x, y + h);
    }

    if (box.walls.left === true) {
      this.graphics.lineTo(x, y);
    } else {
      this.graphics.moveTo(x, y);
    }
  });
}
