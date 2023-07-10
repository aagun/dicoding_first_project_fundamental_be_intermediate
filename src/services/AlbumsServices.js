const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantException = require("../exceptions/InvariantException");
const NotFoundException = require("../exceptions/NotFoundException");
const { generateId } = require("../utils/Utils");

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async save({ name, year }, createdBy = "Developer") {
    const id = generateId("album");

    const query = {
      text: "INSERT INTO albums(id, name, year, created_by, created_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id",
      values: [id, name, year, createdBy],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Album gagal ditambahkan");
  }

  async findAll() {
    const query = "SELECT * FROM albums";
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0];
    }

    throw new NotFoundException("Album tidak ditemukan");
  }

  async findByIdAndWithSongs(id) {
    try {
      const query = {
        text: `SELECT 
                albums.id as id,
                albums.name as name, 
                albums.year as year,
                songs.id as song_id,
                songs.title as song_title,
                songs.performer as song_performer
              FROM 
                albums LEFT JOIN songs ON songs.id_album = albums.id
              WHERE albums.id = $1`,
        values: [id],
      };
      const { rows } = await this._pool.query(query);
      console.log({ rows });
      let albumSongs = {
        id: "",
        name: "",
        year: null,
        songs: [],
      };

      rows.forEach((album, index) => {
        console.log({ index, album });
        if (rows.length - 1 == index) {
          albumSongs.id = album.id;
          albumSongs.name = album.name;
          albumSongs.year = album.year;
        }

        if (!album.song_id) {
          return;
        }

        albumSongs.songs.push({
          id: album.song_id,
          title: album.song_title,
          performer: album.song_performer,
        });
      });

      console.log({ albumSongs });
      return albumSongs;
    } catch (error) {
      throw new NotFoundException("Data album tidak ditemukan");
    }
  }

  async updateById({ id, name, year }, updatedBy = "Developer") {
    const { id: _id } = await this.findById(id);
    const query = {
      text: `UPDATE albums 
              SET 
                name = $1, 
                year = $2, 
                updated_by = $3, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id`,
      values: [name, year, updatedBy, _id],
    };
    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0];
    }

    throw new InvariantException("Album gagal diperbaharui");
  }

  async deleteById(id) {
    const { id: _id } = await this.findById(id);
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [_id],
    };
    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Album gagal dihapus");
  }
}

module.exports = AlbumsServices;
