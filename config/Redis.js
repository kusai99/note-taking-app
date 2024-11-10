const redis = require("redis");

class RedisInstance {
  constructor() {
    if (!RedisInstance.instance) {
      console.log(
        "Connecting to Redis at",
        process.env.REDIS_HOST,
        process.env.REDIS_PORT
      );

      this.connectWithRetry();

      RedisInstance.instance = this;
    }

    return RedisInstance.instance;
  }

  /* retry logic for the application server's connection attempt to the Redis server.
  socket property was required since the application server and the redis server run on 2 separate Docker containers */
  connectWithRetry(retries = 5, delay = 5000) {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || "redis",
        port: process.env.REDIS_PORT || 6379,
      },
    });
    this.client.on("connect", () => {
      console.log("Connected to Redis...");
    });

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);

      if (retries > 0) {
        console.log(`Retrying connection, (${retries} attempts left)...`);
        setTimeout(() => {
          this.connectWithRetry(retries - 1, delay);
        }, delay);
      } else {
        console.error("Failed to connect to Redis after multiple attempts.");
      }
    });
  }

  static getInstance() {
    if (!RedisInstance.instance) {
      RedisInstance.instance = new RedisInstance();
    }
    return RedisInstance.instance.client;
  }
}

module.exports = RedisInstance.getInstance();
