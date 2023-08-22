const ResponseHelper = require("../../utils/ResponseHelper");

class ExportHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this.playlistsService = playlistsService;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);

    this._service.sendMessage("export:playlist", { playlistId, targetEmail });

    return ResponseHelper.created(
      h,
      null,
      "Permintaan Anda sedang kami proses"
    );
  }
}

module.exports = ExportHandler;
