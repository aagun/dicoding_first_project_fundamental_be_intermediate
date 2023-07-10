const ResponseHelper = require("../../utils/ResponseHelper");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongsHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const songId = await this._service.save({ ...request.payload });
      return ResponseHelper.created(h, { songId }, "Song berhasil ditambahkan");
    } catch (error) {
      return ResponseHelper.responseExceptionHelper(h, error);
    }
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.findAll({ title, performer });
    return ResponseHelper.ok(h, { songs });
  }

  async getSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.findById(id);
      return ResponseHelper.ok(h, { song });
    } catch (error) {
      return ResponseHelper.responseExceptionHelper(h, error);
    }
  }

  async putSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      await this._service.updateById({
        ...request.params,
        ...request.payload,
      });
      return ResponseHelper.modified(h, "Song berhasil diubah");
    } catch (error) {
      return ResponseHelper.responseExceptionHelper(h, error);
    }
  }

  async deleteSongsByIdHandler(request, h) {
    try {
      await this._service.deleteById(request.params.id);
      return ResponseHelper.modified(h, "Song berhasil dihapus");
    } catch (error) {
      return ResponseHelper.responseExceptionHelper(h, error);
    }
  }
}

module.exports = SongsHandler;
