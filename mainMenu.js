class MainMenu {
    constructor() {
        this.menu = document.getElementById("mainMenu");
        this.startButton = document.getElementById("startRaceButton");
        this.controlsMenu = document.getElementById("controlsMenu");
        this.creditsMenu = document.getElementById("creditsMenu");
        this.raceOptionsMenu = document.getElementById("raceOptionsMenu");
        this.toRaceOptionsButton = document.getElementById("toRaceButton");
        this.racerSelectCanvas = document.getElementById("selectedCarImg");
        this.racerSelectCTX = this.racerSelectCanvas.getContext('2d');

        //For looping through cars
        this.carNames = Object.keys(carData);
        this.carNamesLength = this.carNames.length;
        this.currentCarIndex = this.carNames.indexOf("Lambo");
        this.currentCar = this.carNames.at(this.currentCarIndex);
        //For other settings
        this.numLaps = 3;
        this.indestructable = false;

        this.toRaceOptionsButton.addEventListener("click", e => {
            this.currentMenu.hidden = "true";
            this.raceOptionsMenu.hidden = null;
            this.currentMenu = this.raceOptionsMenu;
        });
        this.startButton.addEventListener("click", e => {
            sceneManager.loadRace();
            this.currentMenu.hidden = "true";
            this.hideMenu();
            this.playCountdown();
            let muteButton = document.getElementById('mute');
            ASSET_MANAGER.playAsset("Sounds/8bit-bop2.wav");
            ASSET_MANAGER.muteAudio(muteButton.checked);
        });
        this.controlsButton = document.getElementById("controlsButton");
        this.controlsButton.addEventListener("click", e => {
            this.controlsMenu.hidden = null;
            this.menu.hidden = "hidden";
            this.currentMenu = this.controlsMenu;
        });
        this.creditsButton = document.getElementById("creditsButton");
        this.creditsButton.addEventListener("click", e => {
            this.creditsMenu.hidden = null;
            this.menu.hidden = "hidden";
            this.currentMenu = this.creditsMenu;
        });
        this.backButtons = document.getElementsByClassName("backButton");
        for (let item of this.backButtons) {
            item.addEventListener("click", e => {
                // console.log("back button pressed");
                this.menu.hidden = null;
                this.currentMenu.hidden = "hidden";
            });
        }
        this.incCarButton = document.getElementById("incCarButton");
        this.incCarButton.addEventListener("click", e=> {
            this.selectNextCar(1);
        });
        this.decCarButton = document.getElementById("decCarButton");
        this.decCarButton.addEventListener("click", e=> {
            this.selectNextCar(-1);
        });
        this.incLapsButton = document.getElementById("incLaps");
        this.incLapsButton.addEventListener("click", e=>{
            this.setLaps(1);
        });
        this.decLapsButton = document.getElementById("decLaps");
        this.decLapsButton.addEventListener("click", e=>{
            this.setLaps(-1);
        });
        this.indButtons = document.getElementsByClassName("indButton");
        for (let item of this.indButtons) {
            item.addEventListener("click", e => {
                this.setIndestructable();
            });
        }
        this.selectNextCar(0);
        this.currentMenu = this.menu;
        this.showMenu();
    }

    selectNextCar(direction) {
        this.currentCarIndex += direction;
        if(this.currentCarIndex < 0) {
            this.currentCarIndex = this.carNamesLength - 1;
        } else if (this.currentCarIndex >= this.carNamesLength) {
            this.currentCarIndex = 0;
        }
        this.currentCar = this.carNames.at(this.currentCarIndex);
        let carNameElem = document.getElementById("carName");
        carNameElem.innerText=this.currentCar;
        let carPicElem = document.getElementById("selectedCarImg");
        carPicElem.src = carData[this.currentCar].sprite;
        let carHPElem = document.getElementById("carHP");
        carHPElem.innerText = carData[this.currentCar].body;
        let carVELElem = document.getElementById("carVel");
        carVELElem.innerText = Math.ceil(carData[this.currentCar]["top speed"] * 1000);
        let carAccElem = document.getElementById("carAcc");
        carAccElem.innerText = carData[this.currentCar].acceleration * 1000;
        var src = carData[this.currentCar].sprite;
        this.racerSelectCTX.reset();
        this.racerSelectCTX.drawImage(ASSET_MANAGER.getAsset(src), 64, 0, 64, 64, 0, 32, this.racerSelectCanvas.width, this.racerSelectCanvas.height);
    }

    setLaps(direction) {
        this.numLaps += direction;
        if (this.numLaps < 1)
            this.numLaps = 1;
        else if (this.numLaps > 5)
            this.numLaps = 5;
        document.getElementById("numLaps").innerText = this.numLaps;
    }

    setIndestructable() {
        this.indestructable = !this.indestructable;
        let text;
        if(this.indestructable)
            text = "TRUE";
        else
            text = "FALSE";
        document.getElementById("indestructable").innerHTML = text;
    }

    getLaps() {
        return this.numLaps;
    }

    getIndestructable() {
        return this.indestructable;
    }
    getSelectedCarName() {
        return this.currentCar;
    }
    hideMenu() {
        this.menu.hidden = "hidden";
        let gw = document.getElementById("gameworld");
            gw.focus();
    }
    showMenu() {
        this.menu.hidden = null;
        this.currentMenu = this.menu;
        this.menu.focus();
    }
    playCountdown() {
        //Countdown Animation
        let container = document.getElementById("transitionContainer");
        if(!document.getElementById('countdown')) {
            let countdownElem = document.createElement('h1');
            countdownElem.id = "countdown";
            container.appendChild(countdownElem);
            container.hidden = false;
            ASSET_MANAGER.playAsset("Sounds/countdown.mp3");
            setTimeout(() => {
                sceneManager.enableInput();
            }, 2700);
            setTimeout(() => {
                countdownElem.remove();
                container.hidden = true;
            }, 4000);
        }
    }
}