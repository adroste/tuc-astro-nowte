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
    }


    isConnected() {
        return this._connection !== null;
    };


    // handlers
    handleDisconnect() {
        console.log('client disconnected');
        this._connection = null;
    }


    handleEcho(data) {
        console.log('received echo');
        this._connection.emit('echo', data);
    }

    handleInsertBrick(data) {
        this._document.handleInsertBrick("only user", data.heightIndex, data.id);
    }

    handleBeginPath(data) {
        console.log("begin path");
        console.log(JSON.stringify(data));
    }

    handleAddPathPoint(data) {
        console.log("path point");
        console.log(JSON.stringify(data));
    }

    handleEndPath(data) {
        console.log("path end");
        console.log(JSON.stringify(data));
    }
}


module.exports = Client;