const { Pool } = require("pg");
const InvariantException = require("../exceptions/InvariantException");
const { generateId } = require("../utils/Utils");

class CollaborationsServices {
  constructor() {
    this._pool = new Pool();
  }

  async save(playlistId, userId) {
    const id = generateId("collaboration");
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Kolaborasi gagal ditambahkan");
  }

  async deleteByPlaylistIdAndUserId(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Kolaborasi gagal dihapus");
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const { rows } = await this._pool.query(query);
    if (rows.length) {
      return rows[0];
    }

    throw new InvariantException("Kolaborasi gagal diverifikasi");
  }
}

module.exports = CollaborationsServices;
