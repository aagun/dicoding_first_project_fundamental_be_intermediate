const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().max(255),
  year: Joi.number().required().integer().positive(),
});

const AlbumCoverHeaderSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp"
    )
    .required(),
}).unknown();

module.exports = { AlbumPayloadSchema, AlbumCoverHeaderSchema };
