class MainMenu {
    constructor() {
        
        
        this.menu = document.createElement("canvas");
        this.menu.id = "menu";
        this.menu.width = 1024;
        this.menu.height = 522;
        this.menu.tabIndex = "0";
        this.menu.style.background = "violet";
        this.menu.style.border = "1px solid";
        document.body.appendChild(this.menu);
        this.ctx = menu.getContext("2d");
        this.menu.addEventListener("click", e => {

            console.log("CLICK");
            sceneManager.loadRace();
            this.hideMenu();
            
        });
        this.ctx.drawImage(ASSET_MANAGER.getAsset("Sprites/Menu/fzero_title.png"), 0, 0);
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