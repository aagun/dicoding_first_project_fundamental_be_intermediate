require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const { albums, songs, users } = require("./api");
const {
  AlbumsValidator,
  SongsValidator,
  UsersValidator,
  AuthenticationsValidator,
} = require("./validator");
const { AlbumsServices, SongsServices, UsersServices } = require("./services");
const TokenManager = require("./tokenize/TokenManager");
const ResponseHelper = require("./utils/ResponseHelper");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([Jwt]);

  // Defined strategy authentication jwt
  server.auth.strategy("open_music_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
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
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongsServices(),
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: new UsersServices(),
        validator: UsersValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: null,
        userService: new UsersServices(),
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
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
