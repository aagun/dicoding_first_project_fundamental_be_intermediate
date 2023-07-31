const ResponseHelper = require("../../utils/ResponseHelper");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    await this._service.verifyNewUsername(username);
    const userId = await this._service.save({ username, password, fullname });
    return ResponseHelper.created(h, { userId }, "User berhasil ditambahkan");
  }
}

module.exports = UsersHandler;
