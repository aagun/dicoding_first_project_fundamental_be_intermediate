require("dotenv").config();

const Hapi = require("@hapi/hapi");
const { albums, songs } = require("./api");
const { AlbumsValidator, SongsValidator } = require("./validator");
const { AlbumsServices, SongsServices } = require("./services");
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
