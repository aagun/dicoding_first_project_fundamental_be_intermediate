const ResponseHelper = require("../../utils/ResponseHelper");

class AuthenticationHandler {
  constructor(service, userService, tokenManager, validator) {
    this._service = service;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const { username, password } = request.payload;
    const id = await this._userService.verifyUserCredential(username, password);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    await this._service.save(refreshToken);
    return ResponseHelper.created(h, { accessToken, refreshToken });
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._service.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return ResponseHelper.success(h, { accessToken });
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._service.verifyRefreshToken(refreshToken);
    await this._service.delete(refreshToken);
    return ResponseHelper.ok(h, null, "Refresh token berhasil dihapus");
  }
}

module.exports = AuthenticationHandler;
