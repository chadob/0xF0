class FinishLine {
    constructor(game) {
        this.game = game;
		this.width = 2;
        this.height = 24;
        this.x = -143;
        this.y = 5;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);										
    };
    update() {	       
    };
    draw(ctx) {
	};
}