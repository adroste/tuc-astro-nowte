const DrawBrick = require('./DrawBrick');
const TextBrick = require('./TextBrick');
const err = require('./Error');

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
        const idx = this._clients.findIndex((c) => c.uniqueIdentifier === client.uniqueIdentifier);
        if(idx >= 0){
            console.log("ERROR: client tried to connect with the same unique indentifier as another client")
            return;
        }

        this._clients.push(client);
        console.log("added client");
    }

    disconnectClient(client) {
        const idx = this._clients.findIndex((c) => c.uniqueIdentifier === client.uniqueIdentifier);
        if (idx < 0)
            return;

        // TODO remove temporary lines

        // remove element
        this._clients.splice(idx, 1);
        console.log("removed client");
    }

    /**
     * tries to insert a new brick
     * @param user client object
     * @param brickType type of brick to add
     * @param heightIndex insertion height
     * @param columnIndex if undefined => brick is inserted as a new row. if number => brick is inserted into the row at height index at comulm index
     */
    handleInsertBrick(user, brickType, heightIndex, columnIndex) {
        try {
            err.verifyType("brickType", "number", brickType);
            err.verifyRange("brickType", "number", 0, 1);
            err.verifyType("heightIndex", "number", heightIndex);
            err.verifyRange("heightIndex", heightIndex, 0, this._brickLayout.length);

            // generate id
            const brickId = ++this._currentBrickId;

            if(columnIndex !== undefined){
                // insert next to another container
                // TODO add proper exception handling for this
                err.verifyType("columnIndex", "number", columnIndex);

                this._brickLayout[heightIndex].splice(columnIndex, 0, brickId);
            } else {
                // insert at height index
                this._brickLayout.splice(heightIndex, 0, [brickId]);
            }

            // add actual brick object
            if(brickType === 0)
                this._bricks[brickId] = new DrawBrick(brickId);
            else
                this._bricks[brickId] = new TextBrick(brickId);

            this._clients.forEach((client) => {
                // TODO add column index for this
                client.sendInsertedBrick(brickId, brickType, heightIndex);
            });
        }
        catch (e) {
            console.log("Error handleInsertBrick: " + e.message);
        }
    }


    handleBeginPath(user, brickId, strokeStyle) {
        try {
            err.verifyType("brickId", "number", brickId);
            // TODO verify stroke style type

            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleBeginPath(user.uniqueIdentifier, strokeStyle);

            this._clients.forEach((client) => {
                // don't send it to the same user
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendBeginPath(user.id, user.uniqueIdentifier, brickId, strokeStyle);
                }
            });
        }
        catch (e) {
            console.log("Error handleBeginPath: " + e.message);
        }
    }

    handleAddPathPoints(user, brickId, points) {
        try {
            err.verifyType("brickId", "number", brickId);
            // TODO verify points

            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleAddPathPoints(user.uniqueIdentifier, points);

            this._clients.forEach((client) => {
                // don't send it to the same user
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendAddPathPoint(user.uniqueIdentifier, brickId, points);
                }
            });
        }
        catch (e) {
            console.log("Error handleAddPathPoints: " + e.message);
        }
    }

    handleEndPath(user, brickId, spline, id) {
        try {
            err.verifyType("brickId", "number", brickId);
            err.verifyType("id", "string", id);
            // TODO verify spline

            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleEndPath(user.uniqueIdentifier, spline, id);

            this._clients.forEach((client) => {
                // don't send it to the same user
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendEndPath(user.uniqueIdentifier, brickId, spline, id);
                }
            });
        }
        catch (e) {
            console.log("Error handleEndPath: " + e.message);
        }
    }

    handleEraseSplines(user, brickId, ids){
        try {
            err.verifyType("brickId", "number", brickId);
            err.verifyType("ids", "object", ids);

            const brick = this._bricks[brickId];
            if(!brick)
                throw new Error("brick id invalid");

            brick.handleEraseSplines(ids);

            this._clients.forEach((client) => {
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendEraseSplines(brickId, ids);
                }
            });
        }
        catch (e) {
            console.log("Error handleEraseSplines: " + e.message);
        }
    }
}


module.exports = Document;