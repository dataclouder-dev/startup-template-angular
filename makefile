
# Variables for deployment
PROJECT_ID ?= dataclouder-dev
IMAGE_NAME ?= python-app-image
REGION ?= us-central1
SERVICE_NAME ?= python-server

PROJECT_NAME ?= dataclouder-template
APP_ID ?= com.dataclouder.template



help:
	@echo "Available commands:"

rename-project:
	python3 scripts/rename_project.py $(PROJECT_NAME) $(APP_ID)

update-dc:
	npm run update:dc


deploy:
	npm run prebuild
	npm run build
	firebase deploy --only hosting:$(PROJECT_ID)


