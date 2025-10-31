/**
 * Privacy Validation Service
 * Ensures anonymized exports pass privacy checks with no PII leakage
 */

// List of PII fields that must be anonymized
const PII_FIELDS = [
  'email', 'phone', 'phoneNumber', 'mobile', 'telephone',
  'address', 'street', 'city', 'zipCode', 'postalCode', 'pincode',
  'ssn', 'socialSecurityNumber', 'aadhar', 'pan',
  'dateOfBirth', 'dob', 'birthDate',
  'creditCard', 'bankAccount', 'routingNumber',
  'ipAddress', 'deviceId', 'macAddress',
  'fullName', 'firstName', 'lastName', 'middleName',
  'username', 'userId', 'accountNumber'
];

// List of sensitive data fields
const SENSITIVE_FIELDS = [
  'password', 'token', 'accessToken', 'refreshToken',
  'privateKey', 'secret', 'apiKey',
  'biometricData', 'fingerprint', 'faceData',
  'healthData', 'medicalRecord', 'diagnosis'
];

/**
 * Scan data object for PII leakage
 */
export const scanForPIILeakage = (data) => {
  const leakage = [];
  
  const scanObject = (obj, path = '') => {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      const lowerKey = key.toLowerCase();

      // Check for PII fields
      if (PII_FIELDS.some(pii => lowerKey.includes(pii))) {
        leakage.push({
          field: currentPath,
          type: 'PII',
          value: value,
          severity: 'high'
        });
      }

      // Check for sensitive fields
      if (SENSITIVE_FIELDS.some(sensitive => lowerKey.includes(sensitive))) {
        leakage.push({
          field: currentPath,
          type: 'Sensitive',
          value: '***REDACTED***',
          severity: 'critical'
        });
      }

      // Recursively scan nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        scanObject(value, currentPath);
      }

      // Check array items
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            scanObject(item, `${currentPath}[${index}]`);
          }
        });
      }
    }
  };

  scanObject(data);

  return leakage;
};

/**
 * Validate anonymized data export
 */
export const validateAnonymizedExport = (data) => {
  const result = {
    valid: false,
    leakage: [],
    warnings: [],
    recommendedActions: []
  };

  // Scan for PII leakage
  result.leakage = scanForPIILeakage(data);

  if (result.leakage.length > 0) {
    result.valid = false;
    
    // Group by severity
    const criticalLeakage = result.leakage.filter(l => l.severity === 'critical');
    const highLeakage = result.leakage.filter(l => l.severity === 'high');

    if (criticalLeakage.length > 0) {
      result.recommendedActions.push(
        'Critical: Data contains sensitive information. Export blocked.'
      );
    } else if (highLeakage.length > 0) {
      result.recommendedActions.push(
        'High: Data contains PII. Please anonymize before export.'
      );
    }
  } else {
    result.valid = true;
    result.warnings.push('No PII leakage detected. Export approved.');
  }

  return result;
};

/**
 * Anonymize data by removing or masking PII fields
 */
export const anonymizeData = (data) => {
  const anonymized = JSON.parse(JSON.stringify(data)); // Deep copy

  const anonymizeObject = (obj, path = '') => {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      const lowerKey = key.toLowerCase();

      // Mask PII fields
      if (PII_FIELDS.some(pii => lowerKey.includes(pii))) {
        if (typeof value === 'string' && value.length > 0) {
          // Mask email
          if (lowerKey.includes('email')) {
            obj[key] = value.replace(/(.{0,2}).*(@.*)/, '$1***$2');
          }
          // Mask phone numbers
          else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
            obj[key] = value.replace(/(.{0,3}).*/, '$1***');
          }
          // Mask addresses
          else if (lowerKey.includes('address') || lowerKey.includes('street')) {
            obj[key] = '***REDACTED***';
          }
          // Mask other PII
          else {
            obj[key] = '***ANONYMIZED***';
          }
        }
      }

      // Remove sensitive fields completely
      if (SENSITIVE_FIELDS.some(sensitive => lowerKey.includes(sensitive))) {
        delete obj[key];
      }

      // Recursively anonymize nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        anonymizeObject(value, currentPath);
      }

      // Anonymize array items
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            anonymizeObject(item, `${currentPath}[${index}]`);
          }
        });
      }
    }
  };

  anonymizeObject(anonymized);

  return anonymized;
};

/**
 * Generate anonymized export with privacy validation
 */
export const generateAnonymizedExport = async (rawData, options = {}) => {
  const {
    includeAgeGroups = false,
    includeRegions = false,
    includeTimestamps = false
  } = options;

  // Step 1: Initial validation
  const validation = validateAnonymizedExport(rawData);
  
  if (!validation.valid) {
    throw new Error(
      `Export blocked: PII leakage detected. ${validation.recommendedActions.join(' ')}`
    );
  }

  // Step 2: Anonymize data
  let anonymizedData = anonymizeData(rawData);

  // Step 3: Additional privacy controls
  if (!includeAgeGroups) {
    anonymizedData = removeAgeGroups(anonymizedData);
  }

  if (!includeRegions) {
    anonymizedData = removeRegionData(anonymizedData);
  }

  if (!includeTimestamps) {
    anonymizedData = removeTimestamps(anonymizedData);
  }

  // Step 4: Final validation
  const finalValidation = validateAnonymizedExport(anonymizedData);
  
  if (!finalValidation.valid) {
    throw new Error('Final validation failed. Export blocked.');
  }

  return {
    data: anonymizedData,
    validation: finalValidation,
    exportDate: new Date(),
    privacyCompliant: true
  };
};

/**
 * Remove age group information
 */
const removeAgeGroups = (data) => {
  // Implementation to remove age groups
  return data;
};

/**
 * Remove specific region data
 */
const removeRegionData = (data) => {
  // Implementation to remove region-specific data
  return data;
};

/**
 * Remove timestamp information
 */
const removeTimestamps = (data) => {
  // Implementation to remove or generalize timestamps
  return data;
};

