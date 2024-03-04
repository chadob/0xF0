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
        this.lapTimes = [];
    };

    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;

        if (this.hasStarted) {
            const minuteElement = document.getElementById('minute');
            const secondElement = document.getElementById('second');
            const millisecondElement = document.getElementById('millisecond');
    
            if (minuteElement && secondElement && millisecondElement) {
                this.millisecond += delta * 1000;
                if (this.millisecond >= 1000) {
                    this.second++;
                    this.millisecond = 0;
                }
                if (this.second >= 60) {
                    this.second = 0;
                    this.minute++;
                }
    
                minuteElement.innerText = this.returnData(this.minute);
                secondElement.innerText = this.returnData(this.second);
                millisecondElement.innerText = this.returnData(this.millisecond);
            }
        }
        
        return gameDelta;
    };

    reset() {
        const minuteElement = document.getElementById('minute');
        const secondElement = document.getElementById('second');
        const millisecondElement = document.getElementById('millisecond');
    
        if (minuteElement && secondElement && millisecondElement) {
            this.minute = 0;
            this.second = 0;
            this.millisecond = 0;
    
            minuteElement.innerText = '00';
            secondElement.innerText = '00';
            millisecondElement.innerText = '000';
        }
    }

    end() {
        document.getElementById('curLap').innerText = 1 + ": ";
        this.reset();
        this.hasStarted=false;
    }

    returnData(input) {
        return input > 10 ? input : `0${input}`
    }

    // code to create lap time in hud
    createLapTime(curLap) {
    if (curLap > 1 && !this.gameEnded) {
        const lapTime = this.minute * 60 + this.second + this.millisecond / 1000;
        this.lapTimes.push(lapTime);

        const newDiv = document.createElement("div");
        newDiv.classList.add("lapTime");

        // display current lap time
        console.log("Lap " + (curLap - 1) + ": " + this.formatTime(lapTime));

        let text = document.createElement("SPAN");
        text.innerHTML = ("Lap " + (curLap - 1) + ":&nbsp");
        newDiv.appendChild(text);

        let hudMinutes = document.createTextNode(this.minute + "'");
        let hudSeconds = document.createTextNode(this.second + "\"");
        let hudMilliseconds = document.createTextNode(this.millisecond);

        let hud = document.getElementById("hud");
        hud.appendChild(newDiv);
        newDiv.appendChild(hudMinutes);
        newDiv.appendChild(hudSeconds);
        newDiv.appendChild(hudMilliseconds);

        // update best lap time
        let bestLapDiv = document.getElementById("bestLapDiv");
        if (!bestLapDiv) {
            bestLapDiv = document.createElement("div");
            bestLapDiv.classList.add("lapTime");
            bestLapDiv.id = "bestLapDiv";
            hud.appendChild(bestLapDiv);
        }

        let bestLapText = (this.lapTimes.length > 0 ? this.formatTime(Math.min(...this.lapTimes)) : "N/A");
        console.log("Best Lap: " + bestLapText);
        bestLapDiv.innerText = "Best Lap: " + bestLapText;


        this.reset();
        }
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
        
        return `${minutes}'${seconds}"${this.returnData(milliseconds)}`;
    }
};
