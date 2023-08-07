const { Pool } = require("pg");
const { generateId } = require("../utils/Utils");

class ActivitiesServices {
  constructor() {
    this._pool = new Pool();
  }

  async save({userId, playlistId, songId, action}) {
    const id = generateId('activity');
    const query = {
      text: 'INSERT INTO playlist_song_activities(id, playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };

    const {rows} = await this._pool.query(query);

    if (!rows[0].id) {
      throw new Error('Activity gagal ditambahkan');
    }
  }

  async findAll(playlistId, userId) {
    const query = {
      text: ` SELECT 
                activities.id, 
                users.username, 
                songs.title, 
                activities.action, 
                activities.time 
              FROM playlist_song_activities activities
                LEFT JOIN playlists ON playlists.id = activities.playlist_id
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                LEFT JOIN songs ON songs.id = activities.song_id
                LEFT JOIN users ON users.id = activities.user_id
              WHERE playlists.id = $1 AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
      values: [playlistId, userId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }
}

module.exports = ActivitiesServices;