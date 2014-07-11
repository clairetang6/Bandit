var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');
	this.currentLevel = 1;
	this.numberOfLevels = 10;

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'level'+i+'_screen.png');
	}
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1080,810);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);
	this.level1 = new Kiwi.GameObjects.StaticImage(this, this.textures['level1'],0,0);



	this.addChild(this.background);

	this.mouse = this.game.input.mouse;


	this.timer = this.game.time.clock.createTimer('start_game',1,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.start_game,this);
	
	//this.game.states.switchState('gameState')

}

titleState.start_game = function(){
	this.game.states.switchState('gameState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());
	if(this.mouse.isDown){
		this.addChild(this.level1);
		
		this.timer.start();
	
		
		//this.game.states.switchState('gameState');
	}
}

