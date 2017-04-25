module.exports = {
    server: {
        env: process.env.NODE_ENV || 'production',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8080,
        sessionCookieIdName: 'sid',
        dbType: process.env.DB_TYPE || 'lowdb',
        serveWeb: process.env.SERVE_WEB || 'false',
        log: {
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        }
    },
    database: {
        lowdb: {
            databaseFileName: 'db.json'
        }
    },
    web: {
        env: process.env.NODE_ENV || 'production',
        apiUrl: process.env.SERVE_WEB === 'true' ? '/rest' : process.env.REMOTE_API_URL || '/rest'
    }
};