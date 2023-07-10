const InvariantException = require("../../exceptions/InvariantException");
const { AlbumPayloadSchema } = require("./schema");

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantException(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
