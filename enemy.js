class Enemy {
    constructor(game, mapName, carStats) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
															//"./sampleCar.png"), 0, 0, 100, 97, 3, 0.5);
		this.curLap = 0;
		this.width = 30;
		this.height = 30;
        //car initial position
        this.position = new position({x: -140.98064874052415, y: 14.980766027134674, theta: 3 * (Math.PI)/2});
        //path for car to take
        this.positionArray = mapPositionArrays[mapName];
        this.curPositionIdx = 0;
        //car stats
        this.carName = carStats;
		this.health = carStats.body;
		this.maxHealth = carStats.body;
		this.accel = carStats.acceleration;
		this.handling = carStats.handling;
		this.maxBoostVelocity = carStats.max_boost_velocity;
		this.max_vel = carStats["top speed"];

        this.lastUpdate = 0;
        this.velocity = 0;
    };
	updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height)
    };
    update() {
        const current = Date.now();
        console.log(this.lastUpdate);
        if (current >= 500 + this.lastUpdate) {     
            this.lastUpdate = current; 
            this.move();
            this.updateBB();
        }
    };

    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
		ctx.restore();
	};

    calculateAngleNextPoint(target) {
        
        let unitVector = {
            x: (target.x - this.position.x)/ this.distance(this.position, target), 
            y: (target.y - this.position.y)/ this.distance(this.position, target)};
        let velocityX = Math.cos(this.position.theta);
        let velocityY = Math.sin(this.position.theta);
        console.log(this.position, target);
        let angle = Math.acos((velocityX * unitVector.x + velocityY * unitVector.y) 
        / (Math.sqrt(velocityX * velocityX + velocityY * velocityY) * Math.sqrt(unitVector.x * unitVector.x + unitVector.y * unitVector.y)))
        return angle;  
    }

    changeVelocityAxisX(){
		// if up then velocity increase if down velocity decreases	// 1st equation of motion with t=1 
		if(this.game.left){
			//this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel, this.turn_max_vel);
			this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel * this.game.clockTick * this.handling, this.turn_max_vel);
			this.velocity = Math.max(this.velocity- this.velocity * this.decel * this.game.clockTick * 8, 0);
		} else if(this.game.right){
			//this.turn_velocity = Math.max(this.turn_velocity - this.turn_accel, -this.turn_max_vel);
			this.turn_velocity = Math.max(this.turn_velocity - this.turn_accel * this.game.clockTick * this.handling, -this.turn_max_vel);
			this.velocity = Math.max(this.velocity-this.velocity *this.decel * this.game.clockTick * 8, 0);
		} else if(this.turn_velocity < 0){
			this.turn_velocity = Math.min(this.turn_velocity + this.turn_decel, 0);
		} else {
			this.turn_velocity = Math.max(this.turn_velocity - this.turn_decel, 0);
		}
	};

	changeVelocityAxisY(){
		//if up then velocity increase if down velocity decreases	// 1st equation of motion with t=1 
		if(this.game.up){		
			this.checkBoostOrBreak();
			if (ASSET_MANAGER.getAudioAsset("Sounds/engine.mp3", 'sfx').paused) {
				ASSET_MANAGER.startAtAutoRepeatTime("Sounds/engine.mp3", this.velocity/this.max_vel * 5, 10, 'sfx');
			}
		} else if(this.game.down){
			this.velocity = Math.max(this.velocity-this.accel, -this.max_vel);
		} else if(this.velocity < 0) {
			this.velocity = Math.min(this.velocity+this.decel, 0);
		} else {
			//this.velocity = Math.max(this.velocity-this.decel, 0);
			this.velocity = Math.max(this.velocity-this.decel * 1.5 *  this.game.clockTick * 4, 0);
		}
	};

    distance(A, B) {
        return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y)*(B.y - A.y));
    }
    collide(A, B) {
        return (distance(A, B) < A.radius + B.radius);
    }
    canSee(A, B) { // if A can see B
        return (distance(A, B) < A.visualRadius + B.radius);
    }
    getFacing(velocity) {
        if (velocity.x === 0 && velocity.y === 0) return 4;
        let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;  
        if (-0.625 < angle && angle < -0.375) return 0;
        if (-0.375 < angle && angle < -0.125) return 1;
        if (-0.125 < angle && angle < 0.125) return 2;
        if (0.125 < angle && angle < 0.375) return 3;
        if (0.375 < angle && angle < 0.625) return 4;
        if (0.625 < angle && angle < 0.875) return 5;
        if (-0.875 > angle || angle > 0.875) return 6;
        if (-0.875 < angle && angle < -0.625) return 7;
    }
    
    move(velocity, theta) {
        //grab distance between cur and next point in array to create velocity
        console.log(this.calculateAngleNextPoint(this.positionArray[this.curPositionIdx+1]));
    }
}
