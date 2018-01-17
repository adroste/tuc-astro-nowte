const Brick = require('./Brick');

class Document {

    constructor() {
        // document layout of bricks [[id1, id2], [id3], ...]
        this._brickLayout = [];
        // dictionary of brick object key=id value=Brick
        this._bricks = {};
        // current connections
        this._clients = [];

        this._currentBrickId = 0;
    }

    // serialize all data for newly connected clients
    lean() {
        let bricks = [];
        for (let row of this._brickLayout){
            const curRow = [];
            for(let brickId of row) {
                curRow.push(this._bricks[brickId].lean());
            }
            bricks.push(curRow);
        }

        return {
            bricks: bricks,
        }
    }

    connectClient(client) {
        console.log("added client");
        this._clients.push(client);
    }

    disconnectClient(client) {
        const idx = this._clients.findIndex((c) => c.id === client.id);
        if (idx < 0)
            return;

        // TODO remove temporary lines

        // remove element
        this._clients.splice(idx, 1);
        console.log("removed client");
    }

    /**
     * tries to insert a new brick
     * @param user
     * @param heightIndex insertion height
     * @param columnIndex if undefined => brick is inserted as a new row. if number => brick is inserted into the row at height index at comulm index
     */
    handleInsertBrick(user, heightIndex, columnIndex) {
        try {
            if (typeof heightIndex !== typeof 1)
                throw new Error("invalid height type");
            if (heightIndex < 0 || heightIndex > this._brickLayout.length)
                throw new Error("height index out of range");

            // generate id
            const brickId = ++this._currentBrickId;

            if(columnIndex !== undefined){
                // insert next to another container
                // TODO add proper exception handling for this
                if(typeof columnIndex !== typeof 1)
                    throw new Error("invalid column index type");

                this._brickLayout[heightIndex].splice(columnIndex, 0, brickId);
            } else {
                // insert at height index
                this._brickLayout.splice(heightIndex, 0, [brickId]);
            }

            // add actual brick object
            this._bricks[brickId] = new Brick(brickId);

            this._clients.forEach((client) => {
                // TODO add column index for this
                client.sendInsertedBrick(brickId, heightIndex);
            });
        }
        catch (e) {
            console.log("Error handleInsertBrick: " + e.message);
        }
    }

    handleBeginPath(userId, brickId, strokeStyle) {
        try {
            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleBeginPath(userId, strokeStyle);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleBeginPath: " + e.message);
        }
    }

    handleAddPathPoints(userId, brickId, points) {
        try {
            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleAddPathPoints(userId, points);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleAddPathPoints: " + e.message);
        }
    }

    handleEndPath(userId, brickId, spline) {
        try {
            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleEndPath(userId, spline);

            // TODO notify other clients
        }
        catch (e) {
            console.log("Error handleEndPath: " + e.message);
        }
    }
}


module.exports = Document;