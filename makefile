# ==============================================================================
# Shell & Formatting
# ==============================================================================
.PHONY: help start install clean ._remote_deploy_flow
.DEFAULT_GOAL := help

BLUE := \033[1;34m
NC   := \033[0m # No Color

# ==============================================================================
# Generic Project Configuration
# ==============================================================================
# Variables for deployment
ENV ?= dev
EXT ?= io
PROJECT_NAME ?= dataclouder
PROJECT_ID ?= $(PROJECT_NAME)-$(ENV) #Firebase/Google project ID
APP_ID ?= $(EXT).$(PROJECT_NAME).$(ENV) # User for mobile apps. example com.my-startup.app
DISPLAY_NAME ?= $(PROJECT_NAME)
APP_ENV ?= $(ENV)

# Docker Configuration
DOCKER_IMAGE_NAME    ?= $(PROJECT_NAME)-front
IMAGE_FILENAME       := $(DOCKER_IMAGE_NAME).tar
CONTAINER_NAME       ?= $(PROJECT_NAME)-front-app
HOST_PORT ?= 7990


# If your remote user needs a password for ssh/sudo, set it here or in your .env file.
# For ssh, it will be used with sshpass. For sudo, it will be piped to sudo -S.
# Leave empty to use passwordless sudo.
REMOTE_SUDO_PASSWORD ?= **

# If REMOTE_SUDO_PASSWORD is set, configure commands to use it for SSH authentication.
# This requires the `sshpass` utility to be installed on your local machine.
# On macOS: brew install sshpass
# On Debian/Ubuntu: sudo apt-get install sshpass
SSH_CMD = ssh
SCP_CMD = scp
ifneq ($(strip $(REMOTE_SUDO_PASSWORD)),)
	SSH_CMD = sshpass -p '$(REMOTE_SUDO_PASSWORD)' ssh
	SCP_CMD = sshpass -p '$(REMOTE_SUDO_PASSWORD)' scp
endif



# ==============================================================================
# Target-Specific Variables
# ==============================================================================
# These are set by the main deploy targets below
TARGET_USER          ?= local
TARGET_HOST          ?= localhost
REMOTE_DEPLOY_PATH   ?= /tmp
PLATFORM             ?= linux/amd64 # Default platform

REMOTE_TAR_FILEPATH  = $(REMOTE_DEPLOY_PATH)/$(IMAGE_FILENAME)

REMOTE_CONFIG_FILENAME = config.json
REMOTE_CONFIG_PATH   = $(REMOTE_DEPLOY_PATH)/$(REMOTE_CONFIG_FILENAME)
LOCAL_CONFIG_PATH    = src/assets/config.$(APP_ENV).json


# ==============================================================================
# USER-FACING DEPLOYMENT TARGETS
# ==============================================================================

# Deploy to Local Docker (ARM64)
deploy-local: PLATFORM = linux/arm64
deploy-local: ._build-docker ._deploy-local
	@echo "✅ Deployment to local Docker completed successfully."

# Deploy to Homelab Server (ARM64)
deploy-homelab: TARGET_USER = adamo
deploy-homelab: TARGET_HOST = 192.168.2.5
deploy-homelab: REMOTE_DEPLOY_PATH = /home/adamo/Documents
deploy-homelab: PLATFORM = linux/arm64
deploy-homelab: APP_ENV = homelab
deploy-homelab: ._remote_deploy_flow
	@echo "✅ Deployment to Homelab on http://$(TARGET_HOST):$(HOST_PORT) completed successfully."

# Deploy to AI Lab Server (AMD64)
deploy-ailab: TARGET_USER = adamo
deploy-ailab: TARGET_HOST = 192.168.2.2
deploy-ailab: REMOTE_DEPLOY_PATH = /home/adamo/Documents
deploy-ailab: PLATFORM = linux/amd64
deploy-ailab: APP_ENV = ailab
deploy-ailab: ._remote_deploy_flow
	@echo "✅ Deployment to AI Lab on http://$(TARGET_HOST):$(HOST_PORT)completed successfully."

# Deploy to Firebase Hosting
deploy:
	npm run build
	firebase deploy --project $(PROJECT_ID) --only hosting:$(PROJECT_ID)

# Common remote deployment flow (internal)
._remote_deploy_flow: ._build-docker ._transfer ._deploy-remote ._local-cleanup

# ==============================================================================
# INTERNAL HELPER TARGETS (not meant to be called directly)
# ==============================================================================

._build-docker:
	@echo "1) 🚀 Building Angular app for production..."
	@npm run build
	@echo "2) 🐳 Building Docker image [$(DOCKER_IMAGE_NAME):latest] for [$(PLATFORM)]..."
	@docker build --platform $(PLATFORM) --build-arg APP_ENV=$(APP_ENV) -t $(DOCKER_IMAGE_NAME):latest .

._transfer:
	@echo "3) 💾 Saving Docker image to [$(IMAGE_FILENAME)]..."
	@docker save $(DOCKER_IMAGE_NAME):latest -o $(IMAGE_FILENAME)
	@echo "4) 🚚 Transferring files to [$(TARGET_USER)@$(TARGET_HOST)]..."
	@echo "  -> Transferring Docker image [$(IMAGE_FILENAME)] to [$(REMOTE_TAR_FILEPATH)]"
	@$(SCP_CMD) $(IMAGE_FILENAME) $(TARGET_USER)@$(TARGET_HOST):$(REMOTE_TAR_FILEPATH)
	@echo "  -> Transferring config file [$(LOCAL_CONFIG_PATH)] to [$(REMOTE_CONFIG_PATH)]"
	@$(SCP_CMD) $(LOCAL_CONFIG_PATH) $(TARGET_USER)@$(TARGET_HOST):$(REMOTE_CONFIG_PATH)

._deploy-remote:
	@echo "5) ⚙️  Deploying on remote host [$(TARGET_HOST)]..."
	@$(SSH_CMD) -t $(TARGET_USER)@$(TARGET_HOST) '\
		set -e; \
		if [ -n "$(REMOTE_SUDO_PASSWORD)" ]; then \
			SUDO_CMD="echo \"$(REMOTE_SUDO_PASSWORD)\" | sudo -S"; \
		else \
			SUDO_CMD="sudo"; \
		fi; \
		echo "  -> 🐳 Loading Docker image..."; \
		eval $$SUDO_CMD docker load -i $(REMOTE_TAR_FILEPATH); \
		echo "  -> 🛑 Stopping existing container [$(CONTAINER_NAME)]..."; \
		eval $$SUDO_CMD docker stop $(CONTAINER_NAME) || true; \
		echo "  -> 🗑️  Removing existing container [$(CONTAINER_NAME)]..."; \
		eval $$SUDO_CMD docker rm $(CONTAINER_NAME) || true; \
		echo "  -> 🚀 Starting new container [$(CONTAINER_NAME)]..."; \
		eval $$SUDO_CMD docker run -d \
			--name $(CONTAINER_NAME) \
			-p $(HOST_PORT):80 \
			-v $(REMOTE_CONFIG_PATH):/usr/share/nginx/html/assets/config.json:ro \
			--restart unless-stopped \
			$(DOCKER_IMAGE_NAME):latest; \
		echo "  -> 🧹 Cleaning up remote tarball..."; \
		rm $(REMOTE_TAR_FILEPATH); \
		echo "  -> ✅ Remote deployment finished." '

._deploy-local:
	@echo "3) 🚀 Deploying on local Docker..."
	@echo "  -> 🛑 Stopping and removing existing container [$(CONTAINER_NAME)]..."
	-@docker stop $(CONTAINER_NAME)
	-@docker rm $(CONTAINER_NAME)
	@echo "  -> 🚀 Starting new container [$(CONTAINER_NAME)]..."
	@docker run -d --name $(CONTAINER_NAME) -p $(HOST_PORT):80 -v $(shell pwd)/src/assets/config.$(APP_ENV).json:/usr/share/nginx/html/assets/config.json --restart unless-stopped $(DOCKER_IMAGE_NAME):latest

._local-cleanup:
	@echo "6) 🧹 Cleaning up local tarball [$(IMAGE_FILENAME)]..."
	@rm -f $(IMAGE_FILENAME)

# ==============================================================================
# DEVELOPMENT & UTILITY TARGETS
# ==============================================================================

rename-project:
	python3 scripts/rename_project.py "$(PROJECT_NAME)" "$(APP_ID)"

update-dc:
	npm run update:dc

check-deps:
	@command -v firebase >/dev/null 2>&1 || { echo "Firebase CLI not found. Run 'make install-deps'"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "Node.js not found. Please install Node.js"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "npm not found. Please install npm"; exit 1; }

install-deps:
	@echo "Installing dependencies..."
	npm install -g firebase-tools
	npm install

init-firebase: check-deps
	@echo " 🚀 Initializing Firebase project $(PROJECT_ID), lets login first 🧎‍♂️ and Hope none one has taken this name 🙏  ... " 
	firebase login
	@echo "Creating Firebase project... firebase projects:create $(PROJECT_ID) --display-name "$(DISPLAY_NAME)""
	firebase projects:create $(PROJECT_ID) --display-name "$(DISPLAY_NAME)"
	make create-firebase-app
	@echo "Installing project dependencies..."
	npm install --force
	@echo "Project initialized successfully!"
	@echo "IMPORTANT: Please manually enable authentication and email, google and apple providers in https://console.firebase.google.com/project/$(PROJECT_ID)/authentication"

create-firebase-app:
	@echo "Configuring Firebase SDK..."
	@echo "Creating Firebase App and Printing new firebase keys"
	$(eval SDK_CONFIG := $(shell firebase apps:create WEB $(PROJECT_ID)  --project=$(PROJECT_ID) | grep "firebase apps:sdkconfig"))
	@echo "SDK_CONFIG value: $(SDK_CONFIG)"
	@$(SDK_CONFIG) > temp_config.txt
	node scripts/update-firebase-config.js
	@rm temp_config.txt

merge-upstream:
	@echo "Fetching and merging updates from upstream repository..."
	@if ! git config remote.upstream.url > /dev/null; then \
		echo "Adding upstream remote..."; \
		git remote add upstream https://github.com/dataclouder-dev/dataclouder-template-angular.git; \
	fi
	git fetch upstream
	git checkout main
	@echo "Merging upstream/main into local main branch..."
	git merge upstream/main --allow-unrelated-histories || { \
		echo "Merge conflicts detected. Please resolve conflicts and complete the merge manually."; \
		echo "After resolving conflicts, commit changes and push to origin."; \
		exit 1; \
	}
	

deploy-release:
	npm run prebuild
	npm run build:prod
	firebase deploy --project $(PROJECT_ID) --only hosting:$(PROJECT_ID)

start:
	npm run start

# ==============================================================================
# HELP
# ==============================================================================
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "----------------------------------------------------------------------"
	@echo "  Deployment Targets"
	@echo "----------------------------------------------------------------------"
	@echo "  $(BLUE)make deploy-local$(NC)      - Build and deploy the app to your local Docker."
	@echo "  $(BLUE)make deploy-homelab$(NC)    - Build and deploy the app to the Homelab server."
	@echo "  $(BLUE)make deploy-ailab$(NC)       - Build and deploy the app to the AI Lab server."
	@echo "  $(BLUE)make deploy$(NC)             - Build and deploy the app to Firebase Hosting."
	@echo "  $(BLUE)make deploy-release$(NC)     - Build and deploy a production release to Firebase."
	@echo ""
	@echo "  You can override variables like this: make deploy-homelab HOST_PORT=8081"
	@echo ""
	@echo "----------------------------------------------------------------------"
	@echo "  Development & Setup"
	@echo "----------------------------------------------------------------------"
	@echo "  $(BLUE)make start$(NC)             - Run the Angular dev server."
	@echo "  $(BLUE)make install$(NC)           - Install npm dependencies."
	@echo "  $(BLUE)make install-deps$(NC)      - Install global dependencies like Firebase CLI."
	@echo "  $(BLUE)make clean$(NC)             - Remove node_modules."
	@echo "  $(BLUE)make rename-project$(NC)    - Rename project using PROJECT_NAME and APP_ID."
	@echo "  $(BLUE)make init-firebase$(NC)     - Initialize a new Firebase project."
	@echo "  $(BLUE)make merge-upstream$(NC)    - Merge updates from the template repository."
	@echo ""
