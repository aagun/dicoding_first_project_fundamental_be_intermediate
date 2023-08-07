const { Pool } = require("pg");
const { generateId } = require("../utils/Utils");
const InvariantException = require("../exceptions/InvariantException");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async save({ playlistId, songId, userId, action }) {
    const id = generateId("playlistSongActivities");
    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, userId, action],
    };
    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new Error("Gagal menyimpan aktivitas");
    }
  }

  async findAll() {
    const query = {
      text: "SELECT * FROM playlist_song_activities",
    };
  }
}

module.exports = PlaylistSongActivitiesService;
