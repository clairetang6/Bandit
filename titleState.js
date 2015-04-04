var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);
	this.controlsScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['controls'],1100,0);

	this.buttonGroup = new Kiwi.Group(this);

	this.playerButton1 = new TitleIcon(this, 270, 1475, '1player');
	this.playerButton2 = new TitleIcon(this, 270, 1550, '2player');
	this.controlsButton = new TitleIcon(this, 270, 1625, 'controls');

	this.background.alpha = 0;
	this.addChild(this.background);
	this.addChild(this.controlsScreen);

	this.controlsTween = this.game.tweens.create(this.controlsScreen);
	this.random = new Kiwi.Utils.RandomDataGenerator();
	
	this.game.clickOn1Sound = new Kiwi.Sound.Audio(this.game, 'clickOn1Sound', 0.8, false);
	this.game.clickOff1Sound = new Kiwi.Sound.Audio(this.game, 'clickOff1Sound', 0.8, false);
	this.game.clickOn2Sound = new Kiwi.Sound.Audio(this.game, 'clickOn2Sound', 0.8, false);
	this.game.clickOff2Sound = new Kiwi.Sound.Audio(this.game, 'clickOff2Sound', 0.8, false);
	this.game.clickOn3Sound = new Kiwi.Sound.Audio(this.game, 'clickOn3Sound', 0.8, false);
	this.game.clickOff3Sound = new Kiwi.Sound.Audio(this.game, 'clickOff3Sound', 0.8, false);

	this.game.playClickOnSound = function(number){
		switch(number){
			case 0: 
				this.clickOn1Sound.play();
				break;
			case 1:
				this.clickOn2Sound.play();
				break;
			case 2:
				this.clickOn3Sound.play();
				break;
		}
	}

	this.game.playClickOffSound = function(number){
		switch(number){
			case 0: 
				this.clickOff1Sound.play();
				break;
			case 1:
				this.clickOff2Sound.play();
				break;
			case 2:
				this.clickOff3Sound.play();
				break;
		}	
	}


	this.backgroundTween = this.game.tweens.create(this.background);
	this.backgroundTween.onComplete(this.finishAddingToSreen, this);
	this.backgroundTween.to({alpha: 1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None);
	this.backgroundTween._onCompleteCalled = false;
	this.backgroundTween.start();
	
}


titleState.finishAddingToSreen = function(){
	this.buttonGroup.addChild(this.playerButton1);
	this.buttonGroup.addChild(this.playerButton2);
	this.buttonGroup.addChild(this.controlsButton);
	this.addChild(this.buttonGroup);

	this.button1 = this.game.tweens.create(this.playerButton1);
	this.button1.to({y: 475}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.button2 = this.game.tweens.create(this.playerButton2);
	this.button2.to({y: 550}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.button3 = this.game.tweens.create(this.controlsButton);
	this.button3.to({y: 625}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);

	this.button1.chain(this.button2);
	this.button2.chain(this.button3);

	this.button1.start();

	this.mouse = this.game.input.mouse;

	this.backButton = new TitleIcon(this, 50, 675, 'backControls');
	this.backButton.visible = false;
	this.addChild(this.backButton);

	if(this.game.gamepads){
		this.game.gamepads.gamepadConnected.add(this.gamepadConnected, this);
		this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce, this);
	}
	this.selectedMenuIconIndex = 0;
	this.selectedMenuIcon = this.buttonGroup.members[this.selectedMenuIconIndex];
	this.selectedMenuIcon.playHover();

	this.backgroundTween.onComplete(null, null);
}

titleState.showControls = function(){
	this.controlsTween.to({x: 0}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.controlsTween.onComplete(this.finishShowingControls, this);
	this.controlsTween._onCompleteCalled = false;
	this.backgroundTween.to({x: -1100, alpha: 1}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.buttonGroup.visible = false;
	this.buttonGroup.active = false;	
	this.controlsTween.start();
	this.backgroundTween.start();
}

titleState.finishShowingControls = function(){
	this.backButton.visible = true;
	this.backButton.active = true;
	this.controlsTween.onComplete(null, null);
}

titleState.hideControls = function(){
	this.controlsTween.to({x: 1100}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.controlsTween.onComplete(this.finishHidingControls, this);
	this.controlsTween._onCompleteCalled = false;
	this.backgroundTween.to({x: 0, alpha: 1}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.backButton.visible = false;
	this.backButton.active = false;
	this.controlsTween.start();
	this.backgroundTween.start();
}

titleState.finishHidingControls = function(){
	this.buttonGroup.visible = true;
	this.buttonGroup.active = true;
	this.controlsTween.onComplete(null, null);
	console.log(this.background);
}

titleState.startGame = function(){
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	}
	this.game.states.switchState('levelSelectionState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());

}

titleState.gamepadConnected = function(){
	console.log('gamepad started');
	this.selectedMenuIcon.playHover();
}

titleState.changeSelectedMenuIcon = function(index){
	this.selectedMenuIconIndex = index;
	this.selectedMenuIcon = this.buttonGroup.members[this.selectedMenuIconIndex];
	this.selectedMenuIcon.animation.play('hover');
}

titleState.changeSelectedMenuIconByType = function(type){
	switch(type){
		case '1player':
			var index = 0;
			break;
		case '2player':
			var index = 1;
			break;
		case 'controls':
			var index = 2;
			break;
	}
	this.selectedMenuIconIndex = index;
	this.selectedMenuIcon = this.buttonGroup.members[this.selectedMenuIconIndex];
}

titleState.getIncreasedIndex = function(){
	var index = this.selectedMenuIconIndex + 1;
	if(index >= this.buttonGroup.members.length){
		index = 0;
	}
	return index;
}

titleState.getDecreasedIndex = function(){
	var index = this.selectedMenuIconIndex - 1;
	if(index < 0){
		index = this.buttonGroup.members.length - 1;
	}
	return index;
}

titleState.buttonOnDownOnce = function(button){
	switch( button.name ){
		case "XBOX_A":
			this.selectedMenuIcon.mouseClicked();
			break;
		case "XBOX_B":
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":

			break;
		case "XBOX_DPAD_LEFT":

			break;
		case "XBOX_DPAD_RIGHT":

			break;
		case "XBOX_DPAD_UP":
			this.changeSelectedMenuIcon(this.getDecreasedIndex());
			break;
		case "XBOX_DPAD_DOWN":
			this.changeSelectedMenuIcon(this.getIncreasedIndex());
			break;
		default:		
	}
}

