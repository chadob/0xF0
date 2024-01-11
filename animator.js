/**
 * This animator class differs from the animator class in lecture in that it supports spritesheets that
 * hold an animaton across multiple rows in the png file.
 */

class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framesPerRow, sizeMultiplier) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framesPerRow, sizeMultiplier});

        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
        this.currentRow = 0;
        this.nextFrame = 1;
        this.numRows = Math.ceil(frameCount/framesPerRow);
        // console.log("CREATED SPRITE: " + xStart + ", " + yStart + ", " + width + ", " + height + ", " + frameCount + ", " + frameDuration + ", " + framesPerRow + ", " + sizeMultiplier);
    };

    drawFrame(tick, ctx, x, y, scale) {

        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();
        const currentCol = frame%this.framesPerRow;
        let currentRow;
        if (this.numRows > 1) {
            currentRow = Math.floor(frame/this.numRows);
        } else {
            currentRow = 0;
        }
        const dX = this.xStart + this.width*currentCol;
        const dY = this.yStart + this.height*currentRow;

        ctx.drawImage(this.spritesheet,
            dX, dY,
            this.width, this.height,
            x, y,
            this.width*this.sizeMultiplier, this.height*this.sizeMultiplier);
            
        // console.log("Drew frame: " + frame + " Column: " + currentCol + " Row: " + this.currentRow + " at (" + dX + ", " + dY + ")");

    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};