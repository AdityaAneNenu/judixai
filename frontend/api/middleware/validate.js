const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      valid: false,
      errors: {
        success: false,
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      },
    };
  }
  return { valid: true };
};

module.exports = validate;
