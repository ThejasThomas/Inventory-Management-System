export const ERROR_MESSAGE = {
  EMAIL_EXISTS: "Email already registered",
  REGISTRATION_NOT_COMPLETE: "Error occurs while registration",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Wrong email or password",
  MISSING_DATAS: "User ID, email, or role is missing",
  UNAUTHORIZED_ACCESS: "Not authorized",
  INVALID_TOKEN: "Invalid Token",
  TOKEN_EXPIRED: "Token Expired",
  INTERNEL_SERVER_ERROR: "Internal server error",
  QUANTITY_NOT_VALID: "Quantity not valid",
  PRICE_NOT_VALID: "Price not valid",
  PRODUCT_NOT_ADDED: "Product added failed",
  FAILED_TO_FETCH_PRODUCT: "Failed to fetch products",
  PRODUCT_NOT_FOUND: "Product not found",
};
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // ❌ Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,

  // ⚠️ Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
export const SUCCESS_MESSAGE = {
  REGISTRATION_SUCCESS: "Registration completed",
  LOGIN_SUCCESS: "Successfully Logined",
  PRODUCT_ADDED_SUCCESSSFULLY: "Product added Successfully",
  PRODUCT_UPDATED_SUCCESSFULLY: "Product updated successfully",
  PRODUCT_DELETED_SUCCESSFULLY: "Product deleted successfully",
};
