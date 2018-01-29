/**
 * @author Alexander Droste
 * @date 13.01.18
 */

const httpServer = require('http').createServer();
const socket = require('socket.io')(httpServer);
const Client = require('./Client');
const DocumentsManager = require('./DocumentsManager');

const port = Number.parseInt(process.argv[2]);
if (isNaN(port) || port < 1024 || port > 49151) {

    throw new Error('first argument should be port number in range 1024-49151');

}


// TODO service identifier

const documentsManager = new DocumentsManager();

socket.on('connection', (clientConnection) => {
    let client = new Client(clientConnection, documentsManager);
});


httpServer.listen(port, () => {
    console.log('http server listening on:', port);
});