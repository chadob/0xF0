class mapKey {
    constructor(img_tag) {
        this.terrianMap = [];
        this.arrayOfColorsMap = this.get_image(img_tag);
        this.imgw = img_tag.width;
        //create map
        for (let w = 0; w < img_tag.width; w++) {
            this.terrianMap[w] = [];
            for (let h = 0; h < img_tag.height; h++) {
                this.terrianMap[w][h] = this.findTerrian(w,h);
                
                // if (this.isRoad(-w, h)) {
                //     map[w][h] = 'Road';
                // } else {
                //     map[w][h] = 'Wall';
                // }
                // if (w > 1 && h > 0 && h < img_tag.height - 1 && map[w - 1][h] == 'Road') {
                //     let roadNorth = map[w - 2][h] == 'Wall';
                //     let roadSouth = map[w][h] == 'Wall';
                //     let roadWest = map[w - 1][h - 1] == 'Wall';
                //     let roadEast = map[w - 1][h + 1] == 'Wall';
                //     if(roadEast+roadNorth+roadSouth+roadWest >= 3) {
                //         map[w - 1][h] = 'Wall'
                //     } else {
                //     if (roadNorth && roadWest) {	// cant drive in NW corner
                //         map[w - 1][h] = 'NW';
                //     } else if (roadNorth && roadEast) {
                //         map[w - 1][h] = 'NE';
                //     } else if (roadSouth && roadWest) {
                //         map[w - 1][h] = 'SW';
                //     } else if (roadSouth && roadEast) {
                //         map[w - 1][h] = 'SE';
                //     }
                //}
                
            }
        }
    };
findTerrian(possibleX, possibleY){
    
    const pos = (this.imgw * (Math.floor(possibleY)) + (Math.floor(possibleX)))*4;
    const rgba1 = this.arrayOfColorsMap.data[pos];
    const rgba2 = this.arrayOfColorsMap.data[pos +1];
    const rgba3 = this.arrayOfColorsMap.data[pos+2];

    let terrianType = "Road";

    //bright pink for boost
    if (rgba1 == 255 && rgba2 == 23 && rgba3 == 240) {
        terrianType = "Boost";
    } // lime green for ice 
    else if (rgba1 == 100 && rgba2 == 255 && rgba3 == 113) {
        terrianType = "Ice";
    } // yellow for dirt
    else if (rgba1 == 60 && rgba2 == 100 && rgba3 == 100) {
        terrianType = "Dirt";
    } // orange for lava
    else if (rgba1 == 36 && rgba2 == 100 && rgba3 == 100) {
        terrianType = "Lava";
    } 
    else if (rgba1+rgba2+rgba3 < 110) {
        terrianType = "Wall";
    }
    return terrianType;
         //arbitrary val, I just noticed dark colors tend to have low values
};
get_image(img_tag){
    let fake_canvas = document.createElement('canvas'),
        fake_context = fake_canvas.getContext('2d');
    fake_canvas.width = img_tag.width;
    fake_canvas.height = img_tag.height;
    fake_context.drawImage(img_tag, 0, 0);
    return fake_context.getImageData(0, 0, img_tag.width, img_tag.height);
  };
};