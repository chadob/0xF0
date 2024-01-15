const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Load sprites into Asset Manager


ASSET_MANAGER.queueDownload("Sprites/Other/Canvas.png");
ASSET_MANAGER.queueDownload("./lambo.png");
ASSET_MANAGER.queueDownload("Sprites/Tracks/SNES - F-Zero - White Land I II.png");

ASSET_MANAGER.downloadAll(() => {
	const mapCanvas = document.getElementById("mapCanvas");
	const gameCanvas = document.getElementById("gameworld");
	const ctx = gameCanvas.getContext("2d");
	const img = ASSET_MANAGER.getAsset("Sprites/Tracks/SNES - F-Zero - White Land I II.png");


	// Add entities to Game Enginge
	 gameEngine.addEntity(new Car(gameEngine));
	// gameEngine.addEntity(new Canvas(gameEngine, 0, 0));
	{
			let x = -img.width/2,
			y = img.height/2,
			height = 1,
			horizon = img.height/2 //a change in the magitude of 1 x 10^-15 to make canvas gone,
			theta = -320*Math.PI;

		let keys = [];

		let velocity = 0,
			accel = 0.005,	//0.01
			decel = 0.1,	//0.01
			max_vel = 1;	//1

		let turn_velocity = 0,
			turn_accel = Math.PI / 2048,
			turn_decel = Math.PI / 2048,
			turn_max_vel = Math.PI;
			// turn_max_vel = Math.PI / 128;

		let m7 = new mode7({img_tag: img, canvas: mapCanvas});
		m7.update(x, y, height, horizon, theta);

		

		function update(){
		if(gameEngine.up){
			velocity = Math.min(velocity+accel, max_vel);
		} else if(gameEngine.down){
			velocity = Math.max(velocity-accel, -max_vel);
		} else if(velocity < 0) {
			velocity = Math.min(velocity+decel, 0);
		} else {
			velocity = Math.max(velocity-decel, 0);
		}

		x += velocity * Math.sin(theta);
		y += velocity * Math.cos(theta);

		if(gameEngine.left){
			turn_velocity = Math.min(turn_velocity+turn_accel, turn_max_vel);
		} else if(gameEngine.right){
		turn_velocity = Math.max(turn_velocity-turn_accel, -turn_max_vel);
		} else if(turn_velocity < 0){
			turn_velocity = Math.min(turn_velocity+turn_decel, 0);
		} else {
			turn_velocity = Math.max(turn_velocity-turn_decel, 0);
		}

		theta += turn_velocity;

		m7.update(x, y, height, horizon, theta);

		requestAnimationFrame(update);
		}
		update();
	}
	

	gameEngine.init(ctx);

	gameEngine.start();
});
