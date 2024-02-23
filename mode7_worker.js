/*
 * mode7_worker.js: webworker to help performance
 */

let running = false,
    ctx;

let x0,
    y0,
    height,
    horizon,
    theta,
    image;

let sin_theta,
    cos_theta;

let half_w,
    half_h;

onmessage = (e)=>{
  switch(e.data.cmd){
    case 'init':
      ctx = e.data.canv.getContext('2d');
      image = e.data.image;
      half_w = image.width / 2;
      half_h = image.height / 2;
      break;
    case 'set_params':
      x0 = e.data.x0;
      y0 = e.data.y0;
      height = e.data.height;
      horizon = e.data.horizon;
      theta = e.data.theta;

      sin_theta = Math.sin(theta);
      cos_theta = Math.cos(theta);
      break;
    case 'start':
      running = true;
      break;
    case 'stop':
      running = false;
      break;
  }
};

function update(){
  if(running){
    let out = new ImageData(image.width, image.height);
    // console.log(theta + " x: " + x0 +  " y: " + y0);
    for(let i=4*image.width*horizon;i<out.data.length;i+=4){ /* i is set to this value to avoid iterating over every pixel above the horizon */
      let y = Math.floor(i/(4*image.width));              /* y is the number of times x has wrapped -- out of order for performance reasons */
      if(y >= horizon){                                   /* avoiding unnecessary computation leads to a noticeable speed increase */
        let x = Math.floor((i/4)%image.width)-half_w,     /* x wraps around every time i/4 crosses this.w, must be centered around this.w/2 rather than 0 */
            z = y/height,                                 /* z position depends upon y (closer=greater) */
            view_angle = y-half_h;                        /* angle between camera point and (x,y,z) increases with y */

        let xtemp = (x/(z*view_angle))*half_w,   /* perspective transform: the closer an object is (i.e. the smaller is z value), the larger it will be to the camera */
            ytemp = (height/view_angle)*half_h;  /* simplified form of y/(z*view_angle) -- 1/z describes perspective: larger values closer to camera, smaller farther */

        let xprime = Math.floor((xtemp * cos_theta) - (ytemp * sin_theta) - x0), /* rotate perspective-transformed point */
            yprime = Math.floor((xtemp * sin_theta) + (ytemp * cos_theta) + y0); /* add camera point to properly translate view plane rather than skew it */

        if(xprime >= 0 && xprime <= image.width && yprime >= 0 && yprime <= image.height) {
          let i_dest = ((yprime * image.width) + xprime) * 4; /* again for performance, this function has been inlined */
          
          /* NOTE from @Paul: This is where the remaping of pixels happens.
             "out".data is the array of pixels. From i to i + 3 represents 
             the RGBA values of a single pixel on the destination canvas.
             Conversely, image.data represents our source image and from 
             i_dest to i_dest + 3 represents the RGBA value of the source pixel.
             
             The i_dest is the calculated pixel that we are grabbing from 
             based on the math above. It could useful to keep this information 
             in mind when implementing features of the game :)  */

          out.data[i] = image.data[i_dest];
          out.data[i+1] = image.data[i_dest+1];
          out.data[i+2] = image.data[i_dest+2];
          out.data[i+3] = image.data[i_dest+3];
          // out.data[i+4] = image.data[i_dest+4];
          // out.data[i+5] = image.data[i_dest+5];
          // out.data[i+6] = image.data[i_dest+6];
          // out.data[i+7] = image.data[i_dest+7];
          
        }
      }
    }

    /**
     * NOTE from @Paul: This portion of code is responsible for
     * taking the new array of pixel data and turning it into
     * an image bit map that can then be drawn to the ground/map
     * canvas. Note that this canvas is seperate from the one where
     * our car is being drawn at.
    */
    
    createImageBitmap(out).then((bitmap)=>{
      ctx.clearRect(0, 0, 1024, 522);
      ctx.drawImage(bitmap, 0, 0, 1024, 522);
      postMessage(true);
    });
    
  }
  
  requestAnimationFrame(update);
}
update();
