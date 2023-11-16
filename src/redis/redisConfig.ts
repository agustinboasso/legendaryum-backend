import Redis from 'ioredis';


const redisConfig = {
  host: 'localhost', 
  port: 6379, 
  password: '', 
};


export const redisClient = new Redis(redisConfig);


redisClient.on('error', (err) => {
  console.error(`Error de conexión a Redis: ${err}`);
});


export default redisConfig;