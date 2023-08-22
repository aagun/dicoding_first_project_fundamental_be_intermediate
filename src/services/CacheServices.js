const redis = require("redis");
const config = require("../utils/config");

class CacheServices {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on("error", (err) => console.error("Redis Client Error", err));

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, { EX: expirationInSecond });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (!result) throw new Error("Cache tidak ditemukan");

    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheServices;
