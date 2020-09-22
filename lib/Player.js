/**
 * @fileoverview This is a class encapsulating a Player.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

/**
 * Constructor for a Player
 * @constructor
 * @param {string} id The socket ID of the Player
 */
function Player(id) {
  this.id = id;
  this.score = 0;
  this.name = '';
  this.card = '';
}

/**
 * Factory method for creating a Player
 * @param {string} id The socket ID of the Player
 * @return {Player}
 */
Player.create = function(id) {
  return new Player(id);
};

module.exports = Player;
