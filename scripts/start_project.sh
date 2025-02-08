PROJECT_ID="conviertete-en-alfa"
DISPLAY_NAME="Convierte en Alfa"

# make sure you have firebase-tools installed
echo "_____Installing Firebase tools _____"
# npm install -g firebase-tools

# login with firebase
echo "____ login with Firebase______"
# firebase login

firebase projects:create ${PROJECT_ID} --display-name "${DISPLAY_NAME}"

echo "____ change .firebaserc or init so project can be as default for next instructions ____"

# Enable Firebase Authentication
echo "____ Enabling Firebase Authentication ____"
# firebase services:enable --project=${PROJECT_ID} identitytoolkit.googleapis.com


# Capture the Firebase create output and extract the sdkconfig command
SDK_CONFIG=$(firebase apps:create WEB ${PROJECT_ID} | grep "firebase apps:sdkconfig" | awk '{$1=$1};1')

# Now SDK_CONFIG contains the full command
echo "Extracted command: $SDK_CONFIG"

# Execute the SDK config command and store output in a temporary file
eval "$SDK_CONFIG" > temp_config.txt

echo "=== Content of temp_config.txt ==="
cat temp_config.txt
echo "=== End of temp_config.txt ==="

# Extract just the configuration object from the temporary file and ensure it's valid JSON
CONFIG_ONLY=$(cat temp_config.txt | sed -n '/firebase.initializeApp({/,/});/p' | grep -v "firebase.initializeApp(" | grep -v "});" | sed 's/^[[:space:]]*//')

# Wrap the configuration in curly braces to make it valid JSON
CONFIG_JSON="{
$CONFIG_ONLY
}"

echo "=== Extracted Configuration ==="
echo "$CONFIG_JSON"
echo "=== End of Configuration ==="

# Clean up temporary file
rm temp_config.txt

# Update the environment.ts file with Firebase config
echo "____ Updating Firebase configuration in environment.ts ____"

node update-firebase-config.js "$CONFIG_JSON"

echo "____ Installing dependencies ____"

npm run install


echo ___ Ready you can run or deploy use npm run start or firebase deploy ____

# Closest method to automate this is using the Web Api
#curl -X POST https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/defaultAuthProviders:update' \
#  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' --header 'Content-Type: application/json' \
#  --data '{ "enabledAuthProviders": [ "google.com", "password" ] }'

# TODO: Automate the step bellow
echo "____ don't forget to rename the from root auto_start/rename_project.py poderdelguion com.poderdelguion.app ____"

echo ___ unfortunately there is not method to enable autentication option so go to firebase console and enable it manually ____


