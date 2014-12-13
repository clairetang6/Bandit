
var myGame = new Kiwi.Game('game','Bandit',null,{ debug: Kiwi.DEBUG_OFF, plugins:["Fullscreen"]});

myGame.levelsUnlocked = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
myGame.states.addState(titleState);
myGame.states.addState(gameState);
myGame.states.switchState('titleState');