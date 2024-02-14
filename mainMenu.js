class MainMenu {
    constructor() {
        this.menu = document.getElementById("mainMenu");
        this.startButton = document.getElementById("startRaceButton");
        this.startButton.addEventListener("click", e => {
            console.log("CLICK");
            sceneManager.loadRace();
            this.hideMenu();
            this.playCountdown();
            ASSET_MANAGER.muteAudio(true);
            ASSET_MANAGER.playAsset("Sounds/8bit-bop2.wav");
            
        });
        this.showMenu();
    }
    hideMenu() {
        this.menu.hidden = "hidden";
        let gw = document.getElementById("gameworld");
            gw.focus();
    }
    showMenu() {
        this.menu.hidden = null;
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