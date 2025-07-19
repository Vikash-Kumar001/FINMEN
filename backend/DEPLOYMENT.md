# FINMEN Backend Deployment Guide

## Overview

This document provides instructions for deploying the FINMEN backend to production environments.

## Prerequisites

- Node.js version 20.x (LTS)
- MongoDB database
- Environment variables properly configured

## Environment Setup

### Node.js Version

The application requires Node.js 20.x (LTS). This is specified in two places:

1. `.node-version` file (for deployment platforms that support it)
2. `package.json` engines field

### Express Compatibility

The application includes patches to ensure Express 4.18.2 works correctly with ES modules in Node.js 20.x:

1. `express-patch.js` - Patches Express to use the modern path-to-regexp
2. `middlewares/routerCompatibility.js` - Provides a compatibility layer for routers

## Deployment Steps

1. **Clone the repository**

```bash
git clone https://github.com/Vikash-Kumar001/FINMEN.git
cd FINMEN/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set environment variables**

Create a `.env` file with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
PORT=5000
```

4. **Start the server**

```bash
npm start
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Make sure you're using Node.js 20.x
   - Verify that all dependencies are installed
   - Check that the express-patch.js is being imported before Express

2. **MongoDB connection issues**
   - Verify your MONGO_URI environment variable
   - Ensure network connectivity to your MongoDB instance

3. **Port conflicts**
   - If port 5000 is in use, set a different port in the .env file

## Maintenance

Regularly update dependencies and Node.js version to ensure security and compatibility.