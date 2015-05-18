var creditsState = new Kiwi.State('creditsState');

creditsState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.numPlayers = this.game.numPlayers;


	this.addImage('parallaxBackground', 'art/endless/parallax_canvas_1.png');
	this.addImage('parallaxMountain', 'art/endless/parallax_mountains_1.png');
	this.addImage('parallaxMesa', 'art/endless/parallax_mesa_1.png');
	this.addImage('parallaxGrass', 'art/endless/parallax_grass_1.png');
	this.addImage('hills', 'art/endless/parallax_greenhills.png');
	this.addImage('clouds', 'art/endless/parallax_cloud.png');
}

creditsState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.parallaxBackground = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxBackground'],0,0);
	this.parallaxMountain = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMountain'],0,0);
	this.parallaxMesa = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMesa'],0,0);
	this.parallaxGrass = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxGrass'],0,0);
	this.hills = new Kiwi.GameObjects.StaticImage(this, this.textures['hills'],0,750);
	this.cloud = new Kiwi.GameObjects.StaticImage(this, this.textures['clouds'],1000,0);


	this.parallaxMountain2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMountain'],3000,0);
	this.parallaxMesa2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxMesa'],3000,0);
	this.parallaxGrass2 = new Kiwi.GameObjects.StaticImage(this, this.textures['parallaxGrass'],3000,0);
	this.hills2 = new Kiwi.GameObjects.StaticImage(this, this.textures['hills'],3000,750);


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
	this.addChild(this.parallaxMountain);
	this.addChild(this.parallaxMountain2);
	this.addChild(this.parallaxMesa);
	this.addChild(this.parallaxMesa2);
	this.addChild(this.hills);
	this.addChild(this.hills2);
	this.addChild(this.horseGroup);
	this.addChild(this.parallaxGrass);
	this.addChild(this.parallaxGrass2);
	this.addChild(this.cloud);

	this.grassIndex = 0;
	this.mountainIndex = 0;
	this.mesaIndex = 0;
	this.hillsIndex = 0;

	this.mountainSpeed = 0.2;
	this.mesaSpeed = 1;
	this.hillsSpeed =10;
	this.grassSpeed = 10;

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
	this.cloud.x -= 3;

	if(this.cloud.x < -3000){
		this.cloud.x = 1000;
	}

	if(this.grassIndex == 0 && this.parallaxGrass2.x < 0){
		this.parallaxGrass.x = this.parallaxGrass2.x + 3000;
		this.grassIndex = 1;
	}else if(this.grassIndex == 1 && this.parallaxGrass.x < 0){
		this.parallaxGrass2.x = this.parallaxGrass.x + 3000;
		this.grassIndex = 0;
	}

	if(this.mountainIndex == 0 && this.parallaxMountain2.x < 0){
		this.parallaxMountain.x = this.parallaxMountain2.x + 3000;
		this.MountainIndex = 1;
	}else if(this.mountainIndex == 1 && this.parallaxMountain.x < 0){
		this.parallaxMountain2.x = this.parallaxMountain.x + 3000;
		this.mountainIndex = 0;
	}

	if(this.mesaIndex == 0 && this.parallaxMesa2.x < 0){
		this.parallaxMesa.x = this.parallaxMesa2.x + 3000;
		this.mesaIndex = 1;
	}else if(this.mesaIndex == 1 && this.parallaxMesa.x < 0){
		this.parallaxMesa2.x = this.parallaxMesa.x + 3000;
		this.mesaIndex = 0;
	}

	if(this.hillsIndex == 0 && this.hills2.x < 0){
		this.hills.x = this.hills2.x + 3000;
		this.hillsIndex = 1;
	}else if(this.hillsIndex == 1 && this.hills.x < 0){
		this.hills2.x = this.hills.x + 3000;
		this.hillsIndex = 0;
	}
}