/** 
 * Class representing the game and their elements (Players, Items)
 * on the client side. The game (client side) will take care of the
 * display et send the keyboard inputs.
 */
class Game {
  /**
   * @constructor
   *
   * @param {Object} socket: socket associating the player and the client
   */
  constructor(socket) {
    this.socket  = socket;
    this.display = null;
    this.player  = null;
    this.enemies = new Array();
    this.items   = new Array();
    this.frameId = null; 
  }

  /**
   * @method Initialize the game by creating a Display object to manage
   * the rendering of the game and generating all the data from the 
   * server side.
   */
  init() {
    this.socket.emit("new-player");
    this.socket.on("generate-game", this.initGameValues.bind(this));
    this.display = new Display(this.player);
    this.display.init();
  } 

  /**
   * @method Init the data (Players, Items) of the game given by the server.
   *
   * @param {Object} data: data given by the server
   */
  initGameValues(data) {
    if(this.player == null)
      this.player = data["player"];
    this.enemies = data["enemies"];
    this.items = data["items"];
  }

  /**
   * @method Set the data (Players, Items) of the game given by the server.
   *
   * @param {Object} data: data given by the server
   */
  setGameValues(data) {
    this.player = data["player"];
    // TODO: When a player is removed from the game
    this.enemies = data["enemies"];
    this.items = data["items"];
  }

  /**
   * @method Start the game loop.
   */
  start() {
    this.run(Date.now());
  }

  /**
   * @method Run the game loop. We will send the keyboard state to 
   * the server and get the game state from the server. After that, 
   * we will render all the elements of the game.
   */
  run() {
    window.requestAnimationFrame(this.run.bind(this));
    this.socket.emit("player-action", KEYBOARD_STATE);
    this.socket.on("update-players", this.setGameValues.bind(this));
    this.render();
  }

  /**
   * @method End the game loop (TO ADD).
   */
  end() {
    window.cancelAnimationFrame(this.frameId);
  }

  /**
   * @method Display all the elements of the game, i.e all 
   * the Players and Items.
   */
  render() {
    this.display.clear();
    this.display.background();
    if(this.player && this.player.body.length != 0) {
      this.display.snake("player", this.player);
      this.display.score(this.player, this.enemies);
      this.display.leaderboard(this.player, this.enemies);
    }

    for(var i = 0; i < this.enemies.length; i++)
      this.display.snake("enemies", this.enemies[i]);

    if(this.items.length != 0) 
      this.display.item(this.items);
  }
}