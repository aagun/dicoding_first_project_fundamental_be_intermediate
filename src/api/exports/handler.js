const ResponseHelper = require("../../utils/ResponseHelper");

class ExportHandler {
  constructor(service, validator, playlistsService, songsService) {
    this._service = service;
    this._validator = validator;
    this.playlistsService = playlistsService;
    this._songsService = songsService;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);
    let playlist = await this.playlistsService.findByIdAndOwner(
      playlistId,
      userId
    );
    const songs = await this._songsService.findByOwnerOrUserId(userId);

    playlist = {
      ...playlist,
      songs: songs,
    };

    this._service.sendMessage("export:playlist", { playlist, targetEmail });

    return ResponseHelper.created(
      h,
      null,
      "Permintaan Anda sedang kami proses"
    );
  }
}

module.exports = ExportHandler;
