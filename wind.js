class Wind {
    constructor(game) {
        this.game = game;

        this.animator = new Animator(
            ASSET_MANAGER.getAsset("Sprites/slipstream_spritesheet.png"), 
            /* xStart */        0,
            /* yStart */        0,
            /* width */         1024,
            /* height */        522,
            /* frameCount */    4,
            /* frameDuration */ 0.15,
        );  
        this.removeFromWorld = true;
        this.x = 0;
        this.y = 0;
    }

    update() {
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.5
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
        ctx.restore();
    }
}