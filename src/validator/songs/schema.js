const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().max(255),
  year: Joi.number().required().integer().positive(),
  genre: Joi.string().required().max(50),
  performer: Joi.string().max(255),
  duration: Joi.number().integer().positive(),
  albumId: Joi.string().max(32),
});

module.exports = {
  SongPayloadSchema,
};
