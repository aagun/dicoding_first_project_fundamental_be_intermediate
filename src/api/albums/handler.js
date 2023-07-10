const ResponseHelper = require("../../utils/ResponseHelper");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumsHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.save({ ...request.payload });
    return ResponseHelper.created(h, { albumId }, "Album berhasil ditambahkan");
  }

  async getAlbumsHandler(_, h) {
    const albums = await this._service.findAll();
    return ResponseHelper.ok(h, { albums });
  }

  async getAlbumsByIdWithSongsHandler(request, h) {
    const album = await this._service.findByIdAndWithSongs(request.params.id);
    return ResponseHelper.ok(h, { album });
  }

  async getAlbumsByIdHandler(request, h) {
    const album = await this._service.findById(request.params.id);
    return ResponseHelper.ok(h, { album });
  }

  async putAlbumsByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    await this._service.updateById({ ...request.params, ...request.payload });
    return ResponseHelper.modified(h, "Album berhasil diperbaharui");
  }

  async deleteAlbumsByIdHandler(request, h) {
    await this._service.deleteById(request.params.id);
    return ResponseHelper.modified(h, "Album berhasil dihapus");
  }
}

module.exports = AlbumsHandler;
