const { HTTP_STATUS } = require("../utils/CommonConstants");
const ClientException = require("./ClientException");

class NotFoundException extends ClientException {
  constructor(message) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundException;
