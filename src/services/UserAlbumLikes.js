const { Pool } = require("pg");
const InvariantException = require("../exceptions/InvariantException");
const ResponseHelper = require("../utils/ResponseHelper");
const { generateId } = require("../utils/Utils");

class UserAlbumLikes {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async save(userId, albumId) {
    const id = generateId("user_album_like");
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    try {
      const { rows } = await this._pool.query(query);
      this._cacheService.delete(`likes:${albumId}`);
      return rows[0].id;
    } catch (error) {
      throw new InvariantException("Gagal like album");
    }
  }

  async findByAlbumId(albumId) {
    let likes = 0;
    try {
      likes = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: Number(JSON.parse(likes)),
        isCached: true,
      };
    } catch (error) {}
    const query = {
      text: "SELECT COUNT(album_id) as likes FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);
    likes = Number(rows[0].likes);
    await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes));
    return {
      likes,
      isCached: false,
    };
  }

  async deleteByUserIdAndAlbumId(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      this._cacheService.delete(`likes:${albumId}`);
      return rows[0].id;
    }

    throw new InvariantException("Gagal unlike album");
  }
}

module.exports = UserAlbumLikes;
