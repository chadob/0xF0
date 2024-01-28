class MainMenu {
    constructor() {
        // this.menu = document.createElement("div");
        // this.menu.id = "mainMenu";
        this.menu = document.getElementById("mainMenu");
        // this.menu.tabIndex = 0;
        // document.body.appendChild(this.menu);
        // this.ctx = menu.getContext("2d");
        this.startButton = document.getElementById("startRaceButton");
        this.startButton.addEventListener("click", e => {

            console.log("CLICK");
            sceneManager.loadRace();
            this.hideMenu();
            
        });
        // this.ctx.drawImage(ASSET_MANAGER.getAsset("Sprites/Menu/fzero_title.png"), 0, 0);
        this.showMenu();
    }
    hideMenu() {
        this.menu.hidden = "hidden";
        let gw = document.getElementById("gameworld");
        // if (gw != null) {
            gw.focus();
        // }
    }
    showMenu() {
        this.menu.hidden = null;
        this.menu.focus();
    }
}