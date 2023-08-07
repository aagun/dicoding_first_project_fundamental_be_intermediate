const InvariantException = require("../../exceptions/InvariantException");
const { SongPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = SongsValidator;
