var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

}

titleState.showQuitDialog = function(){
	this.game.titleStateShowQuitDialog.call(this);
}

titleState.closeQuitDialog = function(){
	this.game.titleStateCloseQuitDialog.call(this);
}

titleState.quitGame = function(){
	this.game.quitGame();
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);


	if(this.game.inputOptions.gamepad){
		this.controlsScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['controlsGamepad'], 1100,0);
		this.controlsTween = this.game.tweens.create(this.controlsScreen);
	}else{
		this.controlsScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['controls'],1100,0);
		this.controlsTween = this.game.tweens.create(this.controlsScreen);
	}

	this.buttonGroup = new Kiwi.Group(this);
	this.group = this.buttonGroup;


	this.playerButton1 = new TitleIcon(this, 270, 1475, '1player');
	this.playerButton2 = new TitleIcon(this, 270, 1550, '2player');
	this.controlsButton = new TitleIcon(this, 270, 1625, 'controls');

	this.background.alpha = 0;
	this.addChild(this.background);
	this.addChild(this.controlsScreen);
	
	this.game.setUpQuitDialog.call(this);
	this.game.addQuitDialog.call(this);

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
	
	this.showingControls = false;

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
		this.addGamepadSignalsTitle();
	}

	this.debounce = 0;

	this.group = this.buttonGroup;
	this.selectedMenuIconIndex = 0;
	this.changeSelectedMenuIcon(this.selectedMenuIconIndex);

	this.backgroundTween.onComplete(null, null);
	this.game.input.keyboard.onKeyDown.add(this.onPressTitle, this);
	this.game.input.keyboard.onKeyUp.add(this.onKeyUpCallback, this);
}

titleState.addGamepadSignalsTitle = function(){
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnceAButton, this);
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpAButton, this);
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnceArrowPad, this);
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add(this.thumbstickOnDownOnce, this);
}

titleState.addGamepadSignalsControls = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpAButton, this);	
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnceAButton, this);	
}

titleState.addGamepadSignalsQuit = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpAButton, this);	
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnceAButton, this);
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnceArrowPad, this);	
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add(this.thumbstickOnDownOnce2, this);
}

titleState.showControls = function(){
	this.showingControls = true;
	this.controlsTween.to({x: 0}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.controlsTween.onComplete(this.finishShowingControls, this);
	this.controlsTween._onCompleteCalled = false;
	this.backgroundTween.to({x: -1100, alpha: 1}, 500, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.buttonGroup.visible = false;
	this.buttonGroup.active = false;	
	this.controlsTween.start();
	this.backgroundTween.start();
	this.game.input.keyboard.onKeyDown.removeAll();	
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
	}
}

titleState.finishShowingControls = function(){
	this.backButton.visible = true;
	this.backButton.active = true;
	this.controlsTween.onComplete(null, null);
	this.changeSelectedMenuIcon('back');
	this.game.input.keyboard.onKeyDown.add(this.onPressControls, this);
	if(this.game.gamepads){
		this.addGamepadSignalsControls();
	}
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
	this.game.input.keyboard.onKeyDown.removeAll();	
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
	}
}

titleState.finishHidingControls = function(){
	this.showingControls = false;
	this.buttonGroup.visible = true;
	this.buttonGroup.active = true;
	this.controlsTween.onComplete(null, null);
	this.changeSelectedMenuIcon(0);
	this.game.input.keyboard.onKeyDown.add(this.onPressTitle, this);
	if(this.game.gamepads){
		this.addGamepadSignalsTitle();
	}
}

titleState.startGame = function(){
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	}
	this.game.tweens.remove(this.button1);
	this.game.tweens.remove(this.button2);
	this.game.tweens.remove(this.button3);
	this.game.states.switchState('levelSelectionState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	if(this.showingControls == false){
		this.checkController();
	}
}

titleState.gamepadConnected = function(){
	console.log('gamepad started');
	this.selectedMenuIcon.playHover();
}

titleState.changeSelectedMenuIcon = function(index){
	if(this.selectedMenuIcon){
		this.selectedMenuIcon.playOff();
	}
	if(index == 'back'){
		this.selectedMenuIconIndex = -1;
		this.selectedMenuIcon = this.backButton;
		this.selectedMenuIcon.alpha = 1;
		this.selectedMenuIcon.animation.play('hover');
	}else{
		this.selectedMenuIconIndex = index;
		this.selectedMenuIcon = this.group.members[this.selectedMenuIconIndex];
		this.selectedMenuIcon.alpha = 1;
		this.selectedMenuIcon.animation.play('hover');
	}
}

titleState.changeSelectedMenuIconByType = function(type){
	switch(type){
		case '1player':
			var index = 0;
			this.group = this.buttonGroup;
			break;
		case '2player':
			var index = 1;
			this.group = this.buttonGroup;
			break;
		case 'controls':
			var index = 2;
			this.group = this.buttonGroup;
			break;
		case 'backControls':
			var index = 'back';
			break;
		case 'yes':
			var index = 0;
			this.group = this.quitButtonGroup;
			break;
		case 'no':
			var index = 1;
			this.group = this.quitButtonGroup;
			break;
	}
	if(index == 'back'){
		this.selectedMenuIconIndex - 1;
		this.selectedMenuIcon = this.backButton;
	}else{
		this.selectedMenuIconIndex = index;
		this.selectedMenuIcon = this.group.members[this.selectedMenuIconIndex];
	}
}

titleState.getIncreasedIndex = function(){
	var index = this.selectedMenuIconIndex + 1;
	if(index >= this.group.members.length){
		index = 0;
	}
	return index;
}

titleState.getDecreasedIndex = function(){
	var index = this.selectedMenuIconIndex - 1;
	if(index < 0){
		index = this.group.members.length - 1;
	}
	return index;
}

titleState.buttonOnDownOnceArrowPad = function(button){
	switch(button.name){
		case "XBOX_DPAD_LEFT":
			this.changeSelectedMenuIcon(this.getDecreasedIndex());
			break;
		case "XBOX_DPAD_RIGHT":
			this.changeSelectedMenuIcon(this.getIncreasedIndex());
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

titleState.buttonOnDownOnceAButton = function(button){
	switch( button.name ){
		case "XBOX_A":
			this.selectedMenuIcon.playDown();
			break;
		case "XBOX_B":
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":
			break;
		case "XBOX_BACK":
			this.showQuitDialog();
			break;
	}
}

titleState.buttonOnUpAButton = function(button){
	if(button.name == "XBOX_A"){
		this.selectedMenuIcon.mouseClicked();
	}
}

titleState.thumbstickOnDownOnce = function(stick){
	switch ( stick.name ) {
		case "XBOX_LEFT_HORZ":
			break;
		case "XBOX_LEFT_VERT":
			if(stick.value < 0){
				this.changeSelectedMenuIcon(this.getDecreasedIndex());
				this.debounce = 0;
			}else if (stick.value > 0){
				this.changeSelectedMenuIcon(this.getIncreasedIndex());
				this.debounce = 0;
			}
			break;
		case "XBOX_RIGHT_HORZ":

			break;
		case "XBOX_RIGHT_VERT":

			break;
		default:
			// Code
	}	
}

titleState.thumbstickOnDownOnce2 = function(stick){
	switch ( stick.name ) {
		case "XBOX_LEFT_HORZ":
			if(stick.value < 0){
				this.changeSelectedMenuIcon(this.getDecreasedIndex());
				this.debounce = 0;
			}else if (stick.value > 0){
				this.changeSelectedMenuIcon(this.getIncreasedIndex());
				this.debounce = 0;
			}
			break;
	}	
}

titleState.checkController = function(){
	var leftright = this.game.gamepads.gamepads[0].axis0;
	var updown = this.game.gamepads.gamepads[0].axis1;

	if(leftright.value < -0.5){
		if(Math.abs(updown.value) < 0.5){
			if(this.checkDebounce()){
				this.changeSelectedMenuIcon(this.getDecreasedIndex());
			}
		}
	}else if(leftright.value > 0.5){
		if(Math.abs(updown.value) < 0.5){
			if(this.checkDebounce()){
				this.changeSelectedMenuIcon(this.getIncreasedIndex());
			}
		}
	}else if(updown.value < -0.5){
		if(this.checkDebounce()){
			this.changeSelectedMenuIcon(this.getDecreasedIndex());
		}
	}else if(updown.value > 0.5){
		if(this.checkDebounce()){
			this.changeSelectedMenuIcon(this.getIncreasedIndex());
		}
	}

}

titleState.checkDebounce = function(){
	if(this.debounce == 15){
		this.debounce = 0;
		return true;
	}else{
		this.debounce++;
		return false;
	}
}

titleState.onPressTitle = function(keyCode){
	if(keyCode == Kiwi.Input.Keycodes.LEFT){
		this.changeSelectedMenuIcon(this.getDecreasedIndex());
	}else if(keyCode == Kiwi.Input.Keycodes.RIGHT){
		this.changeSelectedMenuIcon(this.getIncreasedIndex());
	}else if(keyCode == Kiwi.Input.Keycodes.UP){
		this.changeSelectedMenuIcon(this.getDecreasedIndex());
	}else if(keyCode == Kiwi.Input.Keycodes.DOWN){
		this.changeSelectedMenuIcon(this.getIncreasedIndex());
	}else if(keyCode == Kiwi.Input.Keycodes.TAB){
		this.changeSelectedMenuIcon(this.getIncreasedIndex());
	}else if(keyCode == Kiwi.Input.Keycodes.ENTER || keyCode == Kiwi.Input.Keycodes.SPACEBAR){
		this.selectedMenuIcon.playDown();
	}else if(keyCode == Kiwi.Input.Keycodes.I){

	}else if(keyCode == Kiwi.Input.Keycodes.Q){
		this.closeQuitDialog();
	}else if(keyCode == Kiwi.Input.Keycodes.ESC){
		this.showQuitDialog();
	}	
}

titleState.onKeyUpCallback = function(keyCode){
	if(keyCode == Kiwi.Input.Keycodes.ENTER || keyCode == Kiwi.Input.Keycodes.SPACEBAR){
		if(this.selectedMenuIcon){
			this.selectedMenuIcon.mouseClicked();
		}
	}	
}

titleState.onPressControls = function(keyCode){
	if(keyCode == Kiwi.Input.Keycodes.LEFT || keyCode == Kiwi.Input.Keycodes.RIGHT || keyCode == Kiwi.Input.Keycodes.UP || keyCode == Kiwi.Input.Keycodes.DOWN){
		this.selectedMenuIcon.animation.play('hover');
		this.selectedMenuIcon.alpha = 1;
	}else if(keyCode == Kiwi.Input.Keycodes.ENTER || keyCode == Kiwi.Input.Keycodes.SPACEBAR){
		this.selectedMenuIcon.playDown();
	}else if(keyCode == Kiwi.Input.Keycodes.I){
		console.log(this.selectedMenuIcon);
	}
}

titleState.removeAllGamepadSignals = function(){
	this.game.gamepads.gamepadConnected.removeAll();
	this.game.gamepads.gamepads[0].buttonOnUp.removeAll();
	this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	this.game.gamepads.gamepads[0].buttonIsDown.removeAll();
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.removeAll();
}

titleState.shutDown = function(){
	this.removeAllGamepadSignals();
	this.selectedMenuIcon = null;
	this.game.input.keyboard.onKeyDown.removeAll();
	this.game.input.keyboard.onKeyUp.removeAll();
	this.game.tweens.removeAll();
}
