const InvariantException = require("../../exceptions/InvariantException");
const ResponseHelper = require("../../utils/ResponseHelper");

class PlaylistHandler {
  constructor(service, playlistSongsService, songsService, activitiesService, validator) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._playlistSongsService = playlistSongsService;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._service.save({ name, owner });

    return ResponseHelper.created(
      h,
      { playlistId },
      "Playlist berhasil ditambahkan"
    );
  }

  async getPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.findByOwner(owner);
    return ResponseHelper.ok(h, { playlists });
  }

  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deleteById(id);
    return ResponseHelper.modified(h, "Playlist berhasil dihapus");
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.findById(songId);

    const playlistSong =
      await this._playlistSongsService.findByPlaylistIdAndSongId(playlistId, songId);

    if (playlistSong) {
      throw new InvariantException("Lagu sudah ditambahkan ke playlist");
    }

    await this._playlistSongsService.save(playlistId, songId);
    await this._activitiesService.save({
      userId, 
      playlistId, 
      songId, 
      action: "add"
    });
    return ResponseHelper.created(
      h,
      null,
      "Lagu berhasil ditambahkan ke playlist"
    );
  }

  async getPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    let playlist = await this._service.findByIdAndOwner(playlistId, owner);
    const songs = await this._songsService.findByOwnerOrUserId(owner);

    playlist = {
      ...playlist,
      songs: songs,
    };

    return ResponseHelper.ok(h, { playlist });
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, userId);
    await this._playlistSongsService.deleteByPlaylistIdAndSongId(playlistId, songId);
    await this._activitiesService.save({
      userId, 
      playlistId, 
      songId, 
      action: "delete"
    });
    return ResponseHelper.modified(h, "Lagu berhasil dihapus dari playlist");
  }

  async getActivitiesHandler(request, h) {
    const { id} = request.params;
    const { id: owner } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(id, owner);
    const {id: playlistId} = await this._service.findById(id);
    const activities = await this._activitiesService.findAll(id, owner);
    return ResponseHelper.ok(h, {playlistId, activities});
  }
}

module.exports = PlaylistHandler;
