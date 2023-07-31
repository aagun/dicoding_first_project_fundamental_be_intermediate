const { Pool } = require("pg");
const InvariantException = require("../exceptions/InvariantException");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async save(refreshToken) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async delete(refreshToken) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: "SELECT * FROM authentications WHERE token = $1",
      values: [refreshToken],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantException("Refresh token tidak valid");
    }
  }
}

module.exports = AuthenticationsService;
