import Grid from './RectangularCellGrid';

export default class EllerMaze {
  constructor (x, y, cw, ch) {
    this.grid = new Grid(x, y, cw, ch);
    this.init();
  }

  init () {
    let cols = this.grid.w;
    let rows = this.grid.h;
    let cells = this.grid.cells;
    let current = [];
    let previous = [];

    // Create one row at a time...
    for (let row = 0; row < rows; row++) {
      current = cells.slice(row * cols, (row * cols) + cols);

      // Join any cells not members of a set to their own unique set
      current.forEach((cell, col) => {
        cell.walls.top = (row === 0);
        cell.walls.right = false;
        cell.walls.bottom = false;
        cell.walls.left = (col === 0);

        if (previous[col] && previous[col].walls.bottom === false) {
          cell.set = previous[col].set;
          cell.set.add(cell);
        } else {
          cell.set = new Set();
          cell.set.add(cell);
          cell.set.color = Phaser.Color.getRandomColor();
        }

        if (previous[col]) {
          previous[col].set.delete(previous[col]);
        }
      });

      current.forEach((cell, col) => {
        let neighbor = current[col + 1];

        if (!neighbor) {
          // This must be the rightmost cell in this row
          cell.walls.right = true;
        } else if (neighbor.set === cell.set) {
          // Divide neighbors from the same set to prevent loops
          cell.walls.right = true;
        } else if (Math.random() >= 0.5) {
          // If we add a wall, then keep them in separate sets
          cell.walls.right = true;
        } else {
          // Otherwise merge the sets
          cell.walls.right = false;
          neighbor.set.forEach((otherCell) => {
            otherCell.set.delete(otherCell);
            cell.set.add(otherCell);
            otherCell.set = cell.set;
          });
        }
      });

      current.forEach((cell, col) => {
        if (cell.set.size === 1) {
          cell.walls.bottom = false;
        } else {
          let count = 0;
          let theOne = Math.random() * cell.set.size >> 0;
          cell.set.forEach((otherCell) => {
            if (count === theOne) {
              otherCell.walls.bottom = false;
            } else {
              otherCell.walls.bottom = (Math.random() >= 0.5);
            }
            count++;
          });
        }
      });

      if (row === rows - 1) {
        current.forEach((cell, col) => {
          let neighbor = current[col + 1];

          cell.walls.bottom = true;

          if (neighbor && cell.set !== neighbor.set) {
            cell.walls.right = false;
            neighbor.set.forEach((otherCell) => {
              otherCell.set.delete(otherCell);
              cell.set.add(otherCell);
              otherCell.set = cell.set;
            });
          }
        });
      }

      previous = [].concat(current);
    }
  }

  reset () {
    this.grid.reset();
    this.init();
  }

  draw (gfx) {
    this.grid.draw(gfx);
  }
}
