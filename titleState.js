var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');
	this.addImage('lose','gameover.png');
	this.addImage('win','bandit_win.png');
	this.addImage('controls','controls_1.png');

	this.addAudio('bombSound','sounds/Cannon-SoundBible.com-1661203605.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
	this.addAudio('shotgunSound','sounds/shotgun.wav');
	this.addAudio('voicesSound','voices/bandit_voices.wav');

}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);
	this.controlsScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['controls'],0,-1000);



	this.addChild(this.background);
	this.addChild(this.controlsScreen);
	this.showingControls = false;

	this.mouse = this.game.input.mouse;



}

titleState.start_game = function(){
	this.game.states.switchState('gameState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());
	if(this.mouse.isDown){		

		console.log(this.mouse._cursor.x + ' ' + this.mouse._cursor.y);
		
		if(!this.showingControls){
			if(this.mouse.x > 300 && this.mouse.x < 700){
				if(this.mouse.y > 450 && this.mouse.y < 490){
					this.game.numPlayers = 1;
					this.game.states.switchState('gameState');
				}else if(this.mouse.y > 500 && this.mouse.y < 560){
					this.game.numPlayers = 2;
					this.game.states.switchState('gameState');
				}else if(this.mouse.y > 620 && this.mouse.y < 670){
					this.controlsScreen.y = 0;
					this.showingControls = true;
				}

			}
		}else{
			if(this.mouse.x > 50 && this.mouse.x < 250){
				if(this.mouse.y < 730 && this.mouse.y > 620){
					this.controlsScreen.y = -1000;
					this.showingControls = false;
				}
			}
		}
		
		
	}
}

