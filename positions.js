class position {
        constructor(posInfo) {
            this.x = posInfo.x;
            this.y = posInfo.y;
            this.theta = posInfo.theta;
            this.direction = this.updateMapDirection;
        }

        updateMapDirection(){ 
            //let t = Math.abs(this.theta % (2 * Math.PI));
            if (this.theta < 0){
                this.theta += (2 * Math.PI);
            } else if (this.theta > (2* Math.PI)) {
                this.theta -= (2 * Math.PI);
            }
            let t = this.theta;
            if (t <= Math.PI/4) {
                this.direction ='N'
            } else if (t <= (3 * Math.PI)/4) {
                this.direction ='W'
            } else if (t <= (5 * Math.PI)/4) {
                this.direction ='S'
            } else if (t <= (7 * Math.PI)/4) {
                this.direction ='E'
            } else {
                this.direction ='N'
            }
            //console.log(this.mapDirection);
        };

        findTheta(direction){
            switch(direction) {
                case 'N':
                    return 0;
                case 'E':
                    return (3*Math.PI)/2;
                case 'S':
                    return Math.PI;
                case 'W':
                    return Math.PI/2;
            }
        }
};