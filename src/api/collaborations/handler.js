const ResponseHelper = require("../../utils/ResponseHelper");

class CollaborationsHandler {
  constructor(service, validator, playlistsService, userService) {
    this._service = service;
    this._validator = validator;
    this._playlistsServices = playlistsService;
    this._usersService = userService;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsServices.verifyPlaylistOwner(playlistId, owner);
    await this._usersService.verifyUserExist(userId);
    const collaborationId = await this._service.save(playlistId, userId);

    return ResponseHelper.created(
      h,
      { collaborationId },
      "Kolaborasi berhasil ditambahkan"
    );
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsServices.verifyPlaylistOwner(playlistId, owner);
    await this._service.deleteByPlaylistIdAndUserId(playlistId, userId);

    return ResponseHelper.modified(h, "Kolaborasi berhasil dihapus");
  }
}

module.exports = CollaborationsHandler;
