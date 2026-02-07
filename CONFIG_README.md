# Configuration Management

This project uses a flexible configuration system to manage environment-specific variables. The base configuration is stored in `public/config.json`, which is tracked by Git and serves as a template for local development.

## Production and Sensitive Data

For production environments or configurations containing sensitive data (like API keys or specific server URLs), we use a separate, untracked file: `public/config.prod.json`. This file is **not** committed to Git, as it is listed in the `.gitignore` file.

### Setup for a New Environment

When setting up the project in a new environment or for a new team member, follow these steps:

1.  **Create the production configuration file:**
    Copy the development configuration to create the production file. This ensures you have all the necessary keys.

    ```bash
    cp public/config.json public/config.prod.json
    ```

2.  **Update the production variables:**
    Open `public/config.prod.json` and modify the values to match the production environment. For example, you might change `backendNodeUrl` to your live server's URL.

    ```json
    {
      "projectName": "Dataclouder Template",
      "version": "0.0.28",
      "envName": "PROD",
      "production": true,
      "authenticationRequired": true,
      "backendNodeUrl": "https://your-production-url.com",
      ...
    }
    ```

## Deployment

The deployment scripts, such as `make deploy-cloudflare`, are configured to automatically use the correct configuration file. When you run a deployment command, the script will temporarily replace `public/config.json` with `public/config.prod.json` to ensure the build includes the correct production variables. Your local `public/config.json` is backed up and restored after the deployment, so your local development environment is not affected.