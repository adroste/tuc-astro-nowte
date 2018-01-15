/**
 * @author Alexander Droste
 * @date 13.01.18
 */

const httpServer = require('http').createServer();
const socket = require('socket.io')(httpServer);
const Client = require('./Client');
const Document = require('./Document');

const port = Number.parseInt(process.argv[2]);
if (isNaN(port) || port < 1024 || port > 49151) {

    throw new Error('first argument should be port number in range 1024-49151');

}

// initialize document
const document = new Document();

socket.on('connection', (clientConnection) => {
    console.log("client connected");

    let client = new Client(clientConnection, document);
});


httpServer.listen(port, () => {
    console.log('http server listening on:', port);
});