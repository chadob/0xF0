const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Load sprites into Asset Manager

ASSET_MANAGER.queueDownload("Sprites/Cars/Car.png");
ASSET_MANAGER.queueDownload("Sprites/Other/Canvas.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	// Add entities to Game Enginge
	gameEngine.addEntity(new Player(gameEngine, (1024/2)-32, (768/2)-16));
	gameEngine.addEntity(new Canvas(gameEngine, 0, 0));


	gameEngine.init(ctx);

	gameEngine.start();
});
