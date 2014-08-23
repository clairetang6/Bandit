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
			break;
	}

	this.facing = 'left';
	console.log(this);

	this.canShoot = true; 

}
Kiwi.extend(Bandit, Kiwi.GameObjects.Sprite);

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

	HiddenBlock.prototype.update = function(){
		if(this.occupied){
			console.log('is occupied');
			console.log(this.occupiedBy);
			this.occupied =false; 
		}
	}
}
Kiwi.extend(HiddenBlock, Kiwi.GameObjects.Sprite);

HiddenBlock.prototype.hiddenBlockTimer = function(){
	var numberOfGhouls = this.occupiedBy.length;
	for(var i =0; i < numberOfGhouls; i++){
		var ghoul = this.occupiedBy.pop();
		ghoul.destroy(false);
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
	this.state.bombSound.play();
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



