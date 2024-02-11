class Explosion {
    constructor(game, direction) {
        this.game = game;
        this.direction = direction;

        this.animator = new Animator(
            ASSET_MANAGER.getAsset("/explosions.png"), 
            /* xStart */        0,
            /* yStart */        0,
            /* width */         0.75, // adjust all these if needed
            /* height */        0.75,
            /* frameCount */    10,
            /* frameDuration */ 5
        );
        
        this.width = 1.5; // adjust if needed
        this.height = 1.5;

        this.x = playerCar.position.x - 0.75; // adjust if needed
        this.y = playerCar.position.y - 0.75;

        this.counter = 0;

        this.scale = 1; // fix this
    }

    update() {
        this.counter++;
        if (this.counter >= 50) { // frameDuration * frameCount
            // ADD CODE to remove the explosion
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.scale(this.scale, this.scale); // fix this (maybe)
        this.animator.drawSelf(this.game.clockTick, ctx, this.x, this.y, this.direction);
        ctx.restore();
    }
}
