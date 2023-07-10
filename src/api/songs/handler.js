const ResponseHelper = require("../../utils/ResponseHelper");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongsHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    const songId = await this._service.save({ ...request.payload });
    return ResponseHelper.created(h, { songId }, "Song berhasil ditambahkan");
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.findAll({ title, performer });
    return ResponseHelper.ok(h, { songs });
  }

  async getSongsByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.findById(id);
    return ResponseHelper.ok(h, { song });
  }

  async putSongsByIdHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);
    await this._service.updateById({
      ...request.params,
      ...request.payload,
    });
    return ResponseHelper.modified(h, "Song berhasil diubah");
  }

  async deleteSongsByIdHandler(request, h) {
    await this._service.deleteById(request.params.id);
    return ResponseHelper.modified(h, "Song berhasil dihapus");
  }
}

module.exports = SongsHandler;
