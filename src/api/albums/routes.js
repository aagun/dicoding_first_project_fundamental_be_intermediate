const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: (request, h) => handler.postAlbumsHandler(request, h),
  },
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: (request, h) => handler.postAlbumsCoverHandler(request, h),
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000,
      },
    },
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.postAlbumLikesHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums",
    handler: (request, h) => handler.getAlbumsHandler(request, h),
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: (request, h) => handler.getAlbumsByIdWithSongsHandler(request, h),
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.getAlbumLikesHandler(request, h),
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: (request, h) => handler.putAlbumsByIdHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: (request, h) => handler.deleteAlbumsByIdHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.deleteAlbumLikesHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
];

module.exports = routes;
