const { HTTP_STATUS } = require("../utils/CommonConstants");
const ClientException = require("./ClientException");

class AuthenticationException extends ClientException {
  constructor(message) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "AuthenticationException";
  }
}

module.exports = AuthenticationException;
