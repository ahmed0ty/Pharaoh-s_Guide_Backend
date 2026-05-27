export const ApiResponse = {
  success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  },

  created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  },

  paginated(res, data, pagination) {
    return res.status(200).json({
      status: 'success',
      pagination,
      data,
    });
  },

  error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors }),
    });
  },

  notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  },

  unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  },

  forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  },

  validationError(res, errors) {
    return this.error(res, 'Validation failed', 422, errors);
  },
};