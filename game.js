/// <reference path="kiwi.d.ts"/>

var gameOptions = {debug: Kiwi.DEBUG_OFF, 
    plugins: ["Fullscreen", "Gamepad", "SaveGame", "Primitives"],
    width: 1024,
    height: 768,
    scaleType: Kiwi.Stage.SCALE_FIT,
	name: "Bandit"}

var myGame = new Kiwi.Game('game','Bandit',null, gameOptions);

myGame.levelsUnlocked = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
myGame.soundOptions = {soundsOn: true, musicOn: true};  
myGame.inputOptions = {gamepad: false};

myGame.banditColors = {RED: 200, BLUE: 405, BLACK: 102, GHOUL_DIGIT: 104,
	GROUP_GHOUL: 110,
	GROUP_COIN: 202,
	GROUP_POTION: 5,
	GROUP_BOMB: 10,
	GROUP_HIDDENBLOCK: 23,
	GROUP_CRACKS: 45,
	GROUP_BLUEHEARTS: 1,
	GROUP_REDHEARTS: 2
};

myGame.setUpQuitDialog = function(){
	this.quitDialog = new Kiwi.GameObjects.StaticImage(this, this.textures['quitDialog'], 0, -500);
	this.quitDialog.name = 'menu';
	this.quitDialog.x = this.game.stage.width/2-this.quitDialog.width/2;
	this.quitTween = this.game.tweens.create(this.quitDialog);   
	this.quitButtonGroup = new Kiwi.Group(this);
    this.yesButton = new QuitIcon(this, 340, 90, 'yes');
	this.noButton = new QuitIcon(this, 530, 90, 'no');
	this.quitButtonGroup.addChild(this.yesButton);
	this.quitButtonGroup.addChild(this.noButton);
	this.quitButtonGroup.y = -500;
	this.quitButtonGroup.active = false;
	this.quitTween2 = this.game.tweens.create(this.quitButtonGroup);    
	this.quitIndex = 0;   
	this.selectedQuitIcon = this.quitButtonGroup.members[this.quitIndex];
}

myGame.addQuitDialog = function(){
    this.addChild(this.quitDialog);
	this.addChild(this.quitButtonGroup); 	
}

myGame.titleStateShowQuitDialog = function(){
	this.buttonGroup.active = false;
	this.quitButtonGroup.active = true;
	this.selectedMenuIconIndex = 0;
	this.group = this.quitButtonGroup;
	this.changeSelectedMenuIcon(0);

	if(this.game.gamepads){
		this.removeAllGamepadSignals();
		this.addGamepadSignalsQuit();
	}

	this.quitTween.to({y: 300}, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
	this.quitTween2.to({y: 300}, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);    
}

myGame.titleStateCloseQuitDialog = function(){
	this.buttonGroup.active = true;
	this.quitButtonGroup.active = false;
	this.group = this.buttonGroup;
	if(this.showingControls){
		this.changeSelectedMenuIcon('back');
	}else{
		this.selectedMenuIconIndex = 0;
		this.changeSelectedMenuIcon(0);
	}

	if(this.game.gamepads){
        this.removeAllGamepadSignals();
        if(this.showingControls){
            this.addGamepadSignalsControls();
        }else{
            this.addGamepadSignalsTitle();
        }
    }	

	this.quitTween.to({y: -500}, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);	
	this.quitTween2.to({y: -500}, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);	  
}

myGame.quitGame = function(){
    window.close();
}

myGame.states.addState(loadingState);
myGame.states.addState(inputState);
myGame.states.addState(titleState);
myGame.states.addState(levelSelectionState);
myGame.states.addState(gameState);
myGame.states.addState(creditsState);
myGame.states.switchState('loadingState');