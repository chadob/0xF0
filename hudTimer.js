class HudTimer {
    constructor(game) {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        this.cron = setInterval(() => { this.timer(); }, 10);
    }
    reset() {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        document.getElementById('minute').innerText = '00';
        document.getElementById('second').innerText = '00';
        document.getElementById('millisecond').innerText = '000';
    }
    timer() {
        if ((this.millisecond += 10) == 1000) {
          this.millisecond = 0;
          this.second++;
        }
        if (this.second == 60) {
          this.second = 0;
          this.minute++;
        }

        document.getElementById('minute').innerText = this.returnData(this.minute);
        document.getElementById('second').innerText = this.returnData(this.second);
        document.getElementById('millisecond').innerText = this.returnData(this.millisecond);
      }
      update() {

      }
      draw() {

      }
      returnData(input) {
        return input > 10 ? input : `0${input}`
      }
}
