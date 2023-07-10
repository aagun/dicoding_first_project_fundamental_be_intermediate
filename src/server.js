require("dotenv").config();

const Hapi = require("@hapi/hapi");
const { albums, songs } = require("./api");
const { AlbumsValidator, SongsValidator } = require("./validator");
const { AlbumsServices, SongsServices } = require("./services");

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

  await server.start();
  console.info("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
