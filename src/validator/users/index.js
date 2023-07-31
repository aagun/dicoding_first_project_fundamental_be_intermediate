const InvariantException = require("../../exceptions/InvariantException");
const { UserPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantException(error.message);
    }
  },
};

module.exports = UsersValidator;
