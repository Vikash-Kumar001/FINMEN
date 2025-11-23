/**
 * Safe logging utility that prevents sensitive data exposure in production
 * Only logs in development mode
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Safe console.log - only logs in development
 */
export const safeLog = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Safe console.error - always logs errors but sanitizes sensitive data
 */
export const safeError = (...args) => {
  const sanitized = args.map(arg => {
    if (typeof arg === 'string') {
      // Remove potential sensitive patterns
      return arg
        .replace(/token["\s:=]+[^\s"']+/gi, 'token: [REDACTED]')
        .replace(/password["\s:=]+[^\s"']+/gi, 'password: [REDACTED]')
        .replace(/email["\s:=]+[^\s"']+/gi, 'email: [REDACTED]')
        .replace(/authorization["\s:=]+[^\s"']+/gi, 'authorization: [REDACTED]');
    }
    if (typeof arg === 'object' && arg !== null) {
      // Recursively sanitize objects
      const sanitizedObj = { ...arg };
      const sensitiveKeys = ['token', 'password', 'email', 'authorization', 'apiKey', 'secret', 'accessToken', 'refreshToken'];
      sensitiveKeys.forEach(key => {
        if (sanitizedObj[key]) {
          sanitizedObj[key] = '[REDACTED]';
        }
      });
      return sanitizedObj;
    }
    return arg;
  });
  
  console.error(...sanitized);
};

/**
 * Safe console.warn - only logs in development
 */
export const safeWarn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

/**
 * Safe console.info - only logs in development
 */
export const safeInfo = (...args) => {
  if (isDevelopment) {
    console.info(...args);
  }
};

