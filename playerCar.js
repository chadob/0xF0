class PlayerCar {
    constructor(start_pos, hiddenImage, game, carStats) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset(carStats.sprite), 0, 0, 60, 50, 3, 0.5);
		this.curLap = 1;
		this.width = .5;
		this.height = .5;
		
		this.canBoost = true;
		this.indestructible = false;
		this.hudCurLap = document.getElementById('curLap');
		this.position = new position(start_pos);
        //this.pixelMap = this.get_image(hiddenImage);
		this.terrianMap = new mapKey(hiddenImage).terrianMap;
		this.checkpoint = false;
		this.bounce = false;
		this.inputEnabled = false;

		//these stats loaded from carData object
		this.carName = carStats;
		this.health = carStats.body;
		this.maxHealth = carStats.body;
		this.accel = carStats.acceleration;
		this.turningSpeed = carStats.handling;
		this.maxBoostVelocity = carStats.max_boost_velocity;
		this.max_vel = carStats["top speed"];
		this.boostCost = carStats.boost;

        this.velocity = 0,
		
        this.decel = 0.1,	//0.01
        
		this.maxBoostVelocity = 1.5	//1

    // // Paul likes these settings
        this.turn_velocity = 0,
        this.turn_accel = Math.PI / 1024,
        this.turn_decel = Math.PI / 1024,
        this.turn_max_vel = Math.PI / (64 -8);
    };
	updateBB() {
        this.BB = new BoundingBox(this.position.x, this.position.y, this.width, this.height)
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
		this.directionOfSprite();
		this.updateBB();

		var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof Checkpoint) {
					if (that.checkpoint == false) {
						console.log("checkpoint")
						that.checkpoint = true;
					}
				}
                if (entity instanceof FinishLine) {
					if (that.checkpoint == true) {
						that.checkpoint = false;
						that.curLap++;
						that.hudCurLap.innerText = that.curLap + ": ";
						that.createLapTime();
						if (that.curLap === 4) {
							console.log("You win!");
							that.game.timer.end();
							document.querySelectorAll('.lapTime').forEach(e => e.remove());
							that.inputEnabled=false;
							sceneManager.finishedRaceAnimation(false);
						}   
					}
                    
                }  else if (entity instanceof Enemy) {
					//slow down velocity
					that.health -= 5;
				} 
            }
        });
		//console.log(this.position.theta + "  " + this.position.direction);
		//console.log(this.position.direction);
		//win condition
		
		 	
		if (this.health <= 0 ) {
			console.log("You lose");
			this.game.timer.end();
			document.querySelectorAll('.lapTime').forEach(e => e.remove());
			this.inputEnabled = false;
			sceneManager.finishedRaceAnimation(true);
		}

		
		if(this.inputEnabled) {
			this.changeVelocityAxisY();
			this.move(this.velocity, this.position.theta);
			this.changeVelocityAxisX();
			this.position.updateMapDirection();


			this.position.theta += this.turn_velocity;
			this.checkForPowerSlide();
		}
		

    };

	checkBoostOrBreak(){
		//	checks if boost button is hit
		if (this.game.boosting) {
			//checks current boost power
			if (this.health > 1) {
				this.health = Math.max(1, this.health-= (4*this.boostCost* this.game.clockTick));
				this.velocity = Math.min(this.maxBoostVelocity, this.velocity + this.game.clockTick * 60* this.accel);
			}
		} if (this.game.braking) {
			this.velocity = Math.max(0, this.velocity -  this.game.clockTick * 5* this.decel);
		} if (this.velocity > this.max_vel && !this.game.boosting) {
			this.velocity -= this.decel * this.game.clockTick;
		} if (this.velocity < this.max_vel) {
			this.velocity = Math.min(this.velocity+this.accel * 60 * this.game.clockTick, this.max_vel);
		}
	}
		
	//code to create lap time in hud
	createLapTime() {
		if (this.curLap > 1) {
			this.game.timer.createLapTime(this.curLap);
		}
		
	}
    move(v, theta) {
        var possibleX = this.position.x + v * Math.sin(theta);
        var possibleY = this.position.y + v * Math.cos(theta);
		if (this.bounce){
			possibleX = this.position.x + 0.3 * Math.sin(theta - Math.PI);
			possibleY = this.position.y + 0.3 * Math.cos(theta - Math.PI);
			if (this.canMove(possibleX, possibleY)) {
				this.position.x += 0.3 * Math.sin(theta - Math.PI);
				this.position.y += 0.3 * Math.cos(theta - Math.PI);
			}
		}
        else if (this.canMove(possibleX, possibleY)){
            this.position.x += v * Math.sin(theta);
            this.position.y += v * Math.cos(theta);
    	} else {
			this.velocity = 0;
			this.bounce = true;
			setTimeout(()=> {
				this.bounce = false;
			}, 250);
			this.move(.3, this.position.theta - Math.PI);
		}
    };


	changeVelocityAxisX(){
		// if up then velocity increase if down velocity decreases	// 1st equation of motion with t=1 
		if(this.game.left){
			this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel * this.game.clockTick * 40, this.turn_max_vel);
			this.velocity = Math.max(this.velocity- this.velocity * this.decel * this.game.clockTick * 8, 0);
		} else if(this.game.right){
			this.turn_velocity = Math.max(this.turn_velocity - this.turn_accel * this.game.clockTick * 40, -this.turn_max_vel);
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
		} else if(this.game.down){
			this.velocity = Math.max(this.velocity-this.accel, -this.max_vel);
		} else if(this.velocity < 0) {
			this.velocity = Math.min(this.velocity+this.decel, 0);
		} else {
			this.velocity = Math.max(this.velocity-this.decel * 1.5 *  this.game.clockTick * 4, 0);
		}
	};

	//lose health on collision
	updateHealthAndRoadCond(terrian){
		if (terrian == "Wall" && this.indestructible === false) {
			this.health -= 5;
			this.indestructible = true;
			setTimeout(()=> {
				this.indestructible = false;
			}, 250);

		//bright pink for boost
		} else if (terrian == "Boost") {
			this.health = Math.min(this.maxHealth, this.health + 40* this.game.clockTick);
		} // lime green for ice 
		else if (terrian ==  "Ice") {
			this.turn_velocity = 0;
		} // yellow for dirt
		else if (terrian == "Dirt") {
			this.velocity = Math.max(0, this.velocity - this.game.clockTick * 5);
		} // orange for lava
		else if (terrian == "Lava") {
			this.health = Math.max(0, this.health-= (20* this.game.clockTick));
		}
	};

	//Pixel color collision detection
    canMove( possibleX, possibleY) {
		let x = -Math.floor(possibleX);
		let y = Math.floor(possibleY);
		let typeOfTerrain = this.terrianMap[x][y];
		let canDrive = typeOfTerrain != 'Wall';
		this.updateHealthAndRoadCond(typeOfTerrain);
		return canDrive;
    }

    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.tick, ctx, 1800, 1500, this.direction)
		ctx.restore();
		//health bar
		var ratio = this.health/this.maxHealth;
		ctx.strokeStyle = "Black";
		
		ctx.save();
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 3;
		ctx.shadowBlur = 3;
		ctx.strokeStyle = "White";
		ctx.lineWidth = 4;
		ctx.strokeRect(700, 15, 300, 25);
		ctx.restore();
		ctx.save();
		ctx.fillStyle = ratio < .2 ? "Red" : ratio < .5 ? "rgba(255, 197, 0, 100)" : "rgba(0, 216, 0, 100)";
		ctx.fillRect(702, 17, Math.max(0, ratio * 297), 22);
		
		ctx.restore();
		
		//Speed
		ctx.save();
		ctx.shadowColor = "black";
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.fillStyle = "White";
		ctx.font = "24px serif"
		ctx.fillText(Math.round(this.velocity * 1000) + " MPH", 900, 70)
		ctx.restore();
	};

	checkForPowerSlide(){
		//Powersliding
		if (this.game.slideL) {
			this.position.theta += .02;
			this.move(.125, this.position.theta + Math.PI/2)
		}
		if (this.game.slideR) {
			this.position.theta -= .02;
			this.move(.125, this.position.theta - Math.PI/2)
		}
	};

	// directionOfSprite() {
	// 	if (this.game.left) {
	// 		this.direction = 0;
	// 	} else if (this.game.right) {
	// 		this.direction = 1800;
	// 	} else {
	// 		this.direction = 950;
	// 	}
	// };
	directionOfSprite() {
		if (this.game.left) {
			this.direction = 0;
		} else if (this.game.right) {
			this.direction = 144;
		} else {
			this.direction = 64;
		}
	};
};