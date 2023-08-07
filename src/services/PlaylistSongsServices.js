const { Pool } = require("pg");
const InvariantException = require("../exceptions/InvariantException");
const { generateId } = require("../utils/Utils");

class PlaylistSongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async save(playlistId, songId) {
    const id = generateId("playlist_songs");
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const { rows } = await this._pool.query(query);
    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Lagu gagal ditambahkan ke playlist");
  }

  async deleteByPlaylistIdAndSongId(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Lagu gagal dihapus dari playlist");
  }

  async findByPlaylistIdAndSongId(playlistId, songId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }
}

module.exports = PlaylistSongsServices;
