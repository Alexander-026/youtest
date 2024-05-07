class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Der Nutzer ist nicht berechtigt");
  }
  static UnauthorizedAdminError() {
    return new ApiError(401, "Nicht als Administrator autorisiert.");
  }

  static InvalidRefreshToken() {
    return new ApiError(403, "Invalid Refresh Token.");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

export default ApiError;

