
var myGame = new Kiwi.Game('game','Bandit',null,{ debug: Kiwi.DEBUG_OFF});


myGame.states.addState(titleState);
myGame.states.addState(gameState);
myGame.states.switchState('titleState');