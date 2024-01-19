class Position {
    constructor(start_pos, image, map, game) {
        this.gameEngine = game;
        this.track = image;
        this.x = start_pos.x;
        this.y = start_pos.y;
        this.theta = start_pos.theta;
        this.pixelMap = map;

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

    update() {
        console.log("x: " + this.x + " y: " + this.y + " theta: " + this.theta);

		if(gameEngine.up){
			this.velocity = Math.min(this.velocity+this.accel, this.max_vel);
		} else if(gameEngine.down){
			this.velocity = Math.max(this.velocity-this.accel, -this.max_vel);
		} else if(this.velocity < 0) {
			this.velocity = Math.min(this.velocity+this.decel, 0);
		} else {
			this.velocity = Math.max(this.velocity-this.decel, 0);
		}


        this.move(this.velocity);

    
		if(gameEngine.left){
			this.turn_velocity = Math.min(this.turn_velocity+this.turn_accel, this.turn_max_vel);
		} else if(gameEngine.right){
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
}