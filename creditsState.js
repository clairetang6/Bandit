var creditsState = new Kiwi.State('creditsState');

creditsState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.numPlayers = this.game.numPlayers;

	this.addImage('parallaxBackground', 'assets/endless/parallax_canvas_1.png');
	this.addImage('parallaxMountain', 'assets/endless/parallax_mountains.png');
	this.addImage('parallaxMesa', 'assets/endless/parallax_mesa.png');
	this.addImage('parallaxGrass', 'assets/endless/parallax_grass_1.png');
	this.addImage('hills', 'assets/endless/parallax_greenhills.png');
	
	
	this.addImage('creditCloud1', 'assets/endless/cloud_3.png');
	this.addImage('creditCloud2', 'assets/endless/cloud_nimbus.png');
	this.addImage('creditCloud3', 'assets/endless/cloud_nimbus1.png');
	this.addImage('banditForLifeCloud', 'assets/endless/bandit_4_life_cloud.png');
	this.addImage('creditClaire', 'assets/endless/bandit_credit_claire.png');
	this.addImage('creditRyder', 'assets/endless/bandit_credit_rider.png');
	this.addImage('creditRivers', 'assets/endless/bandit_credit_rivers.png');
	this.addImage('creditLogo', 'assets/endless/RYDAIRE_LOGO_ENDLESS.png');
	this.addImage('creditCombo', 'assets/endless/bandit_rydaire_combo.png');
	
}

creditsState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.parallaxBackground = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxBackground'],0,0);
	
	this.parallaxMountain = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMountain'],0,180);
	this.parallaxMesa = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMesa'],0,400);
	this.parallaxGrass = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxGrass'],0,0);
	this.hills = new Kiwi.GameObjects.StaticImage(this, this.textures['hills'],0,750);

	this.parallaxMountain2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMountain'],3000,180);
	this.parallaxMesa2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMesa'],3000,400);
	this.parallaxGrass2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxGrass'],3000,0);
	this.hills2 = new Kiwi.GameObjects.StaticImage(this, this.textures['hills'],3000,750);

	this.cloudGroup = new Kiwi.Group(this);
	this.cloudGroup2 = new Kiwi.Group(this);

	var gameWidth = this.game.stage.container.clientHeight * 1.333;


	this.banditLife = new Kiwi.GameObjects.StaticImage(this, this.textures['banditForLifeCloud'], 1200, 110);
	this.cloudClaire = new Kiwi.GameObjects.StaticImage(this, this.textures['creditClaire'],1200, 180);
	this.cloudRyder = new Kiwi.GameObjects.StaticImage(this, this.textures['creditRyder'], 1200, 180);	
	this.cloudRivers = new Kiwi.GameObjects.StaticImage(this, this.textures['creditRivers'], 1200, 180);
	this.creditLogo = new Kiwi.GameObjects.StaticImage(this, this.textures['creditLogo'], 1200, 100);
	this.creditCombo = new Kiwi.GameObjects.StaticImage(this, this.textures['creditCombo'], 1200, 10);
	
	this.nameClouds = [this.banditLife, this.cloudRyder, this.cloudClaire,  this.cloudRivers, this.creditLogo];
	this.numberOfNameClouds = 4;
	this.cloudIndex = 0;
	this.cloudIsPassed = false;
	this.currentCloud = this.nameClouds[this.cloudIndex];
	
	this.cloudGroup.addChild(this.cloudClaire);
	this.cloudGroup.addChild(this.cloudRyder);
	this.cloudGroup.addChild(this.cloudRivers);
	this.cloudGroup.addChild(this.creditLogo);
	this.cloudGroup.addChild(this.banditLife);
	this.cloudGroup.addChild(this.creditCombo);
	
	for (var i = 1; i <= 8; i++){
		this.cloudGroup2.addChild(new Cloud(this, i));
	}
	this.cloudGroup2.visible = false;
	
	this.horseGroup = new Kiwi.Group(this);
	this.redHorse = new Horse(this, 510, 595);
	this.redHorse.animation.play('redrun');
	this.blueHorse = new Horse(this, 300, 595);
	this.blueHorse.animation.play('bluerun');
	//this.horseGroup.addChild(this.redHorse);
	//if(this.numPlayers == 2){
	//	this.horseGroup.addChild(this.blueHorse);
	//}

	this.banditStagecoach = new BanditStageCoach(this, 275, 500);

	this.horseGroup.addChild(this.banditStagecoach);

	this.horseGallopSound = new Kiwi.Sound.Audio(this.game, 'horseGallopSound', 1, false);
	this.horseGallopSound.addMarker('start', 0, 8, false);
	this.horseGallopSound2 = new Kiwi.Sound.Audio(this.game, 'horseGallopSound', 1, false);
	this.horseGallopSound2.addMarker('start', 0, 8, false);

	this.addChild(this.parallaxBackground);
	this.addChild(this.cloudGroup2);
	this.addChild(this.parallaxMountain);
	this.addChild(this.parallaxMountain2);
	this.addChild(this.parallaxMesa);
	this.addChild(this.parallaxMesa2);
	this.addChild(this.hills);
	this.addChild(this.hills2);
	
	this.addChild(this.horseGroup);
	
	this.addChild(this.parallaxGrass);
	this.addChild(this.parallaxGrass2);
	this.addChild(this.cloudGroup);

	this.grassIndex = 0;
	this.mountainIndex = 0;
	this.mesaIndex = 0;
	this.hillsIndex = 0;

	this.mountainSpeed = 0.2;
	this.mesaSpeed = 1;
	this.hillsSpeed =10;
	this.grassSpeed = 10;
	
	this.random = new Kiwi.Utils.RandomDataGenerator();
	this.showingNameClouds = true;
}

creditsState.update = function(){
	Kiwi.State.prototype.update.call(this);

	this.parallaxMountain.x -= this.mountainSpeed;
	this.parallaxMountain2.x -= this.mountainSpeed;
	this.parallaxMesa.x -= this.mesaSpeed;
	this.parallaxMesa2.x -= this.mesaSpeed;
	this.parallaxGrass.x -= this.grassSpeed;
	this.parallaxGrass2.x -= this.grassSpeed;
	this.hills.x -= this.hillsSpeed;
	this.hills2.x -= this.hillsSpeed;
	
	if(this.showingNameClouds){
		this.updateCloud();
	}

	this.hillsIndex = this.updateParallax(this.hills, this.hills2, this.hillsIndex);
	this.mesaIndex = this.updateParallax(this.parallaxMesa, this.parallaxMesa2, this.mesaIndex);
	this.mountainIndex = this.updateParallax(this.parallaxMountain, this.parallaxMountain2, this.mountainIndex);
	this.grassIndex = this.updateParallax(this.parallaxGrass, this.parallaxGrass2, this.grassIndex);
}

creditsState.updateParallax = function(p1, p2, index){
	switch (index) {
		case 0:
			if(p2.x < 0){
				p1.x = p2.x + 2999;
				return 1;
			}else{
				return 0;
			}
			break;
		case 1:
			if(p1.x < 0){
				p2.x = p1.x + 2999;
				return 0;
			}else{
				return 1;
			}
			break;
	}

}

creditsState.updateCloud = function(){

	if(this.cloudIsPassed === false){
		this.currentCloud.x -= 3; 
		
		if(this.currentCloud.x < -1.2 * this.currentCloud.width){
			this.cloudIsPassed = true;
			if(this.cloudIndex < this.nameClouds.length){	
				this.currentCloud.y = -1000;
			}
		}
	}else{
		this.cloudIndex += 1; 
		if(this.cloudIndex >= this.nameClouds.length){
			this.showingNameClouds = false;
			this.setUpClouds();
		}else{
			this.currentCloud = this.nameClouds[this.cloudIndex];
			this.cloudIsPassed = false;
		}
	}
}

creditsState.setUpClouds = function(){
	this.cloudGroup2.visible = true;
	for(var i = 0; i < this.cloudGroup2.members.length; i++){
		this.cloudGroup2.members[i].randomXToRight();
		this.cloudGroup2.members[i].randomSpeedAndY();
	}
}