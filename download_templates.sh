# WIP First script example to clone projects 


# 1 create one folder to set yours projects. 
PROJECT_ID="your-project-id"
DISPLAY_NAME="Your Project Name"

echo _____Clonning templates and renaming to ${PROJECT_ID}____

# clone frontend
git clone https://github.com/adamofig/dataclouder-python-fastapi-template.git "${PROJECT_ID}-python"

# clone backend git clone node backend 
git clone https://github.com/adamofig/dataclouder-node-nest-template.git "${PROJECT_ID}-node"

# clone python backend
git clone https://github.com/adamofig/dataclouder-ionic-template.git "${PROJECT_ID}-angular"


# # make sure you have firebase-tools installed
echo _____Installing Firebase tools _____
npm install -g firebase-tools

# # login with firebase
echo ____ login with Firebase______
firebase login

# # create a new project, create google cloud and add the firebase resources
# firebase projects:create test-project-jhdn2 --display-name "Test Project 2"

# # (optional) add the firebase init to your project
# firebase init


# # get web credentials
# firebase apps:create WEB test-project-jhdn2-web
# # print commands to get credentials 

# firebase apps:sdkconfig WEB 1:44192249350:web:f41ea70c4c85d513bef587
# # copy and paste in environment variables. need script to automate this. 

# # activate hosting 
# firebase init hosting

# # deploy only hosting. 
# firebase deploy --only hosting
