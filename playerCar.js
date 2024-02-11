class PlayerCar {
    constructor(start_pos, hiddenImage, game, hudTimer) {
        this.game = game;
		this.direction = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./lambo.png"), 0, 0, 950, 600, 3, 0.5);
		this.curLap = 0;
		this.width = .5;
		this.height = .5;
		this.maxHealth = 100;
		this.health = 100;
		this.canBoost = true;
		this.indestructible = false;
		this.hudCurLap = document.getElementById('curLap');
		this.position = new position(start_pos);
		this.trackInfo = new mapKey(hiddenImage);
		this.hudTimer = hudTimer;

		this.bounce = false;
		this.bounceTheta = 0;
		this.AdjustNeg = false; 


        this.velocity = 0,
		this.turningSpeed = .25;
        this.accel = 0.005,	//0.01
        this.decel = 0.1,	//0.01
        this.max_vel = 1;
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
                if (entity instanceof FinishLine) {
					if (entity.passable) {
						that.curLap++;
						that.hudCurLap.innerText = that.curLap + ": ";
						that.createLapTime();
						that.hudTimer.reset();
						if (that.curLap === 4) {
							console.log("You win!");
							that.hudTimer.end();
							document.querySelectorAll('.lapTime').forEach(e => e.remove());
							sceneManager.playerDeath();
						}   
						entity.passable = false;
						setTimeout(() => {
							entity.passable = true
						}, 20000);
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
			sceneManager.playerDeath();
			this.hudTimer.end();
			document.querySelectorAll('.lapTime').forEach(e => e.remove());
		}

		this.changeVelocityAxisY();

		if (this.bounce){
			this.move(0.3, this.bounceTheta);
		} else {
			this.move(this.velocity, this.position.theta);
		}

		this.changeVelocityAxisX();
		this.position.updateMapDirection();


		this.position.theta += this.turn_velocity;
		this.checkForPowerSlide();

    };

	checkBoostOrBreak(){
		//	checks if boost button is hit
		if (this.game.boosting) {
			//checks current boost power
			if (this.health > 1) {
				this.health = Math.max(1, this.health-= (20* this.game.clockTick));
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
			const newDiv = document.createElement("div");
			newDiv.classList.add("lapTime");
			console.log("Lap " + (this.curLap -1) + ": " + this.hudTimer.minute + ":" + 
				this.hudTimer.second + ":" + this.hudTimer.millisecond);
			let text = document.createElement("SPAN");
			text.innerHTML = ("Lap " + (this.curLap - 1) + ":&nbsp");
			// and give it some content

			// add the text node to the newly created div
			newDiv.appendChild(text);
			let hudMinutes = document.createTextNode(this.hudTimer.minute+ "'");
			let hudSeconds = document.createTextNode(this.hudTimer.second+"\"");
			let hudMilliseconds = document.createTextNode(this.hudTimer.millisecond);

			// add the newly created element and its content into the DOM
			let hud = document.getElementById("hud")
			hud.appendChild(newDiv);
			newDiv.appendChild(hudMinutes);
			newDiv.appendChild(hudSeconds);
			newDiv.appendChild(hudMilliseconds);
		}
		
	}
    move(v, theta) {
        var possibleX = this.position.x + v * Math.sin(theta);
        var possibleY = this.position.y + v * Math.cos(theta);


		if (this.canMove(possibleX, possibleY)){	
			//console.log("1")
			this.position.x += v * Math.sin(theta);
            this.position.y += v * Math.cos(theta);
		}
		else {

			let findWalls = this.trackInfo.whereIsWall[this.position.getIntX()][this.position.getIntY()];
			let directionOfBounce = theta;

			if(findWalls.length == 1) { 
				//bounce in opposite direction in wall then add 
				//console.log("3")
				let directionOfWall = this.position.findTheta(findWalls); //E
				if (directionOfWall == 0) {
					directionOfWall = (theta < Math.PI) ? 0: 2*Math.PI;
				}
				let changeDirBy = theta - directionOfWall;
				this.AdjustNeg = (theta - directionOfWall < 0);
				console.log();
				directionOfBounce = this.position.correctRangeOfTheta(directionOfWall + Math.PI - changeDirBy);
		

			} else {

				this.velocity = 0;
				directionOfBounce = this.position.correctRangeOfTheta(theta - Math.PI/2);
			}

			
			
			//console.log("5")
			this.bounce = true;
			this.bounceTheta = directionOfBounce;
			setTimeout(()=> {
				this.bounce = false;
			}, 450);					// update runs 27-28 times during timeout
			this.move(.3, this.bounceTheta);
		}
    };


	changeVelocityAxisX(){
		// if up then velocity increase if down velocity decreases	// 1st equation of motion with t=1 
		if(this.game.left){
			this.turn_velocity = Math.min(this.turn_velocity + this.turn_accel, this.turn_max_vel);
		} else if(this.game.right){
			this.turn_velocity = Math.max(this.turn_velocity - this.turn_accel, -this.turn_max_vel);
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
			this.velocity = Math.max(this.velocity-this.decel, 0);
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
			console.log(terrian);
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
		//let findWalls = this.trackInfo.whereIsWall[x][y];
		let typeOfTerrain = this.trackInfo.terrianMap[x][y];
		let canDrive = typeOfTerrain != 'Wall';

		console.log(typeOfTerrain);
		this.updateHealthAndRoadCond(typeOfTerrain);
		return canDrive;
    };

	lookForDarkSide(theWalls, w, h){
		
		switch(theWalls) {
			case 'SW':
				return h > w;
			case 'ES':
				return h + w <= 0.9;
			case 'NW':
				return h + w > 0.9;
			case 'NE':
				return h <= w;
		}
	}

    draw(ctx) {
		ctx.save();
		ctx.scale(0.25,0.25);
        this.animator.drawSelf(this.game.clockTick, ctx, 1500, 1500, this.direction)
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
			this.move(.3, this.position.theta + Math.PI/2)
		}
		if (this.game.slideR) {
			this.position.theta -= .02;
			this.move(.3, this.position.theta - Math.PI/2)
		}
	};

	directionOfSprite() {
		if (this.game.left) {
			this.direction = 0;
		} else if (this.game.right) {
			this.direction = 1800;
		} else {
			this.direction = 950;
		}
	};
};
       
					// if (findWalls.length == 2 && canDrive){
		// 	console.log(findWalls + " " + x + " x "+ y);
		// 	console.log("MY WALLS  " +  findWalls + " my desired pos "+possibleX +" x "+possibleY);
			
		// 		// w = .22 vs h = .12
		// 	canDrive = this.lookForDarkSide(findWalls, -(possibleX + x), (possibleY - y));
		// }
		
		
		// console.log("SW\n");
		// for (let w = 0; w < 10; w++){
		// 	let string = " ";
		// 	for (let h = 0; h < 10; h++){
		// 		string += (" " + this.lookForDarkSide("SW", w/10, h/10));
		// 	}
		// 	console.log(string + " " +w/10);
		// }

		// console.log("NW\n");
		// for (let w = 0; w < 10; w++){
		// 	let string = " ";
		// 	for (let h = 0; h < 10; h++){
		// 		string += (" " + this.lookForDarkSide("NW", w/10, h/10));
		// 	}
		// 	console.log(string);
		// }
		// console.log("SE\n");
		// for (let w = 0; w < 10; w++){
		// 	let string = " ";
		// 	for (let h = 0; h < 10; h++){
		// 		string += (" " + this.lookForDarkSide("ES", w/10, h/10));
		// 	}
		// 	console.log(string);
		// }
		// console.log("NE\n");
		// for (let w = 0; w < 10; w++){
		// 	let string = " ";
		// 	for (let h = 0; h < 10; h++){
		// 		string += (" " + this.lookForDarkSide("NE", w/10, h/10));
		// 	}
		// 	console.log(string);
		// }