module.exports = {
    server: {
        proxy_host: process.env.NODE_PROXY_HOST,
        proxy_port: process.env.NODE_PROXY_PORT,
        env: process.env.NODE_ENV || 'production',
        host: process.env.NODE_HOSTNAME || 'localhost',
        port: process.env.NODE_PORT || 9000,
        sessionCookieIdName: 'sid',
        dbType: 'lowdb',
        log: {
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        },
        autorep: {
            maxHistoryComments: 200
        }
    },
    database: {
        lowdb: {
            databaseFileName: 'db.json'
        }
    },
    web: {
        env: process.env.NODE_ENV || 'production'
    }
};