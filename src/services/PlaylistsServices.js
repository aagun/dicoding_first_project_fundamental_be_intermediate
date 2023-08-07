const { Pool } = require("pg");
const { generateId } = require("../utils/Utils");
const InvariantException = require("../exceptions/InvariantException");
const NotFoundException = require("../exceptions/NotFoundException");
const AuthorizationException = require("../exceptions/AuthorizationException");

class PlaylistsServices {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async save({ owner, name }) {
    const id = generateId("playlist");
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Playlist gagal ditambahkan");
  }

  async deleteById(playlistId) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("Playlist gagal dihapus");
  }

  async findByOwner(owner) {
    const query = {
      text: ` SELECT playlists.id, playlists.name, users.username
              FROM playlists 
              LEFT JOIN users ON users.id = playlists.owner
              LEFT JOIN collaborations colab ON colab.playlist_id = playlists.id 
              WHERE playlists.owner = $1 OR colab.user_id = $1`,
      values: [owner],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = {
      text: ` SELECT *
              FROM playlists 
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) {
      throw new NotFoundException("Playlist tidak ditemukan");
    }

    return rows[0];
  }

  async findByIdAndOwner(id, owner) {
    const query = {
      text: ` SELECT 
                playlists.id, 
                playlists.name, 
                users.username 
              FROM playlists 
                LEFT JOIN collaborations colab ON colab.playlist_id = playlists.id
                LEFT JOIN users ON users.id = playlists.owner 
              WHERE 
                (playlists.id = $1 AND playlists.owner = $2) OR 
                (colab.playlist_id = $1 AND colab.user_id = $2)`,
      values: [id, owner],
    };

    const { rows } = await this._pool.query(query);
    if (rows.length) {
      return rows[0];
    }

    throw new NotFoundException("Playlist tidak ditemukan");
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const playlist = await this.findById(playlistId);
    if (playlist.owner !== owner) {
      throw new AuthorizationException(
        "Anda tidak berhak mengakses resource ini"
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsServices;
