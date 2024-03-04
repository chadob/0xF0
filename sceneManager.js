class SceneManager {
    constructor() {
        this.loadAssets();
        this.bgMusic = false;
        this.loop = null;
    }

    loadMainMenu() {
        this.menu = new MainMenu();
        this.muteButtonbg = document.getElementById('mutebg');
        this.muteButtonbg.addEventListener("click", () => {
            console.log(this.muteButtonbg.checked);
            ASSET_MANAGER.muteAudio(this.muteButtonbg.checked, 'bgm');
        });
        this.volumebg = document.getElementById('volumebg');
        this.volumebg.addEventListener("change", () => {
            ASSET_MANAGER.adjustVolume(this.volumebg.value, 'bgm');
        });
        this.muteButtonsfx = document.getElementById('mutesfx');
        this.muteButtonsfx.addEventListener("click", () => {
            console.log(this.muteButtonsfx.checked);
            ASSET_MANAGER.muteAudio(this.muteButtonsfx.checked, 'sfx');
        });
        this.volumesfx = document.getElementById('volumesfx');
        this.volumesfx.addEventListener("change", () => {
            ASSET_MANAGER.adjustVolume(this.volumesfx.value, 'sfx');
        });
        window.addEventListener("gamepadconnected", (e) => {
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );
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
        const carSprites = [
            "Sprites/Cars/wonderwasp.png",
            "Sprites/Cars/wildgoose.png",
            "Sprites/Cars/wildboar.png",
            "Sprites/Cars/whitecat.png",
            "Sprites/Cars/twinnoritta.png",
            "Sprites/Cars/superpiranha.png",
            "Sprites/Cars/spaceangler.png",
            "Sprites/Cars/sonicphantom.png",
            "Sprites/Cars/redgazelle.png",
            "Sprites/Cars/queenmeteor.png",
            "Sprites/Cars/panzeremerald.png",
            "Sprites/Cars/nightthunder.png",
            "Sprites/Cars/moonshadow.png",
            "Sprites/Cars/mightytyphoon.png",
            "Sprites/Cars/mightyhurricane.png",
            "Sprites/Cars/madwolf.png",
            "Sprites/Cars/littlewyvern.png",
            "Sprites/Cars/lambo.png",
            "Sprites/Cars/kingmeteor.png",
            "Sprites/Cars/irontiger.png",
            "Sprites/Cars/hyperspeeder.png",
            "Sprites/Cars/greenpanther.png",
            "Sprites/Cars/greatstar.png",
            "Sprites/Cars/goldenfox.png",
            "Sprites/Cars/firestingray.png",
            "Sprites/Cars/eleganceliberty.png",
            "Sprites/Cars/dragonbird.png",
            "Sprites/Cars/deepclaw.png",
            "Sprites/Cars/deathanchor.png",
            "Sprites/Cars/crazybear.png",
            "Sprites/Cars/bluefalcon.png",
            "Sprites/Cars/astrorobin.png",
            "Sprites/Cars/bigfang.png",
            "Sprites/Cars/blackshadow.png",
            "Sprites/Cars/bloodhawk.png"
        ]
        carSprites.forEach((spritesheet) => {
            ASSET_MANAGER.queueDownload(spritesheet);
        });
        ASSET_MANAGER.queueBGMDownload("Sounds/8bit-bop2.wav");
        ASSET_MANAGER.queueSFXDownload("Sounds/useBoost.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/hurt.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/laugh.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/countdown.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/explosion.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/dirt.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/onBoost.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/engine.mp3");
        ASSET_MANAGER.queueSFXDownload("Sounds/powerslide.mp3");
        ASSET_MANAGER.queueDownload("./lambo.png");
        ASSET_MANAGER.queueDownload("./explosions.png");
        ASSET_MANAGER.queueDownload("Sprites/boost_spritesheet.png");
        ASSET_MANAGER.queueDownload("Sprites/slipstream_spritesheet.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/edited track.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/straightaway.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/whiteland_hidden.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/sky.webp");
        ASSET_MANAGER.queueDownload("Sprites/Menu/fzero_title.png");
        ASSET_MANAGER.queueDownload("Sprites/Tracks/bg.png");
        ASSET_MANAGER.queueDownload("Sprites/nightsky.png");
        ASSET_MANAGER.downloadAll(() => {});
        ASSET_MANAGER.downloadBGM();
        ASSET_MANAGER.downloadSFX();
        ASSET_MANAGER.autoRepeat("Sounds/8bit-bop2.wav", 'bgm');
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
        let img = ASSET_MANAGER.getAsset("Sprites/Tracks/straightaway.png");
        let hiddenImg = ASSET_MANAGER.getAsset("Sprites/Tracks/straightaway.png");
        // const imgBG = ASSET_MANAGER.getAsset("Sprites/Tracks/sky.webp");
        const imgBG = ASSET_MANAGER.getAsset("Sprites/nightsky.png");
        let mapName = "whiteland";
        let carName = this.menu.getSelectedCarName();
        let carStats = carData[carName];
        let targetLaps = this.menu.getLaps();
        let indestructable = this.menu.getIndestructable();
        // Add entities to Game Enginge
        //These are going to depend on each
        let starting_pos = {x: -15, y: 255, theta: (3*Math.PI)/2};//-1006.8800071953033};
	    let mainPlayer = new PlayerCar(starting_pos, hiddenImg, this.gameEngine, carStats, targetLaps, indestructable);
        this.player = mainPlayer;
        this.gameEngine.addEntity(mainPlayer, "unit");

        // this.gameEngine.addEntity(new Enemy(this.gameEngine, mapName, carStats));
        this.gameEngine.addEntity(new mode7(mainPlayer, img, mapCanvas, this.gameEngine, imgBG), "unit");

        // gameEngine.addEntity(new Enemy(gameEngine));
        this.gameEngine.addEntity(new FinishLine(this.gameEngine), "unit");
        this.gameEngine.addEntity(new Checkpoint(this.gameEngine), "unit");
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
        console.log("WITH LAPS: " + targetLaps + " IND: " + indestructable + " RACER: " + carName);
    }
    
    deLoadRace(callback) {
        setTimeout(callback, 100);

    }

    explodingDeadCarAnimation(dead) {
        if (dead) {
            this.player.hide();

            let explosion = new Explosion(this.gameEngine);
            this.gameEngine.addEntity(explosion, "vfx");
        }
    }

    finishedRaceAnimation(dead) {
        //Finish Animation
        let container = document.getElementById("transitionContainer");
        if(!document.getElementById('finish')) {
            let raceEndText = document.createElement('h1');
            raceEndText.id = "finish";
            if (ASSET_MANAGER.sfxCache["Sounds/engine.mp3"]) {
                ASSET_MANAGER.pauseAsset("Sounds/engine.mp3", 'sfx');
            }
            if (ASSET_MANAGER.sfxCache["Sounds/useBoost.mp3"]) {
                ASSET_MANAGER.pauseAsset("Sounds/useBoost.mp3", 'sfx');
            }
            if(dead) {
                raceEndText.innerHTML = "YOU LOST";
                ASSET_MANAGER.playAsset("Sounds/explosion.mp3", 'sfx');
                setTimeout(()=> {
                    ASSET_MANAGER.playAsset("Sounds/laugh.mp3", 'sfx');
                }, 3000);
            } else {
                raceEndText.innerHTML = "FINISHED";
            }
            container.appendChild(raceEndText);
            container.hidden = false;
            setTimeout(() => {
                sceneManager.playerDeath();
                raceEndText.remove();
                container.hidden = true;
                ASSET_MANAGER.pauseBackgroundMusic();
            }, 4000);
        }
    }
    enableInput() {
        this.player.inputEnabled = true;
        this.gameEngine.timer.hasStarted = true;
        //this.player.startRecordingPositions();
    }
}