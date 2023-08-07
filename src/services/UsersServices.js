const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantException = require("../exceptions/InvariantException");
const AuthenticationException = require("../exceptions/AuthenticationException");
const { generateId } = require("../utils/Utils");
const NotFoundException = require("../exceptions/NotFoundException");

class UsersServices {
  constructor() {
    this._pool = new Pool();
  }

  async save({ username, password, fullname }) {
    const id = generateId("user");
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };
    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0].id;
    }

    throw new InvariantException("User gagal ditambahkan");
  }

  async findById(userId) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };
    const { rows } = await this._pool.query(query);

    if (rows.length) {
      return rows[0];
    }

    throw new NotFoundException("User tidak ditemukan");
  }

  async verifyUserExist(userId) {
    await this.findById(userId);
  }

  async findByUsername(username) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundException("User tidak ditemukan");
    }

    return rows[0];
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const { rows } = await this._pool.query(query);
    if (rows.length) {
      throw new InvariantException(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async verifyUserCredential(username, password) {
    let user;

    try {
      user = await this.findByUsername(username);
    } catch (error) {
      throw new AuthenticationException("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = user;
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      return id;
    }

    throw new AuthenticationException("Kredensial yang Anda berikan salah");
  }
}

module.exports = UsersServices;
