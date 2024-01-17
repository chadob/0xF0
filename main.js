const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Load sprites into Asset Manager


ASSET_MANAGER.queueDownload("./lambo.png");
ASSET_MANAGER.queueDownload("Sprites/Tracks/SNES - F-Zero - White Land I II.png");

ASSET_MANAGER.downloadAll(() => {
	const mapCanvas = document.getElementById("mapCanvas");
	const gameCanvas = document.getElementById("gameworld");
	const ctx = gameCanvas.getContext("2d");
	const img = ASSET_MANAGER.getAsset("Sprites/Tracks/SNES - F-Zero - White Land I II.png");


	// Add entities to Game Enginge
	gameEngine.addEntity(new Car(gameEngine));

	/**
	 *	Adding the mode7 to the Game Engine's entity list will make it execute its update/draw
	 *  loop in time with the rest of the game. This could have some benifits later, including 
	 *  making this section of code a lot easier to read, but can be undone if needed. This should
	 *  not delay or affect the performance of the rest of entities from being drawn since the
	 *  Worker created by the mode7 class will be responsible for doing the actual calculations
	 *  and drawing of the ground/map.
	 */
	let starting_pos = {x: -140.98064874052415, y: 14.980766027134674, theta: -1006.8800071953033};
	gameEngine.addEntity(new mode7({img_tag: img, canvas: mapCanvas, game_engine: gameEngine, start_pos: starting_pos}));

	

	gameEngine.init(ctx);

	gameEngine.start();
});
