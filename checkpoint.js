class Checkpoint {
    constructor(game) {
        this.game = game;
		this.width = 2;
        this.height = 21;
        this.x = -319;
        this.y = 197;
        this.notReached = true;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);										
    };
    update() {	       
    };
    draw(ctx) {
	};
}