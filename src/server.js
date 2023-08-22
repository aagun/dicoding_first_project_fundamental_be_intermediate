require("dotenv").config();
const config = require("./utils/config");

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const TokenManager = require("./tokenize/TokenManager");
const ResponseHelper = require("./utils/ResponseHelper");
const {
  albums,
  songs,
  users,
  authentications,
  playlists,
  collaborations,
  exportsPlaylist,
} = require("./api");

const {
  AlbumsValidator,
  SongsValidator,
  UsersValidator,
  AuthenticationsValidator,
  PlaylistsValidator,
  CollaborationsValidator,
  ExportsValidator,
} = require("./validator");

const {
  AlbumsServices,
  SongsServices,
  UsersServices,
  AuthenticationsServices,
  PlaylistsServices,
  PlaylistSongsServices,
  CollaborationsServices,
  ActivitiesServices,
  ProducerServices,
  StorageServices,
  CacheServices,
  UserAlbumLikes,
} = require("./services");

const init = async () => {
  const collaborationsService = new CollaborationsServices();
  const playlistsService = new PlaylistsServices(collaborationsService);
  const playlistSongsService = new PlaylistSongsServices(playlistsService);
  const songsService = new SongsServices();
  const usersService = new UsersServices();
  const activitiesService = new ActivitiesServices();
  const cacheService = new CacheServices();
  const userAlbumLikes = new UserAlbumLikes(cacheService);
  const storageService = new StorageServices();

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([Jwt]);

  // Defined strategy authentication jwt
  server.auth.strategy("open_music_jwt", "jwt", {
    keys: config.tokenManager.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.tokenManager.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumsServices(),
        validator: AlbumsValidator,
        storageService,
        userAlbumLikes,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        service: new AuthenticationsServices(),
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        songsService,
        activitiesService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportsPlaylist,
      options: {
        service: ProducerServices,
        validator: ExportsValidator,
        playlistsService,
      },
    },
  ]);

  // Error handler (Rest Advice)
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      return ResponseHelper.responseExceptionHelper(h, response);
    }
    return h.continue;
  });

  await server.start();
  console.info("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
