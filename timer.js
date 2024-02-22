// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        this.hasStarted = false;
    };

    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        if (this.hasStarted) {
            this.millisecond += delta*1000;
            if (this.millisecond >= 1000) {
                this.second++;
                this.millisecond = 0;
            }
            if (this.second >= 60) {
                this.second = 0;
                this.minute++;
            }
            document.getElementById('minute').innerText = this.returnData(this.minute);
            document.getElementById('second').innerText = this.returnData(this.second);
            document.getElementById('millisecond').innerText = this.returnData(this.millisecond);
        }
        
        return gameDelta;
    };
    reset() {
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        document.getElementById('minute').innerText = '00';
        document.getElementById('second').innerText = '00';
        document.getElementById('millisecond').innerText = '000';
    }
    end() {
        document.getElementById('curLap').innerText = 1 + ": ";
        this.reset();
        this.hasStarted=false;
    }
    returnData(input) {
        return input > 10 ? input : `0${input}`
    }
    //code to create lap time in hud
	createLapTime(curLap) {
		if (curLap > 1) {
			const newDiv = document.createElement("div");
			newDiv.classList.add("lapTime");
			console.log("Lap " + (curLap -1) + ": " + this.minute + ":" + 
				this.second + ":" + this.millisecond);
			let text = document.createElement("SPAN");
			text.innerHTML = ("Lap " + (curLap - 1) + ":&nbsp");
			// and give it some content

			// add the text node to the newly created div
			newDiv.appendChild(text);
			let hudMinutes = document.createTextNode(this.minute+ "'");
			let hudSeconds = document.createTextNode(this.second+"\"");
			let hudMilliseconds = document.createTextNode(this.millisecond);

			// add the newly created element and its content into the DOM
			let hud = document.getElementById("hud")
			hud.appendChild(newDiv);
			newDiv.appendChild(hudMinutes);
			newDiv.appendChild(hudSeconds);
			newDiv.appendChild(hudMilliseconds);
            this.reset();
		}
		
	}
};
