class Player {
    constructor (game, startX, startY) {
        // idle
        this.game = game;
        this.x = startX;
        this.y = startY;
        this.animator = new Animator(ASSET_MANAGER.getAsset("Sprites/Cars/Car.png"), 0, 0, 64, 64, 4, .2, 4, 1);

    };
    
    update() {
        
    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    };
}