class PlayerCar {
    constructor(game) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
															//"./sampleCar.png"), 0, 0, 100, 97, 3, 0.5);
		this.curLap = 0;
		this.width = 30;
		this.height = 30;
		this.health = 100;
		this.x = 0;
		this.y = 0;
    };
	updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height)
    };
    update() {
		if (this.game.left) {
			this.direction = 0;
		} else if (this.game.right) {
			this.direction = 1800;
		} else {
			this.direction = 950;
		}
		// this.x = this.game.entities.mode7.position.x;
		// this.y = this.game.entities.mode7.position.y;
		this.updateBB();
		var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof FinishLine) {
                    that.curLap++;
					console.log(that.curLap);
                }  else if (entity instanceof Enemy) {
					//slow down velocity
					that.health -= 5;
				} 
            }
        });
		//win condition
		if (this.curLap === 1) {
			console.log("You win!");
		}   
		 	
		if (this.health === 0) {
			console.log("You lose");
		}
    };
    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
		ctx.restore();
	};
}
