const ExportHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exportsPlaylist",
  version: "1.0.0",
  register: async (
    server,
    { service, validator, playlistsService, songsService }
  ) => {
    const exportsHandler = new ExportHandler(
      service,
      validator,
      playlistsService,
      songsService
    );
    server.route(routes(exportsHandler));
  },
};
