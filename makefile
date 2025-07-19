# Variables for deployment
ENV ?= dev
EXT ?= io
PROJECT_NAME ?= dataclouder
PROJECT_ID ?= $(PROJECT_NAME)-$(ENV) #Firebase/Google project ID
APP_ID ?= $(EXT).$(PROJECT_NAME).$(ENV) # User for mobile apps. example com.my-startup.app
DISPLAY_NAME ?= $(PROJECT_NAME)

help:
	@echo "Available commands:"
	@echo "  init-firebase    - Initialize new Firebase project with configuration"
	@echo "  check-deps     - Check required dependencies"
	@echo "  install-deps   - Install required dependencies"
	@echo "  rename-project - Rename project using provided PROJECT_NAME and APP_ID"
	@echo "  update-dc      - Update DC components"
	@echo "  deploy         - Deploy to Firebase hosting"

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

deploy:
	npm run build
	firebase deploy --project $(PROJECT_ID) --only hosting:$(PROJECT_ID)


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
