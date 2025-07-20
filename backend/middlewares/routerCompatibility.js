import { Router } from 'express';

export const createCompatibleRouter = () => {
  const router = Router();

  const originalRoute = router.route;

  router.route = async function (path) {
    try {
      if (typeof path === 'string') {
        // Dynamically import path-to-regexp for better compatibility in ESM
        const { pathToRegexp } = await import('path-to-regexp');

        const keys = [];
        const regexp = pathToRegexp(path, keys);

        console.log(`✅ Path "${path}" converted to RegExp successfully`);
      }
    } catch (err) {
      console.error(`❌ Error converting path "${path}" to RegExp:`, err);
    }

    return originalRoute.call(this, path);
  };

  return router;
};

export default createCompatibleRouter;
