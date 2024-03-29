const DrawBrick = require('./DrawBrick');
const TextBrick = require('./TextBrick');
const Collaboration = require('./Collaboration');
const BrickType = require('./BrickTypesEnum');
const err = require('./Error');

class Document {

    constructor(saveCallback, exitCallback) {
        this.saveCallback = saveCallback;
        this.exitCallback = exitCallback;

        // document layout of bricks [[id1, id2], [id3], ...]
        this._brickLayout = [];
        // dictionary of brick object key=id value=Brick
        this._bricks = {};
        // current connections
        this._clients = [];

        this._currentBrickId = 0;

        // collaboration panel for magic pen and user pointers
        this._collabPanel = new Collaboration();
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
            clients: this._collabPanel.lean(),
        }
    }


    /**
     * returns a javascript object that can be transformed to a json
     * @return {object}
     */
    save() {
        return {
            brickLayout: this._brickLayout,
            bricks: Object.keys(this._bricks).map(brickId => this._bricks[brickId].save()),
            currentBrickId: this._currentBrickId,
            // collaboration does not need to be saved
        };
    }


    /**
     * loads data that was previously saved by save()
     * @param {object} data
     * @return {object} reference to self
     */
    load(data) {
        this._brickLayout = data.brickLayout;
        data.bricks.forEach(brickData => {
            let doc = Document._loadBrick(brickData);
            if(!doc)
                return;
            this._bricks[brickData.id] = doc;
        });
        this._currentBrickId = data.currentBrickId;

        return this;
    }


    static _loadBrick(data) {
        switch (data.type) {
            case BrickType.DRAW:
                return new DrawBrick(data.id).load(data);
            case BrickType.TEXT:
                return new TextBrick(data.id).load(data);
        }
        return null;
    }


    /**
     * @param id brick id
     * @return {object} brick object
     * @throws {Error} if brick was not found
     * @private
     */
    _getBrick(id) {
        const brick = this._bricks[id];
        if(!brick)
            throw new Error("brick id invalid");
        return brick;
    }


    /**
     * @param id id of the brick to be removed
     * @return {boolean} true if removal was successful
     * @private
     */
    _removeBrick(id){
        if(this._bricks[id] === undefined)
            return false;

        delete this._bricks[id];
        // remove from the layout
        let pos = this._findBrickPosition(id);
        if(pos.heightIndex !== -1 && pos.columnIndex !== -1){
            if(this._brickLayout[pos.heightIndex].length === 1){
                // remove entire row
                this._brickLayout = this._brickLayout.splice(pos.heightIndex, 1);
            } else {
                // remove column
                this._brickLayout[pos.heightIndex] =
                    this._brickLayout[pos.heightIndex].splice(pos.columnIndex, 1);
            }
        }
        return true;
    }


    /**
     * @param brickId
     * @return {{heightIndex: number, columnIndex: number}}
     * @private
     */
    _findBrickPosition(brickId) {
        let columnIndex = -1;
        let heightIndex = this._brickLayout.findIndex((row) => {
            return (columnIndex = row.findIndex((id) => {
                return id === brickId;
            })) !== -1;
        });
        return {heightIndex, columnIndex};
    }


    connectClient(client) {
        const idx = this._clients.findIndex((c) => c.uniqueIdentifier === client.uniqueIdentifier);
        if(idx >= 0){
            console.log("ERROR: client tried to connect with the same unique identifier as another client")
            return;
        }


        const userColor = this._collabPanel.registerUser(client.uniqueIdentifier, client.id, client.name);

        // send information about current document
        client.sendInitialization(Object.assign(this.lean(), {
            // color information etc.
            color: userColor,
        }));

        const clientInfo = this._collabPanel.getUserInfo(client.uniqueIdentifier);
        this._clients.forEach((other) => {
            // inform other clients about new connection
            other.sendClientConnected(client.uniqueIdentifier, clientInfo.id, clientInfo.name, clientInfo.color);
        });

        this._clients.push(client);
        console.log("added client: " + client.id);
    }


    disconnectClient(client) {
        const idx = this._clients.findIndex((c) => c.uniqueIdentifier === client.uniqueIdentifier);
        if (idx < 0)
            return;

        // TODO remove temporary lines

        // remove element
        this._clients.splice(idx, 1);
        this._collabPanel.unregisterUser(client.uniqueIdentifier);

        this._clients.forEach((other) => {
            other.sendClientDisconnected(client.uniqueIdentifier);
        });

        console.log("removed client: " + client.id);

        // if last client disconnected, exit gracefully
        if (this._clients.length === 0) {
            if (this.saveCallback)
                this.saveCallback();
            // TODO call exit after specific timeout
            if (this.exitCallback)
                this.exitCallback();
        }
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


    handleRemoveBrick(user, brickId) {
        try {
            err.verifyType("brickId", "number", brickId);
            if (this._removeBrick(brickId))
                throw new Error("could not remove brick with id " + brickId);

            this._clients.forEach((client) => {
                client.sendRemovedBrick(brickId);
            });
        }
        catch (e) {
            console.log("Error handleRemoveBrick: " + e.message);
        }
    }


    handleMoveBrick(user, brickId, heightIndex, columnIndex) {
        try {
            err.verifyType("brickId", "number", brickId);
            err.verifyType("heightIndex", "number", dstHeightIndex);

            let dstHeightIndex = heightIndex;
            let dstColumnIndex = columnIndex;

            // find the current location of the brick
            let srcColumnIndex = -1;
            let srcHeightIndex = this._brickLayout.findIndex((row) => {
                return (srcColumnIndex = row.findIndex((id) => {
                     return id === brickId;
                })) !== -1;
            });
            if(srcHeightIndex === -1)
                throw new Error("could not find brick with id " + brickId);

            // make sure the change does something
            if(srcHeightIndex === dstHeightIndex){
                if(dstColumnIndex === undefined && this._brickLayout[srcHeightIndex].length === 1
                || dstColumnIndex === srcColumnIndex)
                    throw new Error("brick would be moved to his current location");
            }

            // create a deep copy
            let newLayout = JSON.parse(JSON.stringify(this._brickLayout));

            // insert
            if(dstColumnIndex !== undefined){
                err.verifyRange("heightIndex", dstHeightIndex, 0, this._brickLayout.length);
                err.verifyType("columnIndex", "number", dstColumnIndex);
                err.verifyRange("columnIndex", dstColumnIndex, 0, 1);
                // TODO implement
            } else {
                // move into a new row

                // delete old occurence
                if(newLayout[srcHeightIndex].length > 1){
                    // remove column (number of rows will increase by 1 after insertion)
                    err.verifyRange("heightIndex", dstHeightIndex, 0, newLayout.length);

                    newLayout[srcHeightIndex] =
                        newLayout[srcHeightIndex].splice(srcColumnIndex, 1);

                } else {
                    // remove entire row (number of rows remains unchanged after insertion)
                    err.verifyRange("heightIndex", dstHeightIndex, 0, newLayout.length - 1);

                    newLayout = newLayout[srcHeightIndex].splice(srcHeightIndex, 1);
                    if(dstHeightIndex > srcHeightIndex)
                        dstHeightIndex--; // adjust height index
                }

                // insert at dstHeightIndex as new row
                newLayout = newLayout.splice(dstHeightIndex, 0, [brickId]);
            }

            this._brickLayout = newLayout;
            this._clients.forEach((client) => {
                client.sendMovedBrick(brickId, heightIndex, columnIndex);
            });
        }
        catch (e) {
            console.log("Error handleMoveBrick: " + e.message);
        }
    }

    handleBeginPath(user, brickId, strokeStyle) {
        try {
            err.verifyType("brickId", "number", brickId);
            // TODO verify stroke style type

            const brick = this._getBrick(brickId);
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

            const brick = this._getBrick(brickId);
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

            const brick = this._getBrick(brickId);

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

            const brick = this._getBrick(brickId);

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

    handleTextInsert(user, brickId, changes) {
        try {
            err.verifyType("brickId", "number", brickId);
            err.verifyType("changes", "object", changes);

            const brick = this._getBrick(brickId);
            brick.handleTextInsert(changes);

            this._clients.forEach((client) => {
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendTextInserted(brickId, changes);
                }
            });
        }
        catch (e) {
            console.log("Error handleTextInsert: " + e.message);
        }
    }

    handleMagicPenBegin(user) {
        try {
            this._clients.forEach((client) => {
                 if(user.uniqueIdentifier !== client.uniqueIdentifier){
                     client.sendMagicPenBegin(user.uniqueIdentifier);
                 }
            });
        }
        catch (e) {
            console.log("Error handleMagicPenBegin: " + e.message);
        }
    }

    handleMagicPenPoints(user, points) {
        try {
            err.verifyArray("points", points, (value) => err.verifyPoint("point in points", value));

            this._clients.forEach((client) => {
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendMagicPoints(user.uniqueIdentifier, points);
                }
            });
        }
        catch (e) {
            console.log("Error handleMagicPenPoints: " + e.message);
        }
    }

    handleMagicPenEnd(user) {
        try {
            this._clients.forEach((client) => {
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendEndMagic(user.uniqueIdentifier);
                }
            });
        }
        catch (e) {
            console.log("Error handleMagicPenEnd: " + e.message);
        }
    }

    handleClientPointer(user, point) {
        try {
            err.verifyPoint("point", point);

            this._collabPanel.handleUserPointer(user.uniqueIdentifier, point);
            this._clients.forEach((client) => {
                if(user.uniqueIdentifier !== client.uniqueIdentifier){
                    client.sendClientPointer(user.uniqueIdentifier, point);
                }
            });
        }
        catch (e) {
            console.log("Error handleClientPointer: " + e.message);
        }
    }
}


module.exports = Document;