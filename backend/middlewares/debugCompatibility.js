/**
 * Debug module compatibility middleware for Express
 * This middleware ensures that the debug module works correctly with Express
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a debug module compatibility layer
 * @returns {Function} Middleware function
 */
export const createDebugCompatibility = () => {
  try {
    // Path to debug module
    const debugNodePath = path.join(process.cwd(), 'node_modules', 'debug', 'src', 'node.js');
    const debugPath = path.join(process.cwd(), 'node_modules', 'debug', 'src', 'debug.js');
    
    // Check if debug module exists
    if (!fs.existsSync(debugPath)) {
      // Create debug.js file with minimal implementation
      const debugContent = `
/**
 * Minimal debug module implementation
 */

function setup(env) {
  function createDebug(namespace) {
    function debug(...args) {
      // Simple implementation that logs to console
      console.log(namespace, ...args);
    }
    return debug;
  }
  
  createDebug.coerce = val => val;
  createDebug.disable = () => {};
  createDebug.enable = () => {};
  createDebug.enabled = () => true;
  createDebug.humanize = () => '';
  createDebug.destroy = () => {};
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  
  return createDebug;
}

export default setup;
`;
      
      fs.writeFileSync(debugPath, debugContent, 'utf8');
      console.log('✅ Created debug.js module for compatibility');
    }
    
    // Patch node.js file if needed
    if (fs.existsSync(debugNodePath)) {
      let nodeContent = fs.readFileSync(debugNodePath, 'utf8');
      
      if (nodeContent.includes("require('./debug')")) {
        nodeContent = nodeContent.replace(
          "require('./debug')",
          "require('../package.json').version.startsWith('2.') ? require('./index') : require('./browser')"
        );
        
        fs.writeFileSync(debugNodePath, nodeContent, 'utf8');
        console.log('✅ Patched debug/node.js module');
      }
    }
  } catch (error) {
    console.error('❌ Failed to create debug compatibility:', error);
  }
  
  // Return middleware function
  return (req, res, next) => {
    // This middleware doesn't do anything at runtime
    // It's just to ensure the debug module is patched during initialization
    next();
  };
};

export default createDebugCompatibility;