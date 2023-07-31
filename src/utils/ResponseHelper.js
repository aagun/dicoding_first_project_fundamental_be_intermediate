const { HTTP_STATUS } = require("../utils/CommonConstants");
const ClientException = require("../exceptions/ClientException");

const ResponseHelper = {
  created: (h, data, message = null) => {
    return h
      .response({
        status: "success",
        message,
        data,
      })
      .code(HTTP_STATUS.CREATED);
  },
  modified: (h, message, data = null) => {
    const response = {
      status: "success",
      message,
    };

    if (!data) {
      return h.response(response).code(HTTP_STATUS.OK);
    }

    return h
      .response({
        ...response,
        data,
      })
      .code(HTTP_STATUS.OK);
  },
  ok: (h, data, message = null) => {
    return h
      .response({
        status: "success",
        message,
        data,
      })
      .code(HTTP_STATUS.OK);
  },
  responseExceptionHelper: (h, error) => {
    if (error instanceof ClientException) {
      return ResponseHelper.clientProcessingErrorHandler(h, error);
    }

    const { statusCode, error: message } = error.output.payload;
    if (statusCode.toString().startsWith(4)) {
      return h
        .response({
          status: "fail",
          message,
        })
        .code(statusCode);
    }

    return ResponseHelper.serverProcessingErrorHandler(h, error);
  },

  clientProcessingErrorHandler: (h, error) => {
    return h
      .response({
        status: "fail",
        message: error.message,
      })
      .code(error.statusCode);
  },

  serverProcessingErrorHandler: (h, error) => {
    console.error(error);
    return h
      .response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      })
      .code(500);
  },
};

module.exports = ResponseHelper;
