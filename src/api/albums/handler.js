const ResponseHelper = require("../../utils/ResponseHelper");

class AlbumsHandler {
  constructor(service, validator, storageService, userAlbumLikes) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._userAlbumLikes = userAlbumLikes;
  }

  async postAlbumsHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.save({ ...request.payload });
    return ResponseHelper.created(h, { albumId }, "Album berhasil ditambahkan");
  }

  async postAlbumsCoverHandler(request, h) {
    const { id: albumId } = request.params;
    const { cover } = request.payload;

    this._validator.validateAlbumCoverHeaderPayload(cover.hapi.headers);

    await this._service.findById(albumId);

    const { Location: coverUrl } = await this._storageService.writeFile(
      cover,
      cover.hapi
    );

    await this._service.updateByIdWithCover(albumId, coverUrl);

    return ResponseHelper.created(h, null, "Gambar berhasil diunggah");
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

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.findById(albumId);
    await this._userAlbumLikes.save(userId, albumId);
    return ResponseHelper.created(h, null, "Album berhasil di-like");
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, isCached } = await this._userAlbumLikes.findByAlbumId(
      albumId
    );
    return ResponseHelper.ok(h, { likes }, isCached);
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.findById(albumId);
    await this._userAlbumLikes.deleteByUserIdAndAlbumId(userId, albumId);
    return ResponseHelper.modified(h, "Album berhasil di-unlike");
  }
}

module.exports = AlbumsHandler;
