/**
 * Express patch to fix debug module issues in Node.js 20.x
 * This patch fixes the 'Cannot find module ./debug' error in Express when deployed on Render
 */

// Import required modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple debug module patch
const patchDebugModule = () => {
  try {
    // Path to debug module node.js file
    const debugNodePath = path.join(process.cwd(), 'node_modules', 'debug', 'src', 'node.js');
    
    // Check if the file exists
    if (fs.existsSync(debugNodePath)) {
      // Read the file content
      let content = fs.readFileSync(debugNodePath, 'utf8');
      
      // Fix formatters issue
      if (content.includes('exports.formatters = {};')) {
        content = content.replace(
          'exports.formatters = {};',
          'exports.formatters = exports.formatters || {};'
        );
      }
      
      // Fix debug module reference
      if (content.includes("require('./debug')")) {
        content = content.replace(
          "require('./debug')",
          "require('./index')"
        );
      }
      
      // Write the patched file back
      fs.writeFileSync(debugNodePath, content, 'utf8');
      console.log('✅ Express debug module patched successfully');
    }
  } catch (error) {
    console.error('❌ Failed to patch debug module:', error);
  }
};

// Execute the patch
patchDebugModule();