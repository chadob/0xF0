class FinishLine {
    constructor(game) {
        this.game = game;
		this.width = .5;
        this.height = 24;
        this.x = -142;
        this.y = 5;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);										
    };
    update() {	       
    };
    draw(ctx) {
	};
}