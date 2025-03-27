const redis = require('redis');

const client = new redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

client.on('connect', () => {
    console.log('Connected to Redis');
})

module.exports = client;
