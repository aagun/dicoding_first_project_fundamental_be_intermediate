const InvariantException = require("../../exceptions/InvariantException");
const {
  playlistPayloadSchema,
  playlistSongPayloadSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = playlistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const { error } = playlistSongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = PlaylistsValidator;
