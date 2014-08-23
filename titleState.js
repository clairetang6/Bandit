var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');
	this.addImage('lose','gameover.png');
	this.addImage('win','bandit_win.png');

	this.addAudio('bombSound','sounds/Cannon-SoundBible.com-1661203605.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);
	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);




	this.addChild(this.background);

	this.mouse = this.game.input.mouse;



}

titleState.start_game = function(){
	this.game.states.switchState('gameState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());
	if(this.mouse.isDown){		
	
		if(this.mouse.x > 350 && this.mouse.x < 650){
			if(this.mouse.y > 540 && this.mouse.y < 590){
				this.game.numPlayers = 1;
				this.game.states.switchState('gameState');
			}else if(this.mouse.y > 590 && this.mouse.y < 650){
				this.game.numPlayers = 2;
				this.game.states.switchState('gameState');
			}

		}
		
	}
}

