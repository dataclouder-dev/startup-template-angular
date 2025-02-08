# Variables for deployment
PROJECT_ID ?= dataclouder-dev
PROJECT_NAME ?= Dataclouder Template
APP_ID ?= dev.dataclouder.template
DISPLAY_NAME ?= $(PROJECT_NAME)

help:
	@echo "Available commands:"
	@echo "  init-project    - Initialize new Firebase project with configuration"
	@echo "  check-deps     - Check required dependencies"
	@echo "  install-deps   - Install required dependencies"
	@echo "  rename-project - Rename project using provided PROJECT_NAME and APP_ID"
	@echo "  update-dc      - Update DC components"
	@echo "  deploy         - Deploy to Firebase hosting"

rename-project:
	python3 scripts/rename_project.py $(PROJECT_NAME) $(APP_ID)

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

init-project: check-deps
	@echo "Initializing Firebase project..."
	firebase login
	firebase projects:create $(PROJECT_ID) --display-name "$(DISPLAY_NAME)"
	firebase services:enable --project=$(PROJECT_ID) identitytoolkit.googleapis.com
	$(eval SDK_CONFIG := $(shell firebase apps:create WEB $(PROJECT_ID) | grep "firebase apps:sdkconfig"))
	@echo "Configuring Firebase SDK..."
	@$(SDK_CONFIG) > temp_config.txt
	node scripts/update-firebase-config.js "$$(cat temp_config.txt)"
	@rm temp_config.txt
	@echo "Installing project dependencies..."
	npm install
	@echo "Project initialized successfully!"
	@echo "IMPORTANT: Please manually enable authentication providers in Firebase Console"
	@echo "You can now run 'make rename-project' to set up your project name and ID"


deploy:
	npm run build
	firebase deploy --only hosting:$(PROJECT_ID)


deploy-release:
	npm run prebuild
	npm run build:prod
	firebase deploy --only hosting:$(PROJECT_ID)

