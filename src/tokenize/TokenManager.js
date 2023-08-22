const InvariantException = require("../exceptions/InvariantException");
const config = require("../utils/config");
const Jwt = require("@hapi/jwt");

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.tokenManager.accessTokenKey),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.tokenManager.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.tokenManager.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantException("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
