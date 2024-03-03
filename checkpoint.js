class Checkpoint {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = -x;//319;
        this.y = y; //197;
        this.width = width; //2;
        this.height = height //22;
        this.notReached = true;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);										
    };
    update() {	       
    };
    draw(ctx) {
	};
}