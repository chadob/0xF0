class position {
        constructor(posInfo) {
            this.x = posInfo.x;
            this.y = posInfo.y;
            this.theta = posInfo.theta;
            this.direction = this.updateMapDirection;
        }

        updateMapDirection(){ 
            //let t = Math.abs(this.theta % (2 * Math.PI));
            this.theta = this.correctRangeOfTheta(this.theta);

            let t = this.theta;
            if (t <= Math.PI/4) {
                this.direction ='S'
            } else if (t <= (3 * Math.PI)/4) {
                this.direction ='W'
            } else if (t <= (5 * Math.PI)/4) {
                this.direction ='N'
            } else if (t <= (7 * Math.PI)/4) {
                this.direction ='E'
            } else {
                this.direction ='S'
            }
            //console.log(this.mapDirection);
        };

        correctRangeOfTheta(theta){
            let newT = theta;
            if (newT < 0){
                newT += (2 * Math.PI);
            } else if (newT > (2* Math.PI)) {
                newT -= (2 * Math.PI);
            }
            return newT;
        };

        findRange0_90(theta){
            let newT = theta;

            if (newT >= 3 * (Math.PI/2)){
                newT -= (3 * (Math.PI/2));
            } else if (newT >= (Math.PI)) {
                newT -= (Math.PI);
            } else if (newT >= Math.PI/2) {
                newT -= Math.PI/2;
            }
            return newT;
        };

        getDegrees(radians){
            return radians * (180/Math.PI);
        };

        getIntX(){
            return Math.floor(-this.x);
        };
        convertIntX(x){
            return Math.floor(-x);
        };

        getIntY(){
            return Math.floor(this.y);
        };
        convertIntY(y){
            return Math.floor(y);
        };

        findTheta(direction){
            switch(direction) {
                case 'S':
                    return 0;
                case 'E':
                    return (3*Math.PI)/2;
                case 'N':
                    return Math.PI;
                case 'W':
                    return Math.PI/2;
            }
        }
};