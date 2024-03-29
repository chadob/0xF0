class Explosion {
    constructor(game) {
        this.game = game;

        this.animator = new Animator(
            ASSET_MANAGER.getAsset("./explosions.png"), 
            /* xStart */        0,
            /* yStart */        0,
            /* width */         90,
            /* height */        90,
            /* frameCount */    10,
            /* frameDuration */ 0.15,
        );  

        this.x = 360;
        this.y = 310;
    }

    update() {

    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
}
