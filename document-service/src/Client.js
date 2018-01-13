/**
 * @author Alexander Droste
 * @date 13.01.18
 */


class Client {
    /**
     * @param {Object} connection socket.io connection
     */
    constructor(connection) {
        /**
         * socket.io connection
         * @type {Object|null}
         * @private
         */
        this._connection = connection;


        // setup listeners
        if (this._connection === null)
            return;

        this._connection.on('disconnect', () => this.handleDisconnect());
        this._connection.on('echo', (data) => this.handleEcho(data));
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

}


module.exports = Client;