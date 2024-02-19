class mapKey {
    constructor(img_tag) {
        this.terrianMap = [];
        this.whereIsWall = [];
        this.arrayOfColorsMap = this.get_image(img_tag);
        //create map
        for (let w = 0; w < img_tag.width; w++) {
            this.terrianMap[w] = [];
            this.whereIsWall[w] = [];
            for (let h = 0; h < img_tag.height; h++) {
                this.terrianMap[w][h] = this.findTerrian(w,h);
       

                if (w > 1 && h > 0 && h < img_tag.height - 1) {    
                    let wallIsSouth = (this.terrianMap[w - 1][h + 1] == 'Wall') ? "S":""; //switched to S from N
                    let wallIsEast = (this.terrianMap[w][h]== 'Wall') ? "E":"";
                    let wallIsNorth = (this.terrianMap[w - 1][h - 1] == 'Wall') ? "N":""; // Same switch reversed
                    let wallIsWest = (this.terrianMap[w - 2][h] == 'Wall') ? "W":"";
        
                    this.whereIsWall[w - 1][h] = wallIsNorth+wallIsSouth+wallIsWest+wallIsEast;
                }  
            }
        }
    };

findTerrian(possibleX, possibleY){
    
    const pos = (1024 * (Math.floor(possibleY)) + (Math.floor(possibleX)))*4;
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
    else if (rgba1+rgba2+rgba3 <= 50) { //arbitrary val, have a few missed wall spots when its == 0
        terrianType = "Wall";
    }
    return terrianType;
         
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
