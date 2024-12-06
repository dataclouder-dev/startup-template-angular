PROJECT_ID="prota-roto-25b"
DISPLAY_NAME="Prota Roto"

# make sure you have firebase-tools installed
echo "_____Installing Firebase tools _____"
# npm install -g firebase-tools

# login with firebase
echo "____ login with Firebase______"
# firebase login

echo "____ change .firebaserc or init so project can be as default for next instructions ____"

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
