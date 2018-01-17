/**
 * @author Alexander Droste
 * @date 13.01.18
 */

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
        this._sessionToken = null;

        // brick where the client is currently drawing (set in path begin)
        this._currentBrick = null;

        // setup listeners

        this._connection.on('authentication', (data) => this.handleAuthentication(data));
        this._connection.on('disconnect', () => this.handleDisconnect());
        this._connection.on('echo', (data) => this.handleEcho(data));

        this._connection.on('insertBrick',      (data) => this.verifiedHandle(() => this.handleInsertBrick(data)));

        // path
        this._connection.on('beginPath',        (data) => this.verifiedHandle(() => this.handleBeginPath(data)));
        this._connection.on('addPathPoint',     (data) => this.verifiedHandle(() => this.handleAddPathPoint(data)));
        this._connection.on('endPath',          (data) => this.verifiedHandle(() => this.handleEndPath(data)));
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
     * @return {null|*}
     */
    get id(){
        return this._id;
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
        this._connection.emit("insertedBrick", {
            brickId: brickId,
            heightIndex: heightIndex,
        });
    }

    handleAuthentication(data) {
        this._id = data.userId;
        if(!this._id)
            return; // invalid id

        // TODO replace with session token
        this._sessionToken = ++pseudoSessionToken;

        // establish connection
        this._document.connectClient(this);

        // send information about current document
        this._connection.emit('initialize', this._document.lean());
    }
}


module.exports = Client;