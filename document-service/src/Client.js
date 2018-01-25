/**
 * @author Alexander Droste
 * @date 13.01.18
 */
const err = require('./Error');

let pseudoSessionToken = 1;

class Client {
    /**
     * @param {Object} connection socket.io connection
     * @param {Object} document current document
     */
    constructor(connection, document) {
        if (this._connection === null)
            return;

        /**
         * socket.io connection
         * @type {Object|null}
         * @private
         */
        this._connection = connection;
        this._document = document;
        this._id = null;
        this._name = null;
        this._sessionToken = null;

        // brick where the client is currently drawing (set in path begin)
        this._currentBrick = null;

        // setup listeners

        this._connection.on('authentication', (data) => this.handleAuthentication(data));
        this._connection.on('disconnect', () => this.handleDisconnect());
        this._connection.on('echo', (data) => this.handleEcho(data));

        // brick
        this._connection.on('insertBrick',      (data) => this.verifiedHandle(() => this.handleInsertBrick(data)));
        this._connection.on('removeBrick',      (data) => this.verifiedHandle(() => this.handleRemoveBrick(data)));
        this._connection.on('moveBrick',        (data) => this.verifiedHandle(() => this.handleMoveBrick(data)));

        // path
        this._connection.on('beginPath',        (data) => this.verifiedHandle(() => this.handleBeginPath(data)));
        this._connection.on('addPathPoint',     (data) => this.verifiedHandle(() => this.handleAddPathPoint(data)));
        this._connection.on('endPath',          (data) => this.verifiedHandle(() => this.handleEndPath(data)));
        this._connection.on('eraseSplines',     (data) => this.verifiedHandle(() => this.handleEraseSplines(data)));

        // text
        this._connection.on('textInsert',       (data) => this.verifiedHandle(() => this.handleTextInsert(data)));

        // collaboration
        this._connection.on('beginMagic',       (data) => this.verifiedHandle(() => this.handleMagicPenBegin(data)));
        this._connection.on('addMagicPoint',    (data) => this.verifiedHandle(() => this.handleMagicPenPoints(data)));
        this._connection.on('endMagic',         (data) => this.verifiedHandle(() => this.handleMagicPenEnd(data)));
        this._connection.on('clientPointer',    (data) => this.verifiedHandle(() => this.handlePointer(data)));
    }

    /**
     * calls the callback if isVerified() returns true
     * @param callback function
     */
    verifiedHandle(callback) {
        if(this.isVerified())
            callback();
    }

    /**
     * @return {boolean} true if the user has sent his sessionToken
     */
    isVerified() {
        return this._id !== null;
    }

    /**
     * user id
     * @return {null|string}
     */
    get id(){
        return this._id;
    }

    /**
     * username
     * @return {null|string}
     */
    get name(){
        return this._name;
    }

    /**
     * unique indetifier that should be used for hasing etc. (probably session token)
     * @return {null|string}
     */
    get uniqueIdentifier() {
        return this._sessionToken.toString();
    }

    isConnected() {
        return this._connection !== null;
    };


    // handlers
    handleDisconnect() {
        if(this._connection){
            this._connection = null;
            this._document.disconnectClient(this);
        }
    }


    handleEcho(data) {
        console.log('received echo');
        this._connection.emit('echo', data);
    }


    handleInsertBrick(data) {
        this._document.handleInsertBrick(this, data.brickType, data.heightIndex);
    }


    sendInsertedBrick(brickId, brickType, heightIndex) {
        this._connection.emit("insertedBrick", {
            brickId: brickId,
            brickType: brickType,
            heightIndex: heightIndex,
        });
    }

    handleRemoveBrick(data) {
        this._document.handleRemoveBrick(this, data.brickId);
    }

    sendRemovedBrick(brickId) {
        this._connection.emit("removedBrick", {
            brickId
        });
    }

    handleMoveBrick(data) {
        this._document.handleMoveBrick(this, data.brickId, data.heightIndex, data.columnIndex);
    }

    sendMovedBrick(brickId, heightIndex, columnIndex) {
        this._connection.emit("movedBrick", {
            brickId,
            heightIndex,
            columnIndex,
        });
    }

    handleBeginPath(data) {
        this._currentBrick = data.brickId;
        this._document.handleBeginPath(this, data.brickId, data.strokeStyle);
    }

    sendBeginPath(userId, userUniqueId, brickId, strokeStyle) {
        this._connection.emit('beginPath', {
            userId: userId,
            userUniqueId: userUniqueId,
            brickId: brickId,
            strokeStyle: strokeStyle,
        });
    }

    handleAddPathPoint(data) {
        this._document.handleAddPathPoints(this, this._currentBrick, data.points);
    }

    sendAddPathPoint(userUniqueId, brickId, points) {
        this._connection.emit('addPathPoint', {
            userUniqueId: userUniqueId,
            brickId: brickId,
            points: points,
        });
    }

    handleEndPath(data) {
        this._document.handleEndPath(this, this._currentBrick, data.spline, data.id);

        this._currentBrick = null;
    }

    sendEndPath(userUniqueId, brickId, spline, id) {
        this._connection.emit('endPath', {
            userUniqueId: userUniqueId,
            brickId: brickId,
            spline: spline,
            id: id,
        });
    }

    handleEraseSplines(data) {
        this._document.handleEraseSplines(this, data.brickId, data.ids);
    }

    sendEraseSplines(brickId, ids) {
        this._connection.emit('eraseSplines', {
            brickId: brickId,
            ids: ids,
        });
    }

    handleTextInsert(data) {
        this._document.handleTextInsert(this, data.brickId, data.changes);
    }

    sendTextInserted(brickId, changes) {
        this._connection.emit('textInserted', {
            brickId: brickId,
            changes: changes,
        });
    }

    handleMagicPenBegin(data) {
        this._document.handleMagicPenBegin(this);
    }

    sendMagicPenBegin(userUniqueId) {
        this._connection.emit('beginMagic', {
             userUniqueId,
        });
    }

    handleMagicPenPoints(data) {
        this._document.handleMagicPenPoints(this, data.points);
    }

    sendMagicPoints(userUniqueId, points){
        this._connection.emit('addMagicPoints', {
            userUniqueId,
            points,
        });
    }

    handleMagicPenEnd(data) {
        this._document.handleMagicPenEnd(this);
    }

    sendEndMagic(userUniqueId) {
        this._connection.emit('endMagic', {
            userUniqueId,
        });
    }

    handlePointer(data) {
        this._document.handleClientPointer(this, data.point);
    }

    sendClientPointer(userUniqueId, point) {
        this._connection.emit('clientPointer', {
            userUniqueId,
            point,
        });
    }

    handleAuthentication(data) {
        try {
            err.verifyType("id", "string", data.userId);
            this._id = data.userId;

            err.verifyType("name", "string", data.name);
            this._name = data.name;
        }
        catch (e) {
            console.log("Error (client) handleAuthentication: " + e.message);
            return;
        }

        // TODO replace with session token
        this._sessionToken = ++pseudoSessionToken;

        // establish connection
        this._document.connectClient(this);
    }

    sendInitialization(data) {
        this._connection.emit('initialize', data);
    }

    sendClientConnected(userUniqueId, id, name, color) {
        this._connection.emit('clientConnect', {
            userUniqueId,
            id,
            name,
            color,
        });
    }

    sendClientDisconnected(userUniqueId) {
        this._connection.emit('clientDisconnect', {
            userUniqueId,
        });
    }
}


module.exports = Client;