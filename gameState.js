var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	//this.addTextureAtlas('textureAtlas','spritesheet.png','textureAtlasJSON','spritesheet.json');
	this.addSpriteSheet('bandits','bandit_spritesheet.png',54,64);
	this.addImage('background','canvas_1.png');
	this.addImage('row_of_blocks','Block_row.png');
	this.addSpriteSheet('ghoul','ghoul_spritesheet.png',73,74);
	this.addImage('ladder','ladder_1.png');
	this.addSpriteSheet('coin','coin_spritesheet.png',74,75);
}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1480,1000);


	this.ghoul = new Kiwi.GameObjects.Sprite(this, this.textures['ghoul'],0,858);
	this.ghoul.animation.add('idleleft',[1],0.1,false);
	this.ghoul.animation.add('idleright',[4],0.1,false);
	this.ghoul.animation.play('idleleft');
	this.ghoul_facing = 'left';

	this.coinGroup = new Kiwi.Group(this);
	for(var i = 0; i<5;i++){
		var coin = new Kiwi.GameObjects.Sprite(this, this.textures['coin'],370+(2+i)*74,854-7*73);
		coin.animation.add('spin',[0,1,2,3],0.1,true);
		coin.animation.play('spin');
		this.coinGroup.addChild(coin);
	}
	
	this.banditGroup = new Kiwi.Group(this);

	this.blue = new Kiwi.GameObjects.Sprite(this, this.textures['bandits'],0,0);

	this.blue_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.blue_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.blue_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.blue_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
	this.blue_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);

	this.blue.animation.add('climb',[10,11],0.1,true);
	this.blue.animation.add('idleleft',[45],0.1,false);
	this.blue.animation.add('idleright',[26],0.1,false);
	this.blue.animation.add('moveright',[27,28,29,30,31,32],0.1,true);
	this.blue.animation.add('moveleft',[44,43,42,41,40,39],0.1,true);
	this.blue.animation.add('fireleft',[38],0.1,false);
	this.blue.animation.add('fireright',[33],0.1,false);

	this.blue_facing = 'left';
	this.blue.animation.play('idleleft');

	this.red = new Kiwi.GameObjects.Sprite(this, this.textures['bandits'],400,300);

	this.red_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.red_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.red_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.red_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
	this.red_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	this.red.animation.add('climb',[0,1],0.1,true);
	this.red.animation.add('idleleft',[21],0.1,false);
	this.red.animation.add('idleright',[2],0.1,false);
	this.red.animation.add('moveright',[3,4,5,6,7,8],0.1,true);
	this.red.animation.add('moveleft',[20,19,18,17,16,15],0.1,true);
	this.red.animation.add('fireright',[9],0.1,false);
	this.red.animation.add('fireleft',[14],0.1,false);

	this.red_facing = 'left';
	this.red.animation.play('idleleft');
	this.banditGroup.addChild(this.blue);
	this.banditGroup.addChild(this.red);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'],0,0);
	this.ground1 = new Kiwi.GameObjects.StaticImage(this, this.textures['row_of_blocks'],370,854-6*73);
	this.ground2 = new Kiwi.GameObjects.StaticImage(this, this.textures['row_of_blocks'],0,927);
	this.ladder1 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854);
	this.ladder2 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-73);
	this.ladder3 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-2*73);
	this.ladder4 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-3*73);
	this.ladder5 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-4*73);
	this.ladder6 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-5*73);
	this.ladder7 = new Kiwi.GameObjects.StaticImage(this, this.textures['ladder'],370,854-6*73);
	

	this.addChild(this.background);
	this.addChild(this.ground1);
	this.addChild(this.ground2);
	this.addChild(this.ladder1);
	this.addChild(this.ladder2);
	this.addChild(this.ladder3);
	this.addChild(this.ladder4);
	this.addChild(this.ladder5);
	this.addChild(this.ladder6);
	this.addChild(this.ladder7);
	this.addChild(this.ghoul);
	
	this.addChild(this.banditGroup);
	this.addChild(this.coinGroup);

}

gameState.checkCollision = function(){
	var coins = this.coinGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i <coins.length; i++){
		for (var j = 0; j<bandits.length; j++){
			var coinBox = coins[i].box.bounds;
			if(bandits[j].box.bounds.intersects(coinBox))
				coins[i].destroy();
		}
	}
}

gameState.update = function(){
	Kiwi.State.prototype.update.call(this);

	if(this.ghoul.transform.x<10){
		this.ghoul_facing = 'right';
	}else if(this.ghoul.transform.x>960){
		this.ghoul_facing = 'left';
	}
	if(this.ghoul_facing == 'left'){
		this.ghoul.animation.play('idleleft');
		this.ghoul.transform.x -=2;
	}
	else if (this.ghoul_facing == 'right'){
		this.ghoul.animation.play('idleright');
		this.ghoul.transform.x +=2;
	}	

	if(this.blue.transform.x<330){
		if(this.blue.transform.y<854){
			this.blue.transform.y +=13;
		}
		else if(this.blue.transform.y<864){
			this.blue.transform.y = 864;
		}
	}
	if(this.blue_fireKey.isDown){
		this.blue.animation.play('fire' + this.blue_facing);
	}	
	else if(this.blue_upKey.isDown){
		if(this.blue.transform.x>370 && this.blue.transform.x<400)
			if(this.blue.transform.y>353 && this.blue.transform.y<870)
				this.blue.transform.y-=3;
			if(this.blue.animation.currentAnimation.name != 'climb')
				this.blue.animation.play('climb');
			
	}
	else if(this.blue_rightKey.isDown){
		this.blue_facing = 'right';
		if(this.blue.transform.x<1500)
			this.blue.transform.x+=5;
		if(this.blue.animation.currentAnimation.name != 'moveright')
			this.blue.animation.play('moveright');
	}
	else if(this.blue_leftKey.isDown){
		this.blue_facing = 'left';
		if(this.blue.transform.x>3)
			this.blue.transform.x-=5;
		if(this.blue.animation.currentAnimation.name != 'moveleft')
			this.blue.animation.play('moveleft');
	}
	else if(this.blue_downKey.isDown){
		if(this.blue.transform.y<866)
			this.blue.transform.y+=5;
		else 
			this.blue.transform.y = 866;
		if(this.blue.animation.currentAnimation.name != 'climb')
			this.blue.animation.play('climb');
	}
	else {
		if(this.blue.animation.currentAnimation.name != 'idle' + this.blue_facing)
			this.blue.animation.play('idle' + this.blue_facing);
	}

 	if(this.red_fireKey.isDown){
		this.red.animation.play('fire' + this.red_facing);
	}
	else if(this.red_upKey.isDown){
		if(this.red.transform.y>3)
			this.red.transform.y-=3;
		if(this.red.animation.currentAnimation.name != 'climb')
			this.red.animation.play('climb');
		
	}
	else if(this.red_rightKey.isDown){
		this.red_facing = 'right';
		if(this.red.transform.x<1500)
			this.red.transform.x+=5;
		if(this.red.animation.currentAnimation.name != 'moveright')
			this.red.animation.play('moveright');
	}
	else if(this.red_leftKey.isDown){
		this.red_facing = 'left';
		if(this.red.transform.x>3)
			this.red.transform.x-=5;
		if(this.red.animation.currentAnimation.name != 'moveleft')
			this.red.animation.play('moveleft');
	}
	else if(this.red_downKey.isDown){
		if(this.red.transform.y<866)
			this.red.transform.y+=10;
		else
			this.red.transform.y = 866;
		if(this.red.animation.currentAnimation.name != 'climb')
			this.red.animation.play('climb');
	}
	else {
		if(this.red.animation.currentAnimation.name != 'idle' + this.red_facing)
			this.red.animation.play('idle' + this.red_facing);
	}

	this.checkCollision();
}