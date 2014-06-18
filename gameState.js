var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	//this.addTextureAtlas('textureAtlas','spritesheet.png','textureAtlasJSON','spritesheet.json');
	this.addSpriteSheet('sprites','all_spritesheet.png',54,54);
	this.addImage('background','canvas_1.png');
	this.addJSON('level1_tilemap','level1.json');
	this.addSpriteSheet('tiles','block_ladder.png',54,54);
}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(1080,810);

	this.mouse = this.game.input.mouse;

	this.ghoul = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],0,702);
	this.ghoul.animation.add('idleleft',[7],0.1,false);
	this.ghoul.animation.add('idleright',[4],0.1,false);
	this.ghoul.animation.play('idleleft');
	this.ghoul_facing = 'left';

	this.coinGroup = new Kiwi.Group(this);
	for(var i = 0; i<5;i++){
		var coin = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],370+(2+i)*74,854-7*73);
		coin.animation.add('spin',[8,9,10,11],0.1,true);
		coin.animation.play('spin');
		this.coinGroup.addChild(coin);
	}
	
	this.banditGroup = new Kiwi.Group(this);

	this.blue = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],0,0);

	this.blue_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.blue_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.blue_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.blue_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
	this.blue_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);

	this.blue.animation.add('climb',[48,49],0.1,true);
	this.blue.animation.add('idleleft',[47],0.1,false);
	this.blue.animation.add('idleright',[32],0.1,false);
	this.blue.animation.add('moveright',[33,34,35,36,37,38],0.1,true);
	this.blue.animation.add('moveleft',[46,45,44,43,42,41],0.1,true);
	this.blue.animation.add('fireleft',[40],0.1,false);
	this.blue.animation.add('fireright',[39],0.1,false);

	this.blue_facing = 'left';
	this.blue.animation.play('idleleft');

	this.red = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],400,300);

	this.red_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.red_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.red_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.red_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
	this.red_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	this.red.animation.add('climb',[0,1],0.1,true);
	this.red.animation.add('idleleft',[31],0.1,false);
	this.red.animation.add('idleright',[16],0.1,false);
	this.red.animation.add('moveright',[17,18,19,20,21,22],0.1,true);
	this.red.animation.add('moveleft',[30,29,28,27,26,25],0.1,true);
	this.red.animation.add('fireright',[23],0.1,false);
	this.red.animation.add('fireleft',[24],0.1,false);
	this.red.animation.add('idleclimb',[0],0.1,false);

	this.red_facing = 'left';
	this.red.animation.play('idleleft');
	this.banditGroup.addChild(this.blue);
	this.banditGroup.addChild(this.red);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'],0,0);

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level1_tilemap', this.textures.tiles);

	var blockArrays = this.parseBlocks('level1_tilemap');
	this.groundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[2]);
	this.ladderBlocks = this.getLadderBlocks(blockArrays[1],blockArrays[2]);
	this.topGroundBlocks = this.getTopBlocks(this.groundBlocks);
	this.topLadderBlocks = this.getTopBlocks(this.ladderBlocks);
	this.topTopLadderBlocks = this.getTopBlocks(this.topLadderBlocks);
	this.firstLadderBlocks = this.getFirstLadderBlocks(this.ladderBlocks);
	this.topTopGroundBlocks = this.getTopBlocks(this.topGroundBlocks);

	console.log(this.ladderBlocks);
	console.log(this.topLadderBlocks);

	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.tilemap.layers[1]);

	this.addChild(this.ghoul);
	
	this.addChild(this.banditGroup);
	this.addChild(this.coinGroup);


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

gameState.getGroundBlocks = function(groundLayerArray, width){
	var groundBlocks = [];
	var count = 0;
	for (var i = 0; i<groundLayerArray.length; i++){
		if(groundLayerArray[i] != 0){
			groundBlocks[count] = [this.getRow(i,width), this.getCol(i,width)];
			count ++;
		}
	}
	return groundBlocks;
	
}

gameState.getLadderBlocks = function(ladderLayerArray, width){
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

gameState.parseBlocks = function(level_tilemap){
	var json = JSON.parse(this.game.fileStore.getFile(level_tilemap).data);
	var groundLayerArray = json.layers[0].data;
	var ladderLayerArray = json.layers[1].data;
	var width = json.width;

	return [groundLayerArray, ladderLayerArray, width];
}

gameState.getTopBlocks = function(blocks){
	var topBlocks = [];
	var count = 0;
	for (var i = 0; i<blocks.length; i++){
		var row_minus_one = blocks[i][0] - 1;
		var col = blocks[i][1];
		var isTopBlock = true;

		if(row_minus_one>=0){
			for (var j = 0; j<blocks.length; j++){
				if(blocks[j][0] == row_minus_one && blocks[j][1] == col){
					isTopBlock = false;
				}
			}
			if(isTopBlock){
				topBlocks[count] = [row_minus_one, col];
				count ++;
			}
		}
	}
	return topBlocks;
}

gameState.getFirstLadderBlocks = function(ladderBlocks){
	var firstLadderBlocks = [];
	var count = 0;
	for (var i = 0; i<ladderBlocks.length; i++){
		var row_plus_one = ladderBlocks[i][0] + 1;
		var col = ladderBlocks[i][1];
		var isFirstLadderBlock = true;
		
		for (var j = 0; j<ladderBlocks.length; j++){
			if(ladderBlocks[j][0] == row_plus_one && ladderBlocks[j][1] == col){
				isFirstLadderBlock = false;
			}
		}
		if(isFirstLadderBlock){
			firstLadderBlocks[count] = [row_plus_one - 1, col];
			count ++;
		}
		
	}
	return firstLadderBlocks;
}


gameState.getRow = function(index,width){
	return Math.floor(index/width)+1;
}

gameState.getCol = function(index,width){
	return index%width+1;
}

gameState.getGridPosition = function(x,y,cardinal){
	switch (cardinal){
		case 'north':
			return [Math.floor((y-3)/54)+1, Math.floor((x+25)/54)+1];
		case 'south':
			return [Math.floor((y+54)/54)+1, Math.floor((x+25)/54)+1];
		default: 
			return 0;
	}
	return 0;
}

gameState.onBlockType = function(blocks, gridPosition){
	var blockPosition = null;
	for (var i = 0; i<blocks.length; i++){
		blockPosition = blocks[i];
		if(blockPosition[0]==gridPosition[0] && blockPosition[1] == gridPosition[1])
			return true;	
	}
	return false;
}
 
gameState.getPixelNumberForGridPosition = function(gridPosition, cardinal){
	switch (cardinal){
		case 'north':
			return (gridPosition[0]-1)*54; 
		case 'south':
			return gridPosition[0]*54 - 1;
		case 'west':
			return (gridPosition[1]-1)*54;
		case 'east':
			return gridPosition[1]*54 - 1;
	}
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
		if(this.blue.transform.x<1000)
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




	//red player 
 	if(this.red_fireKey.isDown){
		this.red.animation.play('fire' + this.red_facing);
	}
	else if(this.red_upKey.isDown){
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y, 'north');
		
		if(this.onBlockType(this.topLadderBlocks, red_gridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'north');
			if(this.red.transform.y>6+pixelNum){
				this.red.transform.y-=3;
				if(this.red.animation.currentAnimation.name!='climb'){
					this.red.animation.play('climb');
				}				
			}else{
				this.red.transform.y=pixelNum+2;
				if(this.red.animation.currentAnimation.name!='climb'){
					this.red.animation.play('climb');
				}				
			}
		}else if(this.onBlockType(this.ladderBlocks, red_gridPosition)){
			if(this.red.transform.y>3)
				this.red.transform.y-=3;
			if(this.red.animation.currentAnimation.name != 'climb')
				this.red.animation.play('climb');
		}
		
	}
	else if(this.red_rightKey.isDown){
		this.red_facing = 'right';
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
		var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'north');
		if(this.onBlockType(this.groundBlocks, red_gridPosition)){
			if(this.red.transform.y+54<pixelNum+3){
				this.red.transform.x+=5;
				if(this.red.animation.currentAnimation.name != 'moveright')
					this.red.animation.play('moveright');
			}
		}
	}
	else if(this.red_leftKey.isDown){
		this.red_facing = 'left';
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
		var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'north');		
		if(this.onBlockType(this.groundBlocks, red_gridPosition)){
			if(this.red.transform.y+54<pixelNum+3){
				this.red.transform.x-=5;
				if(this.red.animation.currentAnimation.name != 'moveleft')
					this.red.animation.play('moveleft');
			}
		}
	}
	else if(this.red_downKey.isDown){
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
		if(this.onBlockType(this.firstLadderBlocks,red_gridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'south');
			if(this.red.transform.y+54<pixelNum-3){
				this.red.transform.y+=3;
				if(this.red.animation.currentAnimation.name!='climb'){
					this.red.animation.play('climb');
				}				
			}
			else{
				this.red.transform.y=pixelNum-53+2; 
				if(this.red.animation.currentAnimation.name!='climb'){
					this.red.animation.play('climb');
				}
			}
		}
		else if(this.onBlockType(this.ladderBlocks, red_gridPosition)){
			if(this.red.transform.y<866)
				this.red.transform.y+=5;
			else
				this.red.transform.y = 866;
			if(this.red.animation.currentAnimation.name != 'climb')
				this.red.animation.play('climb');
		}
	}
	else {
		var red_belowFeetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y+1,'south');
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y-3,'south');
		if(this.onBlockType(this.ladderBlocks,red_belowFeetPosition) && !this.onBlockType(this.topLadderBlocks,red_gridPosition)){
			if(this.red.animation.currentAnimation.name != 'idleclimb')
				this.red.animation.play('idleclimb');
		}		
		else if(this.red.animation.currentAnimation.name != 'idle' + this.red_facing)
			this.red.animation.play('idle' + this.red_facing);	
	}

	this.checkCollision();
	this.isLevelOver();

	if(this.mouse.isDown){
		var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y, 'south');
		console.log(this.red.transform.x + ' ' + this.red.transform.y);
		console.log(red_gridPosition[0] + ' ' + red_gridPosition[1]);

	}
}