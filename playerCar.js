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
		this.trackInfo = new mapKey(hiddenImage);
		this.checkpoint = false;

		this.bounce = false;
		this.cornerBackup = false;
		this.directionOfBounce = 0;
		this.cornerBounceTheta = 0;
		this.stepToCamera = 0;
		this.cameraStepsLeft = 0;


		this.easyMode = true;

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

			if (this.bounce && this.cornerBackup){
				this.move(0.3, this.cornerBounceTheta);
			} else if (this.bounce) {
				if (this.cameraStepsLeft >= 0){
					this.position.theta += this.stepToCamera;
					this.cameraStepsLeft--;
				}
				this.move(Math.max(0.1, this.velocity), this.directionOfBounce);
			} else {
				this.move(this.velocity, this.position.theta);
			}

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


		if (this.canMove(possibleX, possibleY)){	
			this.position.x += v * Math.sin(theta);
            this.position.y += v * Math.cos(theta);
			this.errorCount = 0;

		}
		else if (this.cornerBackup) {
			while(!this.canMove(possibleX, possibleY)) {
				this.cornerBounceTheta += Math.PI/4;
				possibleX = this.position.x + v * Math.sin(this.cornerBounceTheta);
				possibleY = this.position.y + v * Math.cos(this.cornerBounceTheta);
			}
			this.position.x += v * Math.sin(this.cornerBounceTheta);
            this.position.y += v * Math.cos(this.cornerBounceTheta);
		} else {
		
			let currentWalls = this.trackInfo.whereIsWall[this.position.getIntX()][this.position.getIntY()];
			let rejectMovesWalls = this.trackInfo.whereIsWall[this.position.convertIntX(possibleX)][this.position.convertIntY(possibleY)];
			let rejectedTerrian = this.trackInfo.terrianMap[this.position.convertIntX(possibleX)][this.position.convertIntY(possibleY)];
			let hitFlatWall = (rejectedTerrian == "Wall" && currentWalls.length == "1" );
			let time = (hitFlatWall) ? 450: 250;

			let directionOfWall = (rejectMovesWalls.length == 4 || hitFlatWall) ? this.position.findTheta(currentWalls) : this.position.findTheta(rejectMovesWalls);
		

			if (directionOfWall <= Math.PI/2) {
				directionOfWall = (theta < Math.PI) ? directionOfWall: directionOfWall + 2*Math.PI;
			}
			if (theta <= Math.PI/2) {
				directionOfWall = (directionOfWall < Math.PI) ? directionOfWall: directionOfWall - 2*Math.PI;
			}
			//bounce in opposite direction of wall then change based on angle hit
			//higher changeDir means theta needs to be corrected less
			let changeDirBy = theta - directionOfWall;
			this.bounce = true;
			this.directionOfBounce = this.position.correctRangeOfTheta(directionOfWall + Math.PI - changeDirBy);


			let temp = Math.abs(changeDirBy) - Math.PI/4;
			if (temp > 0  && this.velocity > 0){
				this.velocity = (temp * this.velocity)/(Math.PI/4);
			} else {
				this.velocity = 0;
			}


			if (this.velocity > 0 && this.easyMode) {
				let neg = (changeDirBy < 0) ? -1: 1;
				temp = (Math.PI/2 - Math.abs(changeDirBy))*neg;


				if (Math.abs(changeDirBy) > 3*Math.PI/8){
					this.cameraStepsLeft = 15;
					this.stepToCamera = (temp)/15;
					time = 300;
				} else if (Math.abs(changeDirBy) > Math.PI/4){
					this.cameraStepsLeft = 20;
					this.stepToCamera = neg *(Math.PI/8)/20;
					time = 300;
				} else {

					this.cameraStepsLeft = 0;
				}
			}


			if(!hitFlatWall){
				this.cornerBackup = true;
				this.cornerBounceTheta = this.position.correctRangeOfTheta(this.position.theta - Math.PI);
				time = 450;
				setTimeout(()=> {
					this.cornerBackup = false;
				}, 50);	
			}

			

			setTimeout(()=> {
				this.bounce = false;
			}, time);					// update runs 27-28 times during timeout
			if (!this.cornerBackup){
				this.move(.3, this.directionOfBounce);
			}
						
		}
    };


	changeVelocityAxisX(){
		// if up then velocity increase if down velocity decreases	// 1st equation of motion with t=1 
		if(this.game.left){
			//this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel, this.turn_max_vel);
			this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel * this.game.clockTick * 40, this.turn_max_vel);
			this.velocity = Math.max(this.velocity- this.velocity * this.decel * this.game.clockTick * 8, 0);
		} else if(this.game.right){
			//this.turn_velocity = Math.max(this.turn_velocity - this.turn_accel, -this.turn_max_vel);
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
			//this.velocity = Math.max(this.velocity-this.decel, 0);
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
		let x = Math.floor(Math.abs(possibleX));
		let y = Math.floor(possibleY);

	
		let findWalls = this.trackInfo.whereIsWall[x][y];
		let typeOfTerrain = this.trackInfo.terrianMap[x][y];
		let canDrive = typeOfTerrain != 'Wall';
		// h (y) decreases as we go N
		// h (y) increases as we go S
		// absolute val of w (x) decreases as we go west
		// absolute val of w (x) increases as we go east 
		if (findWalls.length == 2 && canDrive){
			canDrive = this.lookForDarkSide(findWalls, -(possibleX + x), (possibleY - y));
			
		}

		this.updateHealthAndRoadCond(typeOfTerrain);
		return canDrive;
    };


	lookForDarkSide(theWalls, w, h){
		if (theWalls.length <= 1){
			return true;
		} else if (theWalls >= 3) {
			return false;
		} else {
			switch(theWalls) {		
				case 'NE':			
					return h > w;
					break;
				case 'SE':			
					return h + w <= 0.9;
					break;
				case 'NW':			
					return h + w > 0.9;
					break;
				case 'SW':			
					return h <= w;
					break;
			}	
		}
	};

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