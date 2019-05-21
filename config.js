const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    debug: process.env.NODE_DEBUG,
    mongodb: {
        host: process.env.MONGODB_HOST,
        db_name: process.env.MONGODB_DBNAME,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        port: process.env.MONGODB_PORT
    }
};