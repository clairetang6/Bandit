var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'level'+i+'_screen.png',true);
	}	

	for (var i = 1; i<=this.numberOfLevels; i++){
		if(i>=11){
		this.addImage('background'+i,'canvas_'+9+'.png',true);
	
		}else{
		this.addImage('background'+i,'canvas_'+i+'.png',true);

		}
	}
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1080,810);

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
	
	
		
		this.game.states.switchState('gameState');
	}
}

