# NOTE: this docker assumes you already build your app just copy to the nginx server. 

# Stage 1: Serve the application with Nginx (using pre-built assets)
FROM nginx:1.27-alpine

# Set a label for clarity
LABEL stage="nginx-server"

# Copy the pre-built application (from Cloud Build's workspace) to Nginx's webroot
# The 'dist/browser' directory is expected to exist in the build context
# because the 'build-angular-for-env' step in cloudbuild.yaml creates it.
COPY www/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
# Ensure nginx.conf is in the root of your project or adjust path.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]