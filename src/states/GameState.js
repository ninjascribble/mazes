export default class GameState extends Phaser.State {
  create () {
    var graphics = this.game.add.graphics(20, 20);
    var renderer = new MazeRenderer(graphics);
    var grid = new Grid(51, 37);

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
    this.boxes.push(new Box(15, 15));
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
        box.set.add(box);
      }
      else {
        box.set = new Set();
        box.set.add(box);
        box.set.color = Phaser.Color.getRandomColor();
      }

      if (previous[col]) {
        previous[col].set.delete(previous[col]);
      }
    });

    current.forEach((box, col) => {
      let neighbor = current[col + 1];

      if (!neighbor) {
        // This must be the rightmost box in this row
        box.walls.right = true;
      }
      else if (neighbor.set === box.set) {
        // Divide neighbors from the same set to prevent loops
        box.walls.right = true;
      }
      else if (Math.random() >= .5) {
        // If we add a wall, then keep them in separate sets
        box.walls.right = true;
      }
      else {
        // Otherwise merge the sets
        box.walls.right = false;
        neighbor.set.forEach((otherBox) => {
          otherBox.set.delete(otherBox);
          box.set.add(otherBox);
          otherBox.set = box.set;
        });
      }
    });

    current.forEach((box, col) => {
      if (box.set.size === 1) {
        box.walls.bottom = false;
      }
      else {
        let count = 0;
        let theOne = Math.random() * box.set.size >> 0;
        box.set.forEach((otherBox) => {
          if (count === theOne) {
            otherBox.walls.bottom = false;
          }
          else {
            otherBox.walls.bottom = (Math.random() >= .5);
          }
          count++;
        });
      }
    });

    if (row === rows - 1) {
      current.forEach((box, col) => {
        let neighbor = current[col + 1];

        box.walls.bottom = true;

        if (neighbor && box.set !== neighbor.set) {
          box.walls.right = false;
          neighbor.set.forEach((otherBox) => {
            otherBox.set.delete(otherBox);
            box.set.add(otherBox);
            otherBox.set = box.set;
          });
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

    this.graphics.lineStyle(0, 0x000000, 0);
    this.graphics.beginFill(box.set.color, .7);
    this.graphics.drawRect(x, y, w, h);
    this.graphics.endFill();

    this.graphics.lineStyle(2, 0xFFFFFF, 1);
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
