class Checkpoint {
    constructor(game, x, y) {
        this.game = game;
        this.x = -x; //319;
        this.y = y; //197;
        this.width = 2;
        this.height = 24;
        this.notReached = true;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);										
    };
    update() {	 
        console.log(this.notReached);      
    };
    draw(ctx) {
	};
}