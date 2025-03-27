import redis from 'redis';

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

await client.connect();

export default client;
