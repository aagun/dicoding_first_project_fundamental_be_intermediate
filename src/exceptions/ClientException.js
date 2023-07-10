const { HTTP_STATUS } = require("../utils/CommonConstants");

class ClientException extends Error {
  constructor(message, statusCode = HTTP_STATUS.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

module.exports = ClientException;
