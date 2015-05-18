var inputState = new Kiwi.State('inputState');

inputState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
}

inputState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.pressa = new Kiwi.GameObjects.StaticImage(this, this.textures['pressa'], this.STAGE_WIDTH/2, this.STAGE_HEIGHT/2);

	this.pressa.x -= this.pressa.box.bounds.width /2;
	this.pressa.y -= this.pressa.box.bounds.height /2;

	this.tween = this.game.tweens.create(this.pressa);

	this.addChild(this.pressa);

	if(this.game.gamepads){
		this.game.gamepads.gamepadConnected.add(this.gamepadConnected, this);
		this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUp, this);
	}

	this.game.input.keyboard.onKeyDown.add(this.onKeyDown, this);
	this.game.input.mouse.onUp.add(this.mouseClicked, this);
}

inputState.mouseClicked = function(){
	this.game.states.switchState('titleState');
}

inputState.gamepadConnected = function(){
	this.game.inputOptions.gamepad = true;
	this.game.states.switchState('titleState');
}

inputState.buttonOnUp = function(button){
	switch( button.name ){
		case "XBOX_A":
			this.gamepadConnected();
			break;
		default:	
			this.gamepadConnected();
	}
}

inputState.onKeyDown = function(keyCode){
	if(keyCode == Kiwi.Input.Keycodes.ENTER || keyCode == Kiwi.Input.Keycodes.SPACEBAR){
		this.game.states.switchState('titleState');
	}else if (keyCode == Kiwi.Input.Keycodes.ESC){
		//quit game.
	}
}

inputState.update = function(){
	Kiwi.State.prototype.update.call(this);
}

inputState.shutDown = function(){
	this.removeAllGamepadSignals();
	this.game.input.keyboard.onKeyDown.removeAll();
}

inputState.removeAllGamepadSignals = function(){
	this.game.gamepads.gamepadConnected.removeAll();
	this.game.gamepads.gamepads[0].buttonOnUp.removeAll();
	this.game.input.mouse.onUp.removeAll();
}