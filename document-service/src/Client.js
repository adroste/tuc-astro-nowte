/**
 * @author Alexander Droste
 * @date 13.01.18
 */


class Client {
    /**
     * @param {Object} connection socket.io connection
     * @param {Object} document current document
     */
    constructor(connection, document) {
        /**
         * socket.io connection
         * @type {Object|null}
         * @private
         */
        this._connection = connection;
        this._document = document;
        this._id = 0;
        // brick where the client is currently drawing (set in path begin)
        this._currentBrick = null;

        // setup listeners
        if (this._connection === null)
            return;

        this._connection.on('disconnect', () => this.handleDisconnect());
        this._connection.on('echo', (data) => this.handleEcho(data));
        this._connection.on('insertBrick', (data) => this.handleInsertBrick(data));

        // path
        this._connection.on('beginPath', (data) => this.handleBeginPath(data));
        this._connection.on('addPathPoint', (data) => this.handleAddPathPoint(data));
        this._connection.on('endPath', (data) => this.handleEndPath(data));


        this._document.connectClient(this);

        // send information about current document
        this._connection.emit('initialize', document.lean());
    }

    get id(){
        return this._id;
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
        this._document.handleInsertBrick("only user", data.heightIndex);
    }

    handleBeginPath(data) {
        this._currentBrick = data.brickId;

        this._document.handleBeginPath(this._id, data.brickId, this.strokeStyle);
        console.log("begin path");
        console.log(JSON.stringify(data));
    }

    handleAddPathPoint(data) {
        this._document.handleAddPathPoints(this._id, this._currentBrick, data.points);

        console.log("path point");
        console.log(JSON.stringify(data));
    }

    handleEndPath(data) {
        this._document.handleEndPath(this._id, this._currentBrick, data.spline);

        console.log("path end");
        console.log(JSON.stringify(data));

        this._currentBrick = null;
    }


    sendInsertedBrick(brickId, heightIndex) {
        console.log("id: " + brickId);
        this._connection.emit("insertedBrick", {
            brickId: brickId,
            heightIndex: heightIndex,
        });
    }
}


module.exports = Client;