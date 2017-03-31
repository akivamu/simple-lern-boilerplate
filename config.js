module.exports = {
    server: {
        env: process.env.NODE_ENV || 'development',
        host: process.env.NODE_HOSTNAME || 'localhost',
        port: process.env.NODE_PORT || 9000,
        sessionCookieIdName: 'sid',
        databaseFileName: 'db.json'
    }
};