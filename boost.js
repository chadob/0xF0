class Boost {
    constructor(game) {
        this.game = game;

        this.animator = new Animator(
            ASSET_MANAGER.getAsset("Sprites/boost_spritesheet.png"), 
            /* xStart */        0,
            /* yStart */        0,
            /* width */         80,
            /* height */        64,
            /* frameCount */    4,
            /* frameDuration */ 0.15,
        );  
        this.removeFromWorld = true;
        this.x = 430;
        this.y = 410;
    }

    update() {
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2.5);
    }
}