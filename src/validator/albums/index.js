const InvariantException = require("../../exceptions/InvariantException");
const { AlbumPayloadSchema, AlbumCoverHeaderSchema } = require("./schema");

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
  validateAlbumCoverHeaderPayload: (payload) => {
    const { error } = AlbumCoverHeaderSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = AlbumsValidator;
