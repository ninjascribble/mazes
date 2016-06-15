export default class RectangularCell {
  constructor (x, y, w, h) {
    this.geometry = new Phaser.Rectangle(x, y, w, h);
    this.init();
  }

  init () {
    this.walls = {
      'top': true,
      'right': true,
      'bottom': true,
      'left': true
    };
  }

  reset () {
    this.init();
  }

  draw (gfx) {
    let x = this.geometry.x;
    let y = this.geometry.y;
    let w = this.geometry.width;
    let h = this.geometry.height;

    gfx.moveTo(x, y);

    if (this.walls.top === true) {
      gfx.lineTo(x + w, y);
    } else {
      gfx.moveTo(x + w, y);
    }

    if (this.walls.right === true) {
      gfx.lineTo(x + w, y + h);
    } else {
      gfx.moveTo(x + w, y + h);
    }

    if (this.walls.bottom === true) {
      gfx.lineTo(x, y + h);
    } else {
      gfx.moveTo(x, y + h);
    }

    if (this.walls.left === true) {
      gfx.lineTo(x, y);
    } else {
      gfx.moveTo(x, y);
    }
  }
}
