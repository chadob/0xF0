class PlayerCar {
    constructor(start_pos, image, game) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
		this.curLap = 0;
		this.width = 30;
		this.height = 30;
		this.health = 100;

        this.track = image;
        this.x = start_pos.x;
        this.y = start_pos.y;
        this.theta = start_pos.theta;
        this.pixelMap = this.get_image(image);

        this.velocity = 0,
        this.accel = 0.005,	//0.01
        this.decel = 0.1,	//0.01
        this.max_vel = 1;	//1

    // // Paul likes these settings
        this.turn_velocity = 0,
        this.turn_accel = Math.PI / 1024,
        this.turn_decel = Math.PI / 1024,
        this.turn_max_vel = Math.PI / (64 -8);
    };
	updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height)
    };

	get_image(img_tag){
		let fake_canvas = document.createElement('canvas'),
			fake_context = fake_canvas.getContext('2d');
		fake_canvas.width = img_tag.width;
		fake_canvas.height = img_tag.height;
		fake_context.drawImage(img_tag, 0, 0);
		return fake_context.getImageData(0, 0, img_tag.width, img_tag.height);
	  }

    update() {
		if (this.game.left) {
			this.direction = 0;
		} else if (this.game.right) {
			this.direction = 1800;
		} else {
			this.direction = 950;
		}

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
		if(this.game.up){
			this.velocity = Math.min(this.velocity+this.accel, this.max_vel);
		} else if(this.game.down){
			this.velocity = Math.max(this.velocity-this.accel, -this.max_vel);
		} else if(this.velocity < 0) {
			this.velocity = Math.min(this.velocity+this.decel, 0);
		} else {
			this.velocity = Math.max(this.velocity-this.decel, 0);
		}

        this.move(this.velocity);
    
		if(this.game.left){
			this.turn_velocity = Math.min(this.turn_velocity+this.turn_accel, this.turn_max_vel);
		} else if(this.game.right){
		this.turn_velocity = Math.max(this.turn_velocity-this.turn_accel, -this.turn_max_vel);
		} else if(this.turn_velocity < 0){
			this.turn_velocity = Math.min(this.turn_velocity+this.turn_decel, 0);
		} else {
			this.turn_velocity = Math.max(this.turn_velocity-this.turn_decel, 0);
		}

		this.theta += this.turn_velocity;
    };
	
    move(v) {
        var possibleX = this.x + v * Math.sin(this.theta);
        var possibleY = this.y + v * Math.cos(this.theta);
        if (this.canMove(possibleX, possibleY)){
            this.x += v * Math.sin(this.theta);
            this.y += v * Math.cos(this.theta);
        } else if (this.canMove( this.x, possibleY)){
            this.y += v * Math.cos(this.theta);
        } else if(this.canMove( this.x, possibleY)){
            this.x += v * Math.sin(this.theta);
        }
    };

    canMove( possibleX, possibleY) {
        const pos = (1024 * (Math.floor(possibleY)) + (0 - Math.floor(possibleX)))*4;
        const rgba1 = this.pixelMap.data[pos];
        const rgba2 = this.pixelMap.data[pos +1];
        const rgba3 = this.pixelMap.data[pos+2];
        return rgba1+rgba2+rgba3 > 110;
    }

    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
		ctx.restore();
	};
}
