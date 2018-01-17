const Brick = require('./Brick');

class Document {

    constructor() {
        this.bricks = [];
        // current connections
        this.clients = [];

        this._currentBrickId = 0;
    }

    // serialize all data for newly connected clients
    lean() {
        let bricks = [];
        for (let b of this.bricks)
            bricks.push(b.lean());

        return {
            bricks: bricks,
        }
    }

    connectClient(client) {
        console.log("added client");
        this.clients.push(client);
    }

    disconnectClient(client) {
        const idx = this.clients.findIndex((c) => c.id === client.id);
        if (idx < 0)
            return;

        // remove temporary lines
        for (let b of this.bricks)
            b.handleDisconnectClient(b.id);

        // remove element
        this.clients.splice(idx, 1);
        console.log("removed client");
    }

    handleInsertBrick(user, heightIndex) {
        try {
            if (typeof heightIndex !== typeof 1)
                throw new Error("invalid height");
            if (heightIndex < 0 || heightIndex > this.bricks.length)
                throw new Error("height index out of range");

            // generate id
            const brickId = ++this._currentBrickId;

            // create entry
            this.bricks.splice(heightIndex, 0, new Brick(brickId));
            console.log(JSON.stringify(this.bricks));

            // TODO notify other clients
            this.clients.forEach((client) => {
                client.sendInsertedBrick(brickId, heightIndex);
            });
        }
        catch (e) {
            console.log("Error handleInsertBrick: " + e.message);
        }
    }

    handleBeginPath(userId, brickId, strokeStyle) {
        try {
            const idx = this.bricks.findIndex((brick) => brickId === brick.id);
            if (idx < 0)
                throw new Error("brick id invalid");

            this.bricks[idx].handleBeginPath(userId, strokeStyle);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleBeginPath: " + e.message);
        }
    }

    handleAddPathPoints(userId, brickId, points) {
        try {
            const idx = this.bricks.findIndex((brick) => brickId === brick.id);
            if (idx < 0)
                throw new Error("brick id invalid");

            this.bricks[idx].handleAddPathPoints(userId, points);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleAddPathPoints: " + e.message);
        }
    }

    handleEndPath(userId, brickId, spline) {
        try {
            const idx = this.bricks.findIndex((brick) => brickId === brick.id);
            if (idx < 0)
                throw new Error("brick id invalid");

            this.bricks[idx].handleEndPath(userId, spline);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleEndPath: " + e.message);
        }
    }
}


module.exports = Document;