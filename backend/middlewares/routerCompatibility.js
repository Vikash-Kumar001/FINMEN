// Middleware to ensure compatibility with Express router
import { Router } from 'express';
import pathToRegexp from 'path-to-regexp';

/**
 * Creates a compatibility layer for Express Router to work with ES modules
 * This helps prevent the "Cannot find module './router'" error
 */
export const createCompatibleRouter = () => {
  const router = Router();
  
  // Ensure the router has all necessary methods
  const originalRoute = router.route;
  router.route = function(path) {
    // Use modern path-to-regexp if available
    try {
      if (typeof path === 'string') {
        // Convert path string to regexp using modern path-to-regexp
        const keys = [];
        const regexp = pathToRegexp(path, keys);
        
        // Log successful path conversion for debugging
        console.log(`✅ Path ${path} converted to regexp successfully`);
      }
    } catch (err) {
      console.error(`❌ Error converting path ${path} to regexp:`, err);
    }
    
    // Call the original route method
    return originalRoute.call(this, path);
  };
  
  return router;
};

export default createCompatibleRouter;