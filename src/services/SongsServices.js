const { Pool } = require("pg");
const { generateId } = require("../utils/Utils");
const InvariantException = require("../exceptions/InvariantException");
const NotFoundException = require("../exceptions/NotFoundException");
const AlbumsServices = require("./AlbumsServices");
const { SongViewObject, SongsViewObject } = require("../utils/ViewObject");

class SongsServices {
  constructor() {
    this._pool = new Pool();
    this._albumService = new AlbumsServices();
  }

  async save(
    { title, year, genre, performer, duration, albumId },
    createdBy = "Developer"
  ) {
    const id = generateId("song");
    const query = {
      text: `INSERT INTO songs(id, title, year, genre, performer, duration, id_album, created_by, created_at)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
            RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId, createdBy],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Song gagal ditambahkan");
  }

  async findAll({ title = "", performer = "" }) {
    const query = {
      text: "SELECT * FROM songs WHERE LOWER(title) LIKE LOWER('%'||$1||'%') AND LOWER(performer) LIKE LOWER('%'||$2||'%')",
      values: [title, performer],
    };

    let { rows } = await this._pool.query(query);

    if (!rows.length) {
      return rows;
    }

    return (rows = rows.map((song) => SongsViewObject(song)));
  }

  async findByAlbumId(albumId) {
    const query = {
      text: "SELECT * FROM songs WHERE id_album = $1",
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      rows.map((song) => SongViewObject(song))[0];
    }

    return rows;
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows.map((song) => SongViewObject(song))[0];
    }

    throw new NotFoundException("Song tidak ditemukan");
  }

  async findByOwnerOrUserId(owner) {
    const query = {
      text: ` SELECT 
                songs.id,
                songs.title,
                songs.performer 
              FROM songs
              LEFT JOIN playlist_songs ps ON ps.song_id = songs.id
              LEFT JOIN playlists p ON p.id = ps.playlist_id
              LEFT JOIN collaborations c ON c.playlist_id = p.id
              WHERE p.owner = $1 OR c.user_id = $1`,
      values: [owner],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }

  async updateById(
    { id, title, year, genre, performer, duration = null, albumId = null },
    updatedBy = "Developer"
  ) {
    await this.findById(id);
    if (albumId) {
      await this._albumService.findById(albumId);
    }

    const query = {
      text: `UPDATE songs 
              SET 
                title = $1, 
                year = $2, 
                genre = $3, 
                performer = $4, 
                duration = $5,
                updated_by = $6,
                updated_at = CURRENT_TIMESTAMP,
                id_album = $7
            WHERE id = $8
            RETURNING id `,
      values: [title, year, genre, performer, duration, updatedBy, albumId, id],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Song gagal diubah");
  }

  async deleteById(id) {
    const { id: _id } = await this.findById(id);
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [_id],
    };
    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Song gagal dihapus");
  }
}

module.exports = SongsServices;
