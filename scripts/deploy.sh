#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the Angular app
echo "Building the Angular app..."
npm run build

# Navigate into the build output directory
cd ../www

# Deploy to Firebase
echo "Deploying to Firebase... using firebase.json config"
firebase deploy

echo "Deployment complete!"