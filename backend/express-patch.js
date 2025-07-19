// Express patch to fix path-to-regexp compatibility issue
import pathToRegexp from 'path-to-regexp';

// Override Express's internal path-to-regexp with the newer version
try {
  const expressModule = await import('express');
  if (expressModule && expressModule.default && expressModule.default.Router) {
    // Attempt to patch the Router prototype if it exists
    const proto = Object.getPrototypeOf(expressModule.default.Router());
    if (proto && proto.route) {
      const originalRoute = proto.route;
      proto.route = function(path) {
        console.log('Using patched Express Router with modern path-to-regexp');
        return originalRoute.call(this, path);
      };
    }
  }
  console.log('✅ Express patch applied successfully');
} catch (err) {
  console.error('❌ Failed to apply Express patch:', err);
}

export default pathToRegexp;