import EllerMaze from '../shapes/EllerMaze';

export default class GameState extends Phaser.State {
  create () {
    let graphics = this.game.add.graphics(20, 20);
    let maze = new EllerMaze(51, 37, 8, 8);

    graphics.lineStyle(2, 0xFFFFFF, 1);
    maze.draw(graphics);
  }
}
