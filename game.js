
var myGame = new Kiwi.Game('game');


myGame.states.addState(titleState);
myGame.states.addState(gameState);
myGame.states.switchState('titleState');