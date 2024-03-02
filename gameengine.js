// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        let keys = [];

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.vfxEntities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.boosting = false;
        this.braking = false;
        this.slideL = false;
        this.slideR = false;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    stop(callback) {
        setTimeout(callback, 500);
        this.running = false;
    }
    clearInput() {
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.left = false;
        this.right = false;
        this.boosting = false;
        this.braking = false;
        this.slideL = false;
        this.slideR = false;
        this.up = false;
        this.down = false;
        this.keys = {};
    };
    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    this.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.right = true;
                    break;
                } 
                switch (e.code) {
                case "ArrowUp":
                case "KeyW":
                    this.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    this.down = true;
                    break;
                case "KeyH":
                    this.slideL = true;
                    break;    
                case "KeyJ":
                    this.boosting = true;
                    break;
                case "KeyK":
                    this.braking = true;
                    break;
                case "KeyL":
                    this.slideR = true;
                    break;  
            }
        }, false);
        this.ctx.canvas.addEventListener("keyup", e => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    this.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    ASSET_MANAGER.pauseAsset("Sounds/engine.mp3", 'sfx');
                    this.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    this.down = false;
                    break;
                case "KeyH":
                    this.slideL = false;
                    ASSET_MANAGER.pauseAsset("Sounds/powerslide.mp3", 'sfx');
                    break;
                case "KeyL":
                    this.slideR = false;
                    ASSET_MANAGER.pauseAsset("Sounds/powerslide.mp3", 'sfx');
                    break;
                case "KeyJ":
                    this.boosting = false;
                    ASSET_MANAGER.pauseAsset("Sounds/useBoost.mp3", 'sfx');
                    this.vfxEntities.forEach(function(entity) {
                        if (entity instanceof Boost || entity instanceof Wind) {
                            entity.removeFromWorld = true;
                        }
                    })
                    break;
                case "KeyK":
                    this.braking = false;
                    break;
            }
        }, false);
    };

    addEntity(entity, category) {
        if (category == "vfx") {
            this.vfxEntities.push(entity)
        } else {
            this.entities.push(entity);
        }       
    };

    clearEntities() {
        this.entities = [];
        this.vfxEntites = [];
    }
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
        for (let i = this.vfxEntities.length - 1; i >= 0; i--) {
            this.vfxEntities[i].draw(this.ctx, this);
        }
    };

    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
        let vfxEntitiesCount = this.vfxEntities.length;

        for (let i = 0; i < vfxEntitiesCount; i++) {
            let entity = this.vfxEntities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.vfxEntities.length - 1; i >= 0; --i) {
            if (this.vfxEntities[i].removeFromWorld) {
                this.vfxEntities.splice(i, 1);
            }
        }
    };

    loop() {
        if(this.running) {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
        }
    };

};

// KV Le was here :)