var gameOptions = {debug: Kiwi.DEBUG_ON, 
    plugins: ["Fullscreen", "Gamepad"],
    width: 1024,
    height: 768}

var myGame = new Kiwi.Game('game','Bandit',null, gameOptions);

myGame.levelsUnlocked = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
myGame.states.addState(loadingState);
myGame.states.addState(titleState);
myGame.states.addState(levelSelectionState);
myGame.states.addState(gameState);
myGame.states.switchState('loadingState');