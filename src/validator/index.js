const AlbumsValidator = require("./albums");
const SongsValidator = require("./songs");
const UsersValidator = require("./users");
const AuthenticationsValidator = require("./authentications");
const PlaylistsValidator = require("./playlists");
const CollaborationsValidator = require("./collaborations");
const ExportsValidator = require("./exports");

module.exports = {
  SongsValidator,
  AlbumsValidator,
  UsersValidator,
  AuthenticationsValidator,
  PlaylistsValidator,
  CollaborationsValidator,
  ExportsValidator,
};
