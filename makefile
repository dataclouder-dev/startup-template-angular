
# Variables for deployment
PROJECT_ID ?= dataclouder-dev
IMAGE_NAME ?= python-app-image
REGION ?= us-central1
SERVICE_NAME ?= python-server

help:
	@echo "Available commands:"

update-dc:
	npm run update:dc


deploy:
	npm run prebuild
	npm run build
	firebase deploy --only hosting:$(PROJECT_ID)


