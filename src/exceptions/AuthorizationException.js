const { HTTP_STATUS } = require("../utils/CommonConstants");
const ClientException = require("./ClientException");

class AuthorizationException extends ClientException {
  constructor(message) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = "AuthorizationException";
  }
}

module.exports = AuthorizationException;
