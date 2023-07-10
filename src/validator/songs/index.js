const InvariantException = require("../../exceptions/InvariantException");
const { SongPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantException(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
