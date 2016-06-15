import Cell from './RectangularCell';

export default class RectangularCellGrid {
  constructor (w, h, cw, ch) {
    this.w = w;
    this.h = h;
    this.cw = cw;
    this.ch = ch;
    this.cells = [];
    this.init();
  }

  init () {
    let w = this.w;
    let h = this.h;
    let cw = this.cw;
    let ch = this.ch;
    let row = 0;
    let col = 0;
    let i = 0;

    // Let's be sure we're not adding to an existing list
    this.cells.length = 0;

    for (i; i < w * h; i++) {
      let cx = col * cw;
      let cy = row * ch;
      let cell = new Cell(cx, cy, cw, ch);

      this.cells.push(cell);

      if ((i + 1) % w === 0) {
        row = row + 1;
        col = 0;
      } else {
        col = col + 1;
      }
    }
  }

  reset () {
    this.cells.forEach((box, i) => {
      box.reset();
    });
  }

  draw (gfx) {
    this.cells.forEach((box, i) => {
      box.draw(gfx);
    });
  }
}
