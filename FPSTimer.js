
class FPSTimer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        this.hasStarted = false;
        this.ticks = [];
    };

    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        //FPS COUNTER -------------------------------------
        this.ticks.push(delta);
        let index = this.ticks.length - 1;
        let sum = 0;
        while(sum <= 1 && index >= 0) {
            sum += this.ticks[index--];
        }
        index++;
        this.ticks.splice(0, index);
        //-------------------------------------------------
        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        
        return gameDelta;
    };
};
