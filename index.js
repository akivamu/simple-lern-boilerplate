const config = require('./config');
const Server = require('./server');

const server = new Server(config.server);
server.start();