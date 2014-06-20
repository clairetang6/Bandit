var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	//this.addTextureAtlas('textureAtlas','spritesheet.png','textureAtlasJSON','spritesheet.json');
	this.addSpriteSheet('sprites','all_spritesheet.png',54,54);
	this.addImage('background','canvas_2.png');
	this.addSpriteSheet('background_spritesheet','canvas_2.png',54,54);
	this.addJSON('level_tilemap','level2.json');
	this.addSpriteSheet('tiles','block_ladder.png',54,54);
}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.STAGE_WIDTH = 1080;
	this.STAGE_HEIGHT = 810;

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.mouse = this.game.input.mouse;

	var blockArrays = this.parseBlocks('level_tilemap');



	this.banditGroup = new Kiwi.Group(this);

	this.coinGroup = new Kiwi.Group(this);
	var coinsLayerArray = blockArrays[2];
	var width = blockArrays[4];
	var tileWidth = blockArrays[3];
	for(var i = 0; i<coinsLayerArray.length;i++){
		if(coinsLayerArray[i]!=0){
			var coinPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var coin = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],coinPixels[0],coinPixels[1]);
			coin.animation.add('spin',[8,9,10,11],0.1,true);
			coin.animation.play('spin');
			this.coinGroup.addChild(coin);
		}
	}

	this.ghoulGroup = new Kiwi.Group(this);
	var ghoulsLayerArray = blockArrays[5];
	for(var i = 0; i<ghoulsLayerArray.length;i++){
		if(ghoulsLayerArray[i]==11){
			var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var ghoul = new Ghoul(this,ghoulPixels[0],ghoulPixels[1],'left');
		 	ghoul.animation.add('idleleft',[7],0.1,false);
			ghoul.animation.add('idleright',[4],0.1,false);
			ghoul.animation.play('idleleft');
			//ghoul_facing = 'left';
			this.ghoulGroup.addChild(ghoul);
		}
	}
	
	

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
	this.blue.animation.add('idleclimb',[49],0.1,false);

	this.blue_facing = 'left';
	this.blue.animation.play('idleleft');

	this.red = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],0,0);

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

	this.red_canShoot = true;
	this.blue_canShoot = true;

	this.banditGroup.addChild(this.blue);
	this.banditGroup.addChild(this.red);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'],0,0);

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level_tilemap', this.textures.tiles);

	
	this.groundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[4]);
	this.ladderBlocks = this.getLadderBlocks(blockArrays[1],blockArrays[4]);
	this.firstLadderBlocks = this.getFirstLadderBlocks(this.ladderBlocks);
	this.topLadderBlocks = this.getTopBlocks(this.ladderBlocks);
	
	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();
	

	this.hiddenBlockGroup = new Kiwi.Group(this);


	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.coinGroup);
	
	this.addChild(this.ghoulGroup);
	
	this.addChild(this.banditGroup);
	console.log(this.coinGroup);
	


	this.timer = this.game.time.clock.createTimer('levelOver',.5,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);
	
}


gameState.updateBlockedBlocks = function(){
	this.leftBlockedBlocks = this.getBlockedBlocks(this.groundBlocks,'left');
	this.rightBlockedBlocks = this.getBlockedBlocks(this.groundBlocks,'right');
}

gameState.updateTopGroundBlocks = function(){
	this.topGroundBlocks = this.getTopBlocks(this.groundBlocks);
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

var Ghoul = function(state, x, y, facing){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.facing = facing; 

	Ghoul.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		var rightGridPosition = state.getGridPosition(this.x, this.y, 'east');
		var leftGridPosition = state.getGridPosition(this.x, this.y, 'west');
		var shouldTurn = false;		

		switch(this.facing){
			case 'left':
				var checkForGroundBlockPosition = [rightGridPosition[0], rightGridPosition[1]-1];
				var checkForRightBlockedBlockPosition = [rightGridPosition[0]+1, rightGridPosition[1]-1];

				for (var i =0; i<state.groundBlocks.length; i++){
					if(state.groundBlocks[i][0] == checkForGroundBlockPosition[0] && state.groundBlocks[i][1] == checkForGroundBlockPosition[1]){
						shouldTurn = true;
						break;
					}
				}
				for (var i =0; i<state.rightBlockedBlocks.length; i++){
					if(state.rightBlockedBlocks[i][0] == checkForRightBlockedBlockPosition[0] && state.rightBlockedBlocks[i][1] == checkForRightBlockedBlockPosition[1]){
						shouldTurn = true;
						break;
					}
				}

				break;
			case 'right':
				var checkForGroundBlockPosition = [leftGridPosition[0], leftGridPosition[1]+1];
				var checkForLeftBlockedBlockPosition = [leftGridPosition[0]+1, leftGridPosition[1]+1];

				for (var i =0; i<state.groundBlocks.length; i++){
					if(state.groundBlocks[i][0] == checkForGroundBlockPosition[0] && state.groundBlocks[i][1] == checkForGroundBlockPosition[1]){
						shouldTurn = true;
						break;
					}
				}
				for (var i =0; i<state.leftBlockedBlocks.length; i++){
					if(state.leftBlockedBlocks[i][0] == checkForLeftBlockedBlockPosition[0] && state.leftBlockedBlocks[i][1] == checkForLeftBlockedBlockPosition[1]){
						shouldTurn = true;
						break;
					}
				}
				break;
		}

		if (shouldTurn){
			switch(this.facing){
				case 'left':
					this.facing = 'right';
					this.animation.play('idleright');
					break;
				case 'right':
					this.facing = 'left';
					this.animation.play('idleleft');
					break;
			}
		}

		switch(this.facing){
			case 'left':
				this.x -= 1;
				break;
			case 'right':
				this.x += 1;
				break;
		}

		

	}
}
Kiwi.extend(Ghoul, Kiwi.GameObjects.Sprite);

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


gameState.getBlockedBlocks = function(groundBlocks, direction){
	var blockedBlocks = [];
	var count = 0;
	var col_change = 0;
	switch (direction){
		case 'left': 
			col_change = 1;
			break;
		case 'right':
			col_change = -1;
			break;
	}
	for (var i = 0; i <groundBlocks.length; i++){
		var row = groundBlocks[i][0];
		var col_different = groundBlocks[i][1] + col_change;
		var isBlockedBlock = true;
		if(col_different<21 && col_different >0){
			for (var j = 0; j<groundBlocks.length; j++){
				if(groundBlocks[j][0] == row && groundBlocks[j][1] == col_different){
					isBlockedBlock = false;
				}
			}
		}else{
			isBlockedBlock = false;
		}
		if(isBlockedBlock){
			blockedBlocks[count] = [row, col_different];
			count ++;
		}
	}
	console.log('updated blocked blocks' + direction);
	return blockedBlocks;
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

gameState.parseBlocks = function(level_tilemap){
	var json = JSON.parse(this.game.fileStore.getFile(level_tilemap).data);
	var groundLayerArray = json.layers[0].data;
	var ladderLayerArray = json.layers[1].data;
	var ghoulsLayerArray = json.layers[2].data;
	var coinsLayerArray = json.layers[3].data;
	var width = json.width;
	var tileWidth = json.tilewidth;

	return [groundLayerArray, ladderLayerArray, coinsLayerArray, tileWidth, width, ghoulsLayerArray];
}

gameState.getPixelPositionFromArrayIndex = function(index, tileWidth, width){
	var row = this.getRow(index,width);
	var col = this.getCol(index,width);
	return [(col-1)*tileWidth, (row-1)*tileWidth];
}

gameState.getPixelPositionFromRowCol = function(row, col){
	return [(col-1)*54, (row-1)*54];
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
		case 'east':
			return [Math.floor((y+51)/54)+1, Math.floor((x+53)/54+1)];
		case 'west':
			return [Math.floor((y+51)/54)+1, Math.floor((x+1)/54+1)];
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

gameState.getBlastedBlockPosition = function(gridPosition, facing, groundBlocks){
	var firedPosition = [0,0];
	switch(facing){
		case 'left':
			if(gridPosition[1]-1>0 && gridPosition[0]+1<16){
				firedPosition[0] = gridPosition[0]+1;
				firedPosition[1] = gridPosition[1]-1;
			}
			break;
		case 'right':
			if(gridPosition[1]+1<21 && gridPosition[0]+1<16){
				firedPosition[0] = gridPosition[0]+1;
				firedPosition[1] = gridPosition[1]+1;
			}
			break;
	}
	return firedPosition;
}

gameState.levelOver = function(){
	this.game.states.switchState('titleState');
}

gameState.isLevelOver = function(){
	if(this.coinGroup.members.length==0){	
		this.timer.start();
	}
}

gameState.getArrayIndexFromRowCol = function(row, col){
	return (row-1)*20 + col-1;
}

gameState.blastBlock = function(blastedBlockPosition){
	var pixels = this.getPixelPositionFromRowCol(blastedBlockPosition[0],blastedBlockPosition[1]);
	var hiddenBlock = new Kiwi.GameObjects.Sprite(this, this.textures['background_spritesheet'],pixels[0],pixels[1]);
	hiddenBlock.animation.add('hide',[this.getArrayIndexFromRowCol(blastedBlockPosition[0],blastedBlockPosition[1])],0.1,false);
	hiddenBlock.animation.play('hide');
	this.hiddenBlockGroup.addChild(hiddenBlock);
	this.removeFromGroundBlocks(blastedBlockPosition);
	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();
}

gameState.removeFromGroundBlocks = function(blastedBlockPosition){
	var index = null;
	for (var i =0; i<this.groundBlocks.length; i++){
		if(this.groundBlocks[i][0] == blastedBlockPosition[0] && this.groundBlocks[i][1] == blastedBlockPosition[1]){
			index = i;
		}
	}
	if(index){
		this.groundBlocks.splice(index,1);
		console.log('blasted1');
	}
}

gameState.update = function(){
	Kiwi.State.prototype.update.call(this);

/*
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
*/

	//blue player 
	var blue_southGridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y,'south');
 	var blue_belowFeetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y+1,'south');
 	var blue_feetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y-3,'south');	
 	if(!(this.onBlockType(this.ladderBlocks,blue_southGridPosition) || this.onBlockType(this.groundBlocks, blue_southGridPosition))){
 		if(this.onBlockType(this.topGroundBlocks,blue_southGridPosition)){
 			var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
 			if(this.blue.transform.y+54<pixelNum-26)
 				this.blue.transform.y+=13;
 			else
 				this.blue.transform.y=pixelNum-53+2;
 		}else{
 			if(this.blue.transform.y+54<54*15-14)
 				this.blue.transform.y+=13;
 			else
 				this.blue.transform.y=54*15-54;
 		}
 	}
 	if(this.blue_fireKey.isDown){
		this.blue.animation.play('fire' + this.blue_facing);
		if(this.blue_canShoot){
			var blastedBlockPosition = this.getBlastedBlockPosition(blue_feetPosition, this.blue_facing, this.groundBlocks);
			this.blastBlock(blastedBlockPosition);
		}
	}
	else if(this.blue_upKey.isDown){
		var blue_gridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y, 'north');
		
		if(this.onBlockType(this.topLadderBlocks, blue_gridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(blue_gridPosition,'north');
			if(this.blue.transform.y>6+pixelNum){
				this.blue.transform.y-=3;
				if(this.blue.animation.currentAnimation.name!='climb'){
					this.blue.animation.play('climb');
				}				
			}else{
				this.blue.transform.y=pixelNum+2;
				if(this.blue.animation.currentAnimation.name!='climb'){
					this.blue.animation.play('climb');
				}				
			}
		}else if(this.onBlockType(this.ladderBlocks, blue_gridPosition)){
			if(this.blue.transform.y>3)
				this.blue.transform.y-=3;
			if(this.blue.animation.currentAnimation.name != 'climb')
				this.blue.animation.play('climb');
		}
		
	}
	else if(this.blue_rightKey.isDown){
		this.blue_facing = 'right';
		if(this.onBlockType(this.rightBlockedBlocks, blue_feetPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(blue_feetPosition,'east');
			if(this.blue.transform.x+54<pixelNum-6){
				this.blue.transform.x +=5;
			}else{
				this.blue.transform.x = pixelNum-51;
			}
		}
		else{
			if(!this.onBlockType(this.groundBlocks, blue_feetPosition)){
				if(this.blue.transform.x<this.STAGE_WIDTH-54-6){
					this.blue.transform.x+=5;
					if(this.blue.animation.currentAnimation.name != 'moveright')
						this.blue.animation.play('moveright');
				}
			}
		}
	}
	else if(this.blue_leftKey.isDown){
		this.blue_facing = 'left';
		if(this.onBlockType(this.leftBlockedBlocks, blue_feetPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(blue_feetPosition,'west');
			if(this.blue.transform.x>pixelNum+6){
				this.blue.transform.x-=5;
			}else{
				this.blue.transform.x = pixelNum;
			}
		}else{
			if(!this.onBlockType(this.groundBlocks, blue_feetPosition)){
				if(this.blue.transform.x>10){
					this.blue.transform.x-=5;
					if(this.blue.animation.currentAnimation.name != 'moveleft')
						this.blue.animation.play('moveleft');
				}
			}
		}
	}
	else if(this.blue_downKey.isDown){
		if(this.onBlockType(this.firstLadderBlocks,blue_southGridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
			if(this.blue.transform.y+54<pixelNum-6){
				this.blue.transform.y+=3;
				if(this.blue.animation.currentAnimation.name!='climb'){
					this.blue.animation.play('climb');
				}				
			}
			else{
				this.blue.transform.y=pixelNum-53+2; 
				if(this.blue.animation.currentAnimation.name!='climb'){
					this.blue.animation.play('climb');
				}
			}
		}
		else if(this.onBlockType(this.ladderBlocks, blue_southGridPosition)){
			if(this.blue.transform.y<866)
				this.blue.transform.y+=5;
			else
				this.blue.transform.y = 866;
			if(this.blue.animation.currentAnimation.name != 'climb')
				this.blue.animation.play('climb');
		}
	}
	else {
		if(this.onBlockType(this.ladderBlocks,blue_belowFeetPosition) && !this.onBlockType(this.topLadderBlocks,blue_feetPosition)){
			if(this.blue.animation.currentAnimation.name != 'idleclimb')
				this.blue.animation.play('idleclimb');
		}		
		else if(this.blue.animation.currentAnimation.name != 'idle' + this.blue_facing)
			this.blue.animation.play('idle' + this.blue_facing);	
	}


	//red player 
	var red_southGridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
 	var red_belowFeetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y+1,'south');
 	var red_feetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y-3,'south');	
 	var red_rightGridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'east');
 	var red_leftGridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y, 'west');
 	if(!(this.onBlockType(this.ladderBlocks,red_southGridPosition) || this.onBlockType(this.groundBlocks, red_southGridPosition))){
 		if(this.onBlockType(this.topGroundBlocks,red_southGridPosition)){
 			var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'south');
 			if(this.red.transform.y+54<pixelNum-26)
 				this.red.transform.y+=13;
 			else
 				this.red.transform.y=pixelNum-53+2;
 		}else{
 			if(this.red.transform.y+54<54*15-14)
 				this.red.transform.y+=13;
 			else
 				this.red.transform.y=54*15-54;
 		}
 	}
 	if(this.red_fireKey.isDown){
		this.red.animation.play('fire' + this.red_facing);
		if(this.red_canShoot){
			var blastedBlockPosition = this.getBlastedBlockPosition(red_feetPosition, this.red_facing, this.groundBlocks);
			this.blastBlock(blastedBlockPosition);
		}
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
		if(this.onBlockType(this.rightBlockedBlocks, red_leftGridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(red_leftGridPosition,'east');
			if(this.red.transform.x+54<pixelNum-6){
				this.red.transform.x +=5;
			}else{
				this.red.transform.x = pixelNum-51;
			}
		}
		else{
			if(!this.onBlockType(this.groundBlocks, red_rightGridPosition)){
				if(this.red.transform.x<this.STAGE_WIDTH-54-6){
					this.red.transform.x+=5;
					if(this.red.animation.currentAnimation.name != 'moveright')
						this.red.animation.play('moveright');
				}
			}
		}
	}
	else if(this.red_leftKey.isDown){
		this.red_facing = 'left';
		if(this.onBlockType(this.leftBlockedBlocks, red_feetPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(red_feetPosition,'west');
			if(this.red.transform.x>pixelNum+6){
				this.red.transform.x-=5;
			}else{
				this.red.transform.x = pixelNum;
			}
		}else{
			if(!this.onBlockType(this.groundBlocks, red_feetPosition)){
				if(this.red.transform.x>10){
					this.red.transform.x-=5;
					if(this.red.animation.currentAnimation.name != 'moveleft')
						this.red.animation.play('moveleft');
				}
			}
		}
	}
	else if(this.red_downKey.isDown){
		if(this.onBlockType(this.firstLadderBlocks,red_southGridPosition)){
			var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'south');
			if(this.red.transform.y+54<pixelNum-6){
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
		else if(this.onBlockType(this.ladderBlocks, red_southGridPosition)){
			if(this.red.transform.y<866)
				this.red.transform.y+=5;
			else
				this.red.transform.y = 866;
			if(this.red.animation.currentAnimation.name != 'climb')
				this.red.animation.play('climb');
		}
	}
	else {
		if(this.onBlockType(this.ladderBlocks,red_belowFeetPosition) && !this.onBlockType(this.topLadderBlocks,red_feetPosition)){
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
		console.log(this.leftBlockedBlocks);

	}
}