class MainMenu {
    constructor() {
        this.menu = document.getElementById("mainMenu");
        this.startButton = document.getElementById("startRaceButton");
        this.controlsMenu = document.getElementById("controlsMenu");
        this.creditsMenu = document.getElementById("creditsMenu");
        this.raceOptionsMenu = document.getElementById("raceOptionsMenu");
        this.toRaceOptionsButton = document.getElementById("toRaceButton");
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
                console.log("back button pressed");
                this.menu.hidden = null;
                this.currentMenu.hidden = "hidden";
            });
        }
        
        this.currentMenu = this.menu;
        this.showMenu();
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