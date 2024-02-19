class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration});

        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
    };
    
    drawSelf(tick, ctx, x, y, direction) {
        ctx.drawImage(this.spritesheet,
            direction, this.yStart,
            this.width, this.height,
            x, y,
            600, 600);
    };
    drawSprite(ctx, x, y, newWidth, newHeight) {
        ctx.drawImage(this.spritesheet,
            420, this.yStart,
            this.width, this.height,
            x, y,
            newWidth, newHeight);
    }

    drawFrame(tick, ctx, x, y) {
        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();
        ctx.drawImage(this.spritesheet,
            this.xStart + this.width*frame, this.yStart,
            this.width, this.height,
            x, y,
            this.width, this.height);
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
