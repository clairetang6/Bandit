var gameOptions = {debug: Kiwi.DEBUG_ON, 
    plugins: ["Fullscreen", "Gamepad", "SaveGame", "Primitives"],
    width: 1024,
    height: 768,
    scaleType: Kiwi.Stage.SCALE_FIT}

var myGame = new Kiwi.Game('game','Bandit',null, gameOptions);

myGame.levelsUnlocked = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
myGame.soundOptions = {soundsOn: true, musicOn: true};  
myGame.inputOptions = {gamepad: false};

myGame.states.addState(loadingState);
myGame.states.addState(inputState);
myGame.states.addState(titleState);
myGame.states.addState(levelSelectionState);
myGame.states.addState(gameState);
myGame.states.addState(creditsState);
myGame.states.switchState('loadingState');