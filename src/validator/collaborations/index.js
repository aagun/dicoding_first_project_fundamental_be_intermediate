const InvariantException = require("../../exceptions/InvariantException");
const { CollaborationsPayloadSchema } = require("./schema");

const CollaborationsValidator = {
  validateCollaborationsPayload: (payload) => {
    const { error } = CollaborationsPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = CollaborationsValidator;
