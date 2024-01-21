/*
 * mode7.js: a pure-javascript perspective transform (SNES Mode 7)
 *
 * basic usecase/workflow:
 *  - instantiate a new mode7 object, thereby creating a new worker
 *     which runs an animationFrame/offscreen canvas in the background
 *  - use the mode7.update(...) function to pass new transformation
 *     variables to the animationFrame
 *  - use mode7.start() and mode7.stop() when necessary to save cycles
 *
 * drawbacks of the worker model:
 *  - although generally increasing performance, the use of a webworker
 *     can lead to fits and spurts of performance rather than the
 *     consistently-poor performance of a single-threaded approach
 *  - as the canvas and rendering context have been transfered to the
 *     worker, no other script can access and write to it
 *    - workaround: place another canvas/other visuals behind it
 * 
 * a few notes:
 *  - the speed of the transformation increases dramatically the smaller
 *     the input image -- informal performance testing leads to jittering
 *     on a 1024x1024 map and smoothness on a 512x512 one
 *  - rotating/adjusting theta is by far the most expensive operation --
 *     TODO search for a faster solution
 *
 * two key ideas to understanding the relevant math:
 *  1. as a 2d plane is being projected in 3d space, the z coordinate of
 *      any given pixel in 3d space is tied to its y coordinate in 2d space
 *      (i.e. the x/y plane in 2d is just one slice of the 3d plane, meaning
 *      x/y in 2d is equivalent to x/z in 3d)
 *  2. the angle (specifically pitch because this is what creates the illusion
 *      of depth) between a camera and any given point is tied to that point's
 *      y value in 2d space (or z value in 3d space) -- objects that approach
 *      the horizon also approach the camera's "eye level" and therefore
 *      have a less steep angle
 *
 *  (3. the SNES' Mode 7 cannot itself do perspective transforms -- by nature,
 *       affine transforms [the type Mode 7 can do in hardware] preserve
 *       parallel lines while perspective transforms [such as this one] do not
 *       -- HDMA must be combined with Mode 7 to create these effects)
 */

class mode7 {
  /*
   * opts must include one of the following:
   *  - img_data: an ImageData() object
   *  - img_tag:  an HTML <img> tag
   * as well as:
   *  - canvas: an HTML <canvas> tag
   */
  constructor(opts){

    /* Game Engine entity reference that we can use to access information about gamestate/keys */
    this.gameEngine = opts.game_engine;

    /* Original Image to sample from */
    this.image = opts.img_data || this.get_image(opts.img_tag);

    /* Canvas html element that we are drawing the ground on */
    this.canv = opts.canvas;

    /* Width of the original image */
    this.w = -this.image.width;

    /* Height of the original image */
    this.h = this.image.height;

    this.position = new Position(opts.start_pos, this.image, this.map);

    /* Only one JavaScript Object can hold onto and interact with
     * the context that is used to draw to a single canvas. Here 
     * the author is created a Worker (psuedo-multithreading?) JS Object
     * and transferring the controls of this canvas to that Worker.
     */
    this.ofscr = this.canv.transferControlToOffscreen();
    this.worker = new Worker('mode7_worker.js');
    this.worker.postMessage({
      cmd: 'init',
      canv: this.ofscr,
      image: this.image,
    }, [this.ofscr]);
    this.worker.postMessage({
      cmd: 'start'
    });


    this.height = 1,
    this.horizon = this.h/2, //a change in the magitude of 1 x 10^-15 to make canvas gone,
    this.theta = opts.start_pos.theta;

  }
  /*
   * Given an HTML <img> tag, grabs the
   * appropriate ImageData() for transformation
   */
  get_image(img_tag){
    let fake_canvas = document.createElement('canvas'),
        fake_context = fake_canvas.getContext('2d');
    fake_canvas.width = img_tag.width;
    console.log(fake_canvas.width);
    fake_canvas.height = img_tag.height;
    console.log(fake_canvas.height);
    fake_context.drawImage(img_tag, 0, 0);
    this.map = fake_context.getImageData(0, 0, img_tag.width, img_tag.height);
    return fake_context.getImageData(0, 0, img_tag.width, img_tag.height);
  }
  /*
   * The game engine is keeping track of which keys are being pressed.
   * Use them here to simulate the car moving by "moving" the camera 
   * around the ground canvas.
   */
  update() {
    this.theta = this.position.theta;
     this.position.update();
	}

  /**
   * From Paul:
   * 
   * This method was added to comply with the update/draw loop of the Game Engine
   */
  draw() {

    //this.update_worker(this.x, this.y, this.height, this.horizon, this.theta);
    this.update_worker(this.position.x, this.position.y, this.height, this.horizon, this.position.theta);
  }
  /*
  * Passes a camera position, height, horizon level, and rotation to the worker.
  * The worker will then do the actual drawing of the ground canvas.
  * (Refer to mode7_worker.js)
  */
  update_worker(x0, y0, height, horizon, theta){
    this.worker.postMessage({
      cmd: 'set_params',

      x0,
      y0,
      height,
      horizon,
      theta
    });
  }
  start(){
    this.worker.postMessage({
      cmd: 'start'
    });
  }
  stop(){
    this.worker.postMessage({
      cmd: 'stop'
    });
  }
}
    /**
		 * x      : x position of camera in both 2d and 3d space
		 * y      : y position of camera in 3d space
		 * horizon: typically 1/2 of the input image's height
		 * theta  : rotation around the y axis in 3d space (think of this as the way the camera is facing)
		 * 		      not sure if in radians or degrees or what unit this is.
		 */ 
    // this.x = this.opts.start_pos.x,
    // this.y = this.opts.start_pos.y,

    
    // this.velocity = 0,
    // this.accel = 0.005,	//0.01
    // this.decel = 0.1,	//0.01
    // this.max_vel = 1;	//1
    // OG Turning settings
    // this.turn_velocity = 0,
    // turn_accel = Math.PI / 2048,
     //turn_decel = Math.PI / 2048,
     //turn_max_vel = Math.PI;

    // Paul likes these settings
    // this.turn_velocity = 0,
    // this.turn_accel = Math.PI / 1024,
    // this.turn_decel = Math.PI / 1024,
    // this.turn_max_vel = Math.PI / (64 -8);

        //  console.log("x: " + this.position.x + " y: " + this.position.y + " theta: " + this.theta);
		// if(gameEngine.up){
		// 	this.velocity = Math.min(this.velocity+this.accel, this.max_vel);
		// } else if(gameEngine.down){
		// 	this.velocity = Math.max(this.velocity-this.accel, -this.max_vel);
		// } else if(this.velocity < 0) {
		// 	this.velocity = Math.min(this.velocity+this.decel, 0);
		// } else {
		// 	this.velocity = Math.max(this.velocity-this.decel, 0);
		// }
       /* These are the arguments passed into the constructor. */
   // this.opts = opts;


    // this.position.move(this.velocity);

     //  var possibleX = this.x + this.velocity * Math.sin(this.theta);
    //  var possibleY = this.y + this.velocity * Math.cos(this.theta);
    // if (this.x += v * Math.sin(this.theta);){
		//   this.x += this.velocity * Math.sin(this.theta);
		//   this.y += this.velocity * Math.cos(this.theta);
    // } else if (this.position.canMove(this.map, this.x, possibleY)) {
    //   this.y += this.velocity * Math.cos(this.theta);
    // } else if (this.position.canMove(this.map, possibleX, this.y)) {
    //   this.x += this.velocity * Math.sin(this.theta);
    // }

    		// if(gameEngine.left){
		// 	this.turn_velocity = Math.min(this.turn_velocity+this.turn_accel, this.turn_max_vel);
		// } else if(gameEngine.right){
		// this.turn_velocity = Math.max(this.turn_velocity-this.turn_accel, -this.turn_max_vel);
		// } else if(this.turn_velocity < 0){
		// 	this.turn_velocity = Math.min(this.turn_velocity+this.turn_decel, 0);
		// } else {
		// 	this.turn_velocity = Math.max(this.turn_velocity-this.turn_decel, 0);
		// }

		// this.theta += this.turn_velocity;
    // this.position.theta = this.theta;