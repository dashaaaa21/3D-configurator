#!/bin/bash

set -e

echo "Starting deployment..."

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
npm ci

echo "Building project..."
npm run build

echo "Restarting server..."
if pm2 list | grep -q "threejs-app"; then
    pm2 restart threejs-app
else
    pm2 start npm --name "threejs-app" -- run server:prod
fi

echo "Deployment completed successfully!"
