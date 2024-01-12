class Car {
    constructor(game) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
															//"./sampleCar.png"), 0, 0, 100, 97, 3, 0.5);

    };
    update() {
		if (this.game.left) {
			this.direction = 0;
		} else if (this.game.right) {
			this.direction = 1800;
		} else {
			this.direction = 950;
		}
		
    };
    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
		ctx.restore();
	};
}
