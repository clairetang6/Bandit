var Bandit = function(state, x, y, color){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state; 
	this.color = color; 
	this.bombsCollected = 0;
	this.bombs = [];
	this.bombClock = this.state.game.time.addClock(color+'BombClock',100);
	this.bombClock.start();
	this.bombIconGroup = this.state.bombIconGroup;
	this.isAlive = true;
	this.isDeadAndOnGround = false;
	this.facing = 'left';
	this.canShoot = true; 
	this.numberOfHearts = 3;
	this.deathCounter = 0;
	this.startingPixelLocations = null;
	this.coinsCollected = 0;
	this.totalCoinsCollected = 0;
	this.bps = this.state.bps;

	var banditHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	var banditHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);

	this.box.hitbox = new Kiwi.Geom.Rectangle(banditHitboxX, banditHitboxY, this.state.bps-2*banditHitboxX,this.state.bps-2*banditHitboxY);

	switch(color){
		case 'blue':
			this.animation.add('climb',[53,54],0.1,true);
			this.animation.add('idleleft',[33],0.1,false);
			this.animation.add('idleright',[25],0.1,false);
			this.animation.add('moveright',[19,20,21,22,23,24],0.1,true);
			this.animation.add('moveleft',[32,31,30,29,28,27],0.1,true);
			this.animation.add('fireleft',[26],0.1,false);
			this.animation.add('fireright',[18],0.1,false);
			this.animation.add('idleclimb',[53],0.1,false);
			this.animation.add('die',[55],0.1,false);
			this.leftKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
			this.rightKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
			this.upKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
			this.downKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
			this.fireKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);
			break;
		case 'red':
			this.animation.add('climb',[81,82],0.1,true);
			this.animation.add('idleleft',[15],0.1,false);
			this.animation.add('idleright',[0],0.1,false);
			this.animation.add('moveright',[1,2,3,4,5,6],0.1,true);
			this.animation.add('moveleft',[14,13,12,11,10,9],0.1,true);
			this.animation.add('fireright',[7],0.1,false);
			this.animation.add('fireleft',[8],0.1,false);
			this.animation.add('idleclimb',[81],0.1,false);
			this.animation.add('die',[83],0.1,false);
			this.leftKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
			this.rightKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
			this.upKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
			this.downKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
			this.fireKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

			break;
	}
}
Kiwi.extend(Bandit, Kiwi.GameObjects.Sprite);

Bandit.prototype.deathCount = function(){
	if(this.deathCounter < 100){
		if(this.deathCounter == 1){
			switch(this.color){
				case 'red':
					var heartGroup = this.state.redHeartsGroup;
					break;
				case 'blue':
					var heartGroup = this.state.blueHeartsGroup;
					break;
			}
			var hearts = heartGroup.members;
			for(var i = 0; i<hearts.length; i++){
				hearts[i].disappear();
			}
		}
		this.deathCounter++;
		this.animation.play('die');
	}else{
		this.numberOfHearts--;
		if(this.numberOfHearts>0){
			this.x = this.startingPixelLocations[0];
			this.y = this.startingPixelLocations[1];
			this.isAlive = true;
			this.isDeadAndOnGround = false;
			this.animation.play('idleleft');
			this.state.showHearts(this.color);
			this.deathCounter = 0;
		}
	}
}

Bandit.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.state.showingLevelScreen == false){
		if(!this.isDeadAndOnGround){
			var southGridPosition = this.state.getGridPosition(this.x, this.y,'south');
		 	if(this.isAlive){
			 	if(!(this.state.onBlockType(this.state.ladderBlocks,southGridPosition) || this.state.onBlockType(this.state.groundBlocks, southGridPosition))){
			 		this.gravity(southGridPosition);
			 	}
			}else{
				if(this.state.onBlockType(this.state.ladderBlocks,southGridPosition) || !this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
					this.gravity(southGridPosition);
				}
			}
		}
		if(this.isAlive){		 	
		 	if(this.fireKey.isDown){
				this.animation.play('fire' + this.facing);
				if(this.canShoot){
					var blastedBlockPosition = this.state.getBlastedBlockPosition(southGridPosition, this.facing, this.state.groundBlocks);
					this.state.blastBlock(blastedBlockPosition);
				}
			}
			else if(this.upKey.isDown){
				var gridPosition = this.state.getGridPosition(this.x, this.y, 'north');
				var ladderPixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'west') + this.bps/2;
				if(this.x+this.bps/2>ladderPixelNum-15 && this.x+this.bps/2<ladderPixelNum+15){	
					if(this.state.onBlockType(this.state.topLadderBlocks, gridPosition)){
						var pixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'north');
						if(this.y>6+pixelNum){
							this.y-=3;
							if(this.animation.currentAnimation.name!='climb'){
								this.animation.play('climb');
							}				
						}else{
							this.y=pixelNum;
							this.animation.play('idle'+this.facing);			
						}
					}else if(this.state.onBlockType(this.state.ladderBlocks, gridPosition)){
						if(this.y>3)
							this.y-=3;
						if(this.animation.currentAnimation.name != 'climb')
							this.animation.play('climb');
					}
				}
			}
			else if(this.rightKey.isDown){
				this.facing = 'right';
				if(this.state.onBlockType(this.state.rightBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'east');
					if(this.x+this.bps<pixelNum-6){
						this.x +=5;
					}else{
						this.x = pixelNum-this.bps+1;
						this.animation.play('idle'+this.facing);
					}
				}
				else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x+=5;
						if(this.animation.currentAnimation.name != 'moveright')
							this.animation.play('moveright');
					}
				}
			}
			else if(this.leftKey.isDown){
				this.facing = 'left';
				if(this.state.onBlockType(this.state.leftBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west');
					if(this.x>pixelNum+6){
						this.x-=5;
					}else{
						this.x = pixelNum;
						this.animation.play('idle'+this.facing);
					}
				}else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x-=5;
						if(this.animation.currentAnimation.name != 'moveleft')
							this.animation.play('moveleft');
					}
				}
			}
			else if(this.downKey.isDown){
				var ladderPixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west') + this.bps/2;
				var belowFeetPosition = this.state.getGridPosition(this.x, this.y+1,'south');				
				if(this.x+this.bps/2>ladderPixelNum-15 && this.x+this.bps/2<ladderPixelNum+15){	
					if(this.state.onBlockType(this.state.firstLadderBlocks, southGridPosition)){
						if(!this.state.onBlockType(this.state.groundBlocks, belowFeetPosition)){
							this.y+=3;
						}else{
							var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'south');
							if(this.y+this.bps<pixelNum-6){
								this.y+=3;
								if(this.animation.currentAnimation.name!='climb'){
									this.animation.play('climb');
								}				
							}
							else{
								this.transform.y=pixelNum-this.bps+1; 
								this.animation.play('idle'+this.facing);
							}
						}
					}
					else if(this.state.onBlockType(this.state.ladderBlocks, belowFeetPosition)){
						if(this.y<this.bps*this.state.GRID_ROWS)
							this.y+=5;
						else
							this.y = this.bps*this.state.GRID_ROWS;
						if(this.animation.currentAnimation.name != 'climb')
							this.animation.play('climb');
					}else{
						if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition)){
							if(this.bombClock.elapsed() > 5){
								this.placeBomb();
							}
						}
					}
				}
			}
			else {
		 		var belowFeetPosition = this.state.getGridPosition(this.x, this.y+1,'south');
				if(this.state.onBlockType(this.state.ladderBlocks, belowFeetPosition) && !this.state.onBlockType(this.state.topLadderBlocks,southGridPosition)){
					if(this.animation.currentAnimation.name != 'idleclimb')
						this.animation.play('idleclimb');
				}		
				else if(this.animation.currentAnimation.name != 'idle' + this.facing)
					this.animation.play('idle' + this.facing);	
			}
		}
		else{
			this.deathCount();
		}
	}
}

Bandit.prototype.gravity = function(southGridPosition){
	if(this.state.onBlockType(this.state.topGroundBlocks,southGridPosition)){
		var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'south');
		if(this.y+this.bps<pixelNum-26){
			this.y+=13;
		}else{
			this.y=pixelNum-this.bps+1;
			if(!this.isAlive){
				this.isDeadAndOnGround = true;
			}
		}
	}else{
		if(this.y+this.bps<this.bps*this.state.GRID_ROWS-26){
			this.y+=13;
		}else{
			this.y=this.bps*this.state.GRID_ROWS-this.bps;
			if(!this.isAlive){
				this.isDeadAndOnGround = true;
			}
		}
	}		
}

Bandit.prototype.placeBomb = function(){
	if(this.bombsCollected > 0){
		this.bombClock.start();
		bomb = this.bombs.pop();
		bomb.x = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'west');
		bomb.y = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'north');	
		var bombGridPosition = this.state.getGridPosition(bomb.x,bomb.y);
		bomb.rowPlaced = bombGridPosition[0];
		bomb.colPlaced = bombGridPosition[1]; 
		bomb.startTimer();
		this.bombsCollected--;
		this.state.updateBombCounter(this);			
	}
}

var HiddenBlock = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['backgroundSpriteSheet'+state.currentLevel], x, y, false);
	this.occupiedBy = []; //array of Ghouls 
	this.gridPosition = state.getGridPosition(x,y);
	this.row = this.gridPosition[0];
	this.col = this.gridPosition[1];
	console.log(this.row + ' ' + this.col) 
	this.state = state;

	this.timer = state.game.time.clock.createTimer('hiddenBlockTimer',5,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.hiddenBlockTimer, this);
	
	if(this.state.permBlocks[this.row][this.col] != 1){
		console.log('starting hidden block timer');
		this.timer.start();
	}
}
Kiwi.extend(HiddenBlock, Kiwi.GameObjects.Sprite);

HiddenBlock.prototype.hiddenBlockTimer = function(){
	var numberOfGhouls = this.occupiedBy.length;
	for(var i =0; i < numberOfGhouls; i++){
		var ghoul = this.occupiedBy.pop();
		if(ghoul.objType() == 'BlackGhoul'){
			if(ghoul.lives < 1){
				ghoul.destroy(false);
			}
		}else if(ghoul.objType() == 'Ghouliath'){
			ghoul.animation.play('explode');
			this.state.bombSound.play();		
			ghoul.explodeTimer.start();
		}else{
			ghoul.destroy(false);
		}
	}
	this.destroy();
	this.state.blockReappearSound.play('start',true);

	this.state.addToBlocks(this.row, this.col, this.state.groundBlocks);
	this.state.updateTopGroundBlocks();
	this.state.updateBlockedBlocks();

	var bandits = this.state.banditGroup.members;

	for(var i = 0; i<bandits.length; i++){
		gridPosition = this.state.getGridPosition(bandits[i].x, bandits[i].y, 'middle');
		if(gridPosition[0] == this.row && gridPosition[1] == this.col){	
			bandits[i].isAlive = false;
		}		
	}
}

HiddenBlock.prototype.destroy = function(immediate){
	this.timer.removeTimerEvent(this.timerEvent);
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

var Heart = function(state, banditX, banditY, bandit, number){
	this.banditX = banditX;
	this.banditY = banditY;
	var y = banditY - 35;
	var x = null;
	switch(number){
		case 1: 
			x = banditX - 15;
			break;
	    case 2:
	    	x = banditX;
	    	break;
	    case 3:
	    	x = banditX + 15;
	    	break; 
	}
	
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;
	this.bandit = bandit;
	this.number = number;
	this.timerStarted = false;
	this.shouldBeGone = false;

	this.timer = this.state.game.time.clock.createTimer('heartTimer',3,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.disappear, this);

	Heart.prototype.update = function(){
		if(!this.shouldBeGone){
			if(this.animation.currentAnimation.name != 'blink'){
				this.animation.play('blink');
			}
			switch(this.bandit){
				case 'red':
					if(this.state.red.x != this.banditX || this.state.red.y != this.banditY){
						if(this.timerStarted == false){
							console.log('timer starting');
							this.timer.start();
						}
						this.timerStarted = true;
					}
					break;
				case 'blue':
					if(this.state.blue.x != this.banditX || this.state.blue.y != this.banditY){
						if(this.timerStarted == false){
							console.log('timer starting');
							this.timer.start();
						}
						this.timerStarted = true;
					}
					break;			
			}		

			this.showSelf();
		}
	}
}
Kiwi.extend(Heart, Kiwi.GameObjects.Sprite);

Heart.prototype.disappear = function(){
	this.x = 2000;
	this.shouldBeGone = true;
	this.timer.stop();
}

Heart.prototype.showSelf = function(){
	var banditX = null;
	switch(this.bandit){
		case 'red':
			banditX = this.state.red.x;
			this.y = this.state.red.y - 35;
			break;

		case 'blue':
			banditX = this.state.blue.x;
			this.y = this.state.blue.y - 35;
			break;
	}
	switch (this.number){
				case 1: 
					this.x = banditX -15;
					break;
				case 2:
					this.x = banditX;
					break;
				case 3:
					this.x = banditX +15;
					break;
	}		
}

var Cracks = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;
	this.animation.add('cracks',[150],.1,false);
	this.animation.play('cracks');
}
Kiwi.extend(Cracks, Kiwi.GameObjects.Sprite);

var Bomb = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	console.log('bomb created at ' + x + ' ' + y);
	this.state = state;

	this.rowPlaced = -1;
	this.colPlaced = -1;

	this.timerStarted = false; 


	this.timer = this.state.game.time.clock.createTimer('bombTimer',3,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explode, this);

	this.timerAnimation = this.state.game.time.clock.createTimer('bombAnimation',2,0,false);
	this.timerAnimationEvent = this.timerAnimation.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explodeAnimation, this);

}
Kiwi.extend(Bomb, Kiwi.GameObjects.Sprite);

Bomb.prototype.explode = function(){
	this.state.blastBlock([this.rowPlaced, this.colPlaced-1]); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced-2]);
	this.state.blastBlock([this.rowPlaced, this.colPlaced]);	
	this.state.blastBlock([this.rowPlaced, this.colPlaced+1]); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced+2]);
	var bandits = this.state.banditGroup.members;
	var ghouls = this.state.ghoulGroup.members;
	this.state.bombSound.play();	
	for(var i = 0; i < bandits.length; i++){
		gridPosition = this.state.getGridPosition(bandits[i].x, bandits[i].y, 'middle');
		if(gridPosition[0] == this.rowPlaced && gridPosition[1] >= this.colPlaced-2 && gridPosition[1] <= this.colPlaced+2){
			bandits[i].isAlive = false;
		}
	}
	for(var i = 0; i < ghouls.length; i++){
		gridPosition = this.state.getGridPosition(ghouls[i].x, ghouls[i].y, 'middle');
		if(gridPosition[0] == this.rowPlaced && gridPosition[1] >= this.colPlaced-2 && gridPosition[1] <= this.colPlaced+2){
			ghouls[i].animation.play('diestatic'+ghouls[i].facing);
			ghouls[i].facing = 'none';
			ghouls[i].singleBlockDeath('fast');
		}
	}	
	this.destroy();
}

Bomb.prototype.explodeAnimation = function(){
	this.animation.play('explode');
	console.log(this.animation.currentAnimation.name);
}

Bomb.prototype.startTimer = function(){
	this.timerStarted = true;
	this.timer.start();
	this.timerAnimation.start();

}

Bomb.prototype.hide = function(){
	this.x = -3*this.state.bps;
	this.y = -3*this.state.bps;
}

var Digit = function(state, x, y, color, index){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['digits'], x, y, false);
	console.log('adding digit');
	this.color = color;
	this.state = state;
	this.index = index; 
	this.originalx = x;
	this.originaly = y;

	switch(color){
		case 'blue':
			this.animation.add('0',[0],0.1,false);
			this.animation.add('1',[1],0.1,false); 
			this.animation.add('2',[2],0.1,false);
			this.animation.add('3',[3],0.1,false); 
			this.animation.add('4',[4],0.1,false);
			this.animation.add('5',[5],0.1,false); 
			this.animation.add('6',[6],0.1,false);
			this.animation.add('7',[7],0.1,false); 
			this.animation.add('8',[8],0.1,false);
			this.animation.add('9',[9],0.1,false); 	
			this.animation.add('bomb',[10],0.1,false);											
			break;
		case 'red':
			this.animation.add('0',[11],0.1,false);
			this.animation.add('1',[12],0.1,false); 
			this.animation.add('2',[13],0.1,false);
			this.animation.add('3',[14],0.1,false); 
			this.animation.add('4',[15],0.1,false);
			this.animation.add('5',[16],0.1,false); 
			this.animation.add('6',[17],0.1,false);
			this.animation.add('7',[18],0.1,false); 
			this.animation.add('8',[19],0.1,false);
			this.animation.add('9',[20],0.1,false); 	
			this.animation.add('bomb',[10],0.1,false);																									
			break;
	}

	Digit.prototype.resetCounter = function(){
		this.animation.play('0');
	}
}
Kiwi.extend(Digit, Kiwi.GameObjects.Sprite);



