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
	this.addJSON('level1_tilemap','level1.json');
	this.addSpriteSheet('tiles','block_ladder.png',74,74);
}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1480,1110);

	this.ladder = new Kiwi.GameObjects.Sprite(this, this.textures['tiles'],0,0);
	this.ladder.animation.add('idle',[3],0.1,false);
	this.ladder.animation.play('idle');

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

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level1_tilemap', this.textures.tiles);

	this.ladderBlocks = this.getLadderBlocks();
	this.topLadderBlocks = this.getTopLadderBlocks();

	console.log(this.ladderBlocks);
	console.log(this.topLadderBlocks);

	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.tilemap.layers[1]);

	this.addChild(this.ghoul);
	
	this.addChild(this.banditGroup);
	this.addChild(this.coinGroup);
	this.addChild(this.ladder);

	this.timer = this.game.time.clock.createTimer('levelOver',.5,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);
	

}

gameState.checkCollision = function(){
	var coins = this.coinGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i <coins.length; i++){
		for (var j = 0; j<bandits.length; j++){
			var coinBox = coins[i].box.bounds;
			if(bandits[j].box.bounds.intersects(coinBox)){
				coins[i].destroy();
			}
		}
	}
}

gameState.getLadderBlocks = function(){
	var json = JSON.parse(this.game.fileStore.getFile('level1_tilemap').data);
	var ladderLayerArray = json.layers[1].data;
	console.log(json);
	var width = json.width;
	var ladderBlocks = [];
	var count = 0;
	for (var i = 0; i <ladderLayerArray.length; i++){
		if(ladderLayerArray[i] == 4){
			ladderBlocks[count] = [this.getRow(i,width), this.getCol(i,width)];
			count ++;
		}
	}
	return ladderBlocks;

}

gameState.getTopLadderBlocks = function(){
	var topLadderBlocks = [];
	var count = 0;
	for (var i = 0; i<this.ladderBlocks.length; i++){
		var row_minus_one = this.ladderBlocks[i][0] - 1;
		var col = this.ladderBlocks[i][1];
		var isTopLadderBlock = true;

		if(row_minus_one>=0){
			for (var j = 0; j<this.ladderBlocks.length; j++){
				if(this.ladderBlocks[j][0] == row_minus_one && this.ladderBlocks[j][1] == col){
					isTopLadderBlock = false;
				}
			}
			if(isTopLadderBlock){
				topLadderBlocks[count] = [row_minus_one, col];
				count ++;
			}
		}
	}
	return topLadderBlocks;
}

gameState.getRow = function(index,width){
	return Math.floor(index/width)+1;
}

gameState.getCol = function(index,width){
	return index%width+1;
}

gameState.getGridPosition = function(x,y){
	return [Math.floor(y/74)+1, Math.floor(x/74)+1];
}

gameState.onLadder = function(gridPosition){
	var ladderPosition = null;
	for(var i = 0; i<this.ladderBlocks.length; i++){
		ladderPosition = this.ladderBlocks[i];
		console.log(ladderPosition);
		console.log(gridPosition);
		if(ladderPosition[0]==gridPosition[0] && ladderPosition[1] == gridPosition[1])
			return true;
	}
	return false;
}

gameState.onTopLadder = function(gridPosition){
	var ladderPosition = null;
	for(var i = 0; i<this.topLadderBlocks.length; i++){
		ladderPosition = this.topLadderBlocks[i];
		if(ladderPosition[0]==gridPosition[0] && ladderPosition[1] == gridPosition[1])
			return true;
	}
	return false;	
}

gameState.levelOver = function(){
	this.game.states.switchState('titleState');
}

gameState.isLevelOver = function(){
	if(this.coinGroup.members.length==0){	
		this.timer.start();
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
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y);
		if(this.onLadder(red_gridPosition)){
			if(this.red.transform.y>3)
				this.red.transform.y-=3;
			if(this.red.animation.currentAnimation.name != 'climb')
				this.red.animation.play('climb');
		}else if(this.onTopLadder(red_gridPosition)){
			if(this.red.transform.y>3)
				this.red.transform.y-=3;
			if(this.red.animation.currentAnimation.name != 'climb')
				this.red.animation.play('climb');
		}
		
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
	this.isLevelOver();
}