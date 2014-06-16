
var myGame = new Kiwi.Game();

var myState = new Kiwi.State('myState');

myState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	//this.addTextureAtlas('textureAtlas','spritesheet.png','textureAtlasJSON','spritesheet.json');
	this.addSpriteSheet('characters','spritesheet.png',59,77);
	this.addImage('background','f22_A.png');
	this.addImage('row_of_blocks','Block_row.png');
}

myState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1500,1000);

	//this.blue = new Kiwi.GameObjects.Sprite(this, this.textures.textureAtlas, 350, 300);
	//this.blue.animation.switchTo(0);

	this.blue = new Kiwi.GameObjects.Sprite(this, this.textures['characters'],350,300);

	this.blue_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.blue_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.blue_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.blue_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);

	this.blue.animation.add('idleleft',[2],0.1,false);
	this.blue.animation.add('idleright',[3],0.1,false);

	this.blue_facing = 'left';
	this.blue.animation.play('idleleft');

	this.red = new Kiwi.GameObjects.Sprite(this, this.textures['characters'],400,300);

	this.red_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.red_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.red_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.red_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);

	this.red.animation.add('idleleft',[0],0.1,false);
	this.red.animation.add('idleright',[1],0.1,false);

	this.red_facing = 'left';
	this.red.animation.play('idleleft');

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'],20,20);
	this.ground = new Kiwi.GameObjects.StaticImage(this, this.textures['row_of_blocks'],400,373);

	this.addChild(this.background);
	this.addChild(this.ground);
	this.addChild(this.blue);
	this.addChild(this.red);

}

myState.update = function(){
	Kiwi.State.prototype.update.call(this);
	if(this.blue_upKey.isDown){
		if(this.blue.transform.y>3)
			this.blue.transform.y-=3;
	}
	else if(this.blue_rightKey.isDown){
		this.blue_facing = 'right';
		if(this.blue.transform.x<1500)
			this.blue.transform.x+=3;
		if(this.blue.animation.currentAnimation.name != 'idleright')
			this.blue.animation.play('idleright');
	}
	else if(this.blue_leftKey.isDown){
		this.blue_facing = 'left';
		if(this.blue.transform.x>3)
			this.blue.transform.x-=3;
		if(this.blue.animation.currentAnimation.name != 'idleleft')
			this.blue.animation.play('idleleft');
	}
	else if(this.blue_downKey.isDown){
		if(this.blue.transform.y<600)
			this.blue.transform.y+=3;
	}

	if(this.red_upKey.isDown){
		if(this.red.transform.y>3)
			this.red.transform.y-=3;
	}
	else if(this.red_rightKey.isDown){
		this.red_facing = 'right';
		if(this.red.transform.x<1500)
			this.red.transform.x+=3;
		if(this.red.animation.currentAnimation.name != 'idleright')
			this.red.animation.play('idleright');
	}
	else if(this.red_leftKey.isDown){
		this.red_facing = 'left';
		if(this.red.transform.x>3)
			this.red.transform.x-=3;
		if(this.red.animation.currentAnimation.name != 'idleleft')
			this.red.animation.play('idleleft');
	}
	else if(this.red_downKey.isDown){
		if(this.red.transform.y<600)
			this.red.transform.y+=3;
	}
}

myGame.states.addState(myState);
myGame.states.switchState('myState');