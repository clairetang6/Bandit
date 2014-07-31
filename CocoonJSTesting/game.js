var myGame = new Kiwi.Game(' ', 'myGame', null, {deviceTarget:Kiwi.TARGET_COCOON});
//var myGame = new Kiwi.Game();
console.log(myGame);
myGame.states.addState(gameState);
myGame.states.switchState('gameState');



