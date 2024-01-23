class Enemy {
    constructor(game) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
															//"./sampleCar.png"), 0, 0, 100, 97, 3, 0.5);
		this.curLap = 0;
		this.width = 30;
		this.height = 30;
        this.x = 144;
        this .y = 7;

    };
	updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height)
    };
    update() {
		this.updateBB();
    };
    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
		ctx.restore();
	};
}
