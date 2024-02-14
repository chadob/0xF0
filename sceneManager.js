class SceneManager {
    constructor() {
        this.loadAssets();
        this.bgMusic = false;
        this.loop = null;
    }

    loadMainMenu() {
        this.menu = new MainMenu();
        this.muteButton = document.getElementById('mute');
        this.muteButton.addEventListener("click", () => {
            console.log(this.muteButton.checked);
            ASSET_MANAGER.muteAudio(this.muteButton.checked);
        });
        this.volume = document.getElementById('volume');
        this.volume.addEventListener("change", () => {
            ASSET_MANAGER.adjustVolume(this.volume.value);
        });
    }

    playerDeath() {
        this.gameEngine.stop(() => {
            this.gameEngine.clearEntities();
            this.gameEngine.clearInput();
            this.gameEngine = null;
            var map = document.getElementById("mapCanvas");
            var hud = document.getElementById("hud");
            hud.style.display="none";
            var gameCanvas = document.getElementById("gameworld");
            map.remove();
            gameCanvas.remove();
            this.menu.showMenu();
        });

    }
    loadAssets() {
        ASSET_MANAGER.queueDownload("Sounds/8bit-bop2.wav");
        ASSET_MANAGER.queueDownload("./lambo.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/edited track.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/whiteland_hidden.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/sky.webp");
        ASSET_MANAGER.queueDownload("Sprites/Menu/fzero_title.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/bg.png");
        ASSET_MANAGER.downloadAll(() => {});
    }
    loadRace() {
        console.log("Loading race...");
        this.gameEngine = new GameEngine();
        console.log("AFTER ASSET DL");
        let mc = document.getElementById("mapCanvas");
        if(mc == null) {
            mc = document.createElement("canvas");
            mc.id = "mapCanvas";
            mc.width = 1024;
            mc.height = 522;
            mc.style.border = "1px solid black";
            mc.tabIndex = "0";
            document.body.appendChild(mc);
            console.log("CREATED MAPCANVAS");
        }
        let gc = document.getElementById("gameworld");
        if(gc == null) {
            gc = document.createElement("canvas");
            gc.id = "gameworld";
            gc.width = 1024;
            gc.height = 522;
            gc.style.border = "1px solid black";
            gc.tabIndex = "0";
            document.body.appendChild(gc);
            console.log("CREATED GAMEWORLD");
        }
        let mapCanvas = document.getElementById("mapCanvas");
        let gameCanvas = document.getElementById("gameworld");
        let ctx = gameCanvas.getContext("2d");
        let img = ASSET_MANAGER.getAsset("Sprites/Tracks/edited track.png");
        let hiddenImg = ASSET_MANAGER.getAsset("Sprites/Tracks/whiteland_hidden.png");
        //const imgBG = ASSET_MANAGER.getAsset("Sprites/Tracks/bg.png");
        const imgBG = ASSET_MANAGER.getAsset("Sprites/Tracks/sky.webp");
    
        // Add entities to Game Enginge
        let starting_pos = {x: -140.98064874052415, y: 14.980766027134674, theta: (3*Math.PI)/2};//-1006.8800071953033};
	    let mainPlayer = new PlayerCar(starting_pos, hiddenImg, this.gameEngine);
        this.player = mainPlayer;
        this.gameEngine.addEntity(mainPlayer);
        this.gameEngine.addEntity(new mode7(mainPlayer, img, mapCanvas, this.gameEngine, imgBG));
        // gameEngine.addEntity(new Enemy(gameEngine));
        this.gameEngine.addEntity(new FinishLine(this.gameEngine));
        this.gameEngine.addEntity(new Checkpoint(this.gameEngine));
        var hud = document.getElementById("hud");
            hud.style.display="flex";
    
        /**
         *	Adding the mode7 to the Game Engine's entity list will make it execute its update/draw
            *  loop in time with the rest of the game. This could have some benifits later, including 
            *  making this section of code a lot easier to read, but can be undone if needed. This should
            *  not delay or affect the performance of the rest of entities from being drawn since the
            *  Worker created by the mode7 class will be responsible for doing the actual calculations
            *  and drawing of the ground/map.
            */
        this.gameEngine.init(ctx);
        this.gameEngine.start();
        console.log("Race Loaded");
    }
    deLoadRace(callback) {
        setTimeout(callback, 100);

    }
    finishedRaceAnimation(dead) {
        //Finish Animation
        let container = document.getElementById("transitionContainer");
        if(!document.getElementById('finish')) {
            let raceEndText = document.createElement('h1');
            raceEndText.id = "finish";
            if(dead) {
                raceEndText.innerHTML = "YOU LOST";
            } else {
                raceEndText.innerHTML = "FINISHED";
            }
            container.appendChild(raceEndText);
            container.hidden = false;
            setTimeout(() => {
                
                sceneManager.playerDeath();
                raceEndText.remove();
                container.hidden = true;
            }, 4000);
        }
    }
    enableInput() {
        this.player.inputEnabled = true;
        this.gameEngine.timer.hasStarted = true;
    }
}