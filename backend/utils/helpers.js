const crypto = require('crypto');

/**
 * Response helper functions for consistent API responses
 */
const responses = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  },

  error: (res, message = 'Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  },

  validationError: (res, errors) => {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString()
    });
  },

  notFound: (res, resource = 'Resource') => {
    return res.status(404).json({
      success: false,
      message: `${resource} not found`,
      timestamp: new Date().toISOString()
    });
  },

  unauthorized: (res, message = 'Authentication required') => {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  },

  forbidden: (res, message = 'Access forbidden') => {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }
};
