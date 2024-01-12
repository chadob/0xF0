class Canvas {
    constructor (game, startX, startY) {
        // idle
        this.game = game;
        this.x = startX;
        this.y = startY;
        this.animator = new Animator(ASSET_MANAGER.getAsset("Sprites/Other/Canvas.png"), 0, 0, 1024, 768, 1, 1, 1, 1);

    };
    
    update() {
        
    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    };
}