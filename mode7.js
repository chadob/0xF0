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
  constructor(car, img_tag, canvas, game_engine, imgBG){

    /* Game Engine entity reference that we can use to access information about gamestate/keys */
    this.gameEngine = game_engine;

    /* Original Image to sample from */ 
    this.image = this.get_image(img_tag);

    /* Canvas html element that we are drawing the ground on */
    this.canv = canvas;

    //Canvas for drawing bg
    this.bgCanv = document.getElementById("bgCanvas");
    this.bgCtx = this.bgCanv.getContext("2d");
    this.imgBG = imgBG;
    this.imgBG.width=10*this.bgCanv.width;
    this.imgBG.height = .6 *this.bgCanv.height;
    

    /* Width of the original image */
    this.w = -this.image.width;

    /* Height of the original image */
    this.h = this.image.height;

    this.mainCar = car.position;


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
    this.horizon = this.h/2 + .00000000000001, //a change in the magitude of 1 x 10^-15 to make canvas gone,
    this.theta = this.mainCar.theta;

  }
  /*
   * Given an HTML <img> tag, grabs the
   * appropriate ImageData() for transformation
   */
  get_image(img_tag){
    let fake_canvas = document.createElement('canvas'),
        fake_context = fake_canvas.getContext('2d');
    fake_canvas.width = img_tag.width;
    fake_canvas.height = img_tag.height;
    fake_context.drawImage(img_tag, 0, 0);
    return fake_context.getImageData(0, 0, img_tag.width, img_tag.height);
  }
  /*
   * The game engine is keeping track of which keys are being pressed.
   * Use them here to simulate the car moving by "moving" the camera 
   * around the ground canvas.
   */
  update() {
    // console.log(this.mainCar.x + " x " + this.mainCar.y);

    // code for the horizon
      for (let w = this.bgCanv.width*(this.mainCar.theta); w > this.bgCanv.width; w -= this.imgBG.width) {
        for (let h = 0; h < this.bgCanv.height; h += this.imgBG.height) {
          this.bgCtx.drawImage(this.imgBG,  -w, h, 10*this.bgCanv.width, .6*this.bgCanv.height);
        }
      }
	}

  /**
   * From Paul:
   * 
   * This method was added to comply with the update/draw loop of the Game Engine
   */
  draw() {
    this.update_worker(this.mainCar.x, this.mainCar.y, this.height, this.horizon, this.mainCar.theta);
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