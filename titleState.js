var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1480,1000);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);

	this.addChild(this.background);

	this.mouse = this.game.input.mouse;


	//this.game.states.switchState('gameState')

}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	if(this.mouse.isDown){
		this.game.states.switchState('gameState');
	}
}