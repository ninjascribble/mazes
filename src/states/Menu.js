export default class Menu extends Phaser.State {
  create () {
    this.game.state.start('GameState');
  }
}
