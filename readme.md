# 🌩 Dataclouder Template Angular/Ionic

A ready-to-use Angular/Ionic template with Firebase Authentication integration.

> ⚠️ **Note**: This project is currently under development and may contain bugs.

## ✨ Features


## 🚀 Quick Start


1. Navigate to auto_start directory:
   ```bash
   cd auto_start
   ```

2. Run the start project script:
   ```bash
   sh start_project
   ```

    git clone https://github.com/adamofig/dataclouder-template-ionic.git optional-renaming

### Option 2: Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/adamofig/dataclouder-template-ionic.git [optional-project-name]
   ```

run the command
    ```python3 rename_project.py your-project-name com.your-project-name.app```

There is a script to rename the project, which will rename all the files and folders.

    * package.json 
    * ionic.config.json
    * environment.ts
    * capacitor.config.ts // The app name must be unique. Change dev.dataclouder.template

You need: 
Project name: your-app-name
App ClientIds: com.your-web-page.app-name

Example: 
    python3 rename_project.py lobo-alfa com.loboalfa.app

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project (or use existing)
2. Copy Firebase credentials to `environment.ts`
3. Enable Authentication methods:
   - Navigate to Firebase Console → Authentication
   - Enable Email/Password and Google sign-in
   - Add authorized domains (localhost is included by default)

Create the project in firebase, and set the credentials for angular project. 
```sh start_project```


Basically this is the flow for the autostart

![alt text](./docs/image.png)


### Change the Firebase credentials. 

Get credentials from the Firebase console (create a new project if you don't have one).
Copy and paste the credentials in the environment.ts.

That's all at this point. You should be able to run the app and be able to sign up using email or Google.

    npm run start

### Add storage to Firebase.
* You need to change the project to Firebase Blaze and add a billing account.
* Initialize Storage in the console and set rules (testing rules to start).

### Change Android and iOS IDs. Future work...

    Android (Pending)
    *   build.gradle
    *   strings.xml
    * MainActivity.java -> This concerns me as it is a package name.

    iOS
    *   project.pbxproj
    * Info.plist

2) Add Firebase variables in the environment.ts. Make sure your app is set with permissions to localhost. 

* Go to Firebase Authentication https://console.firebase.google.com/project/[your-project]/authentication
* Add email authentication, add Google authentication 
* Check authorized domains, by default it is localhost. 
* Go to project settings -> your apps and create a new app or get the Firebase data if you already have it. Save this data in environment.ts.
* Done. Sign in and verify at https://console.firebase.google.com/project/[your-project]/authentication/users that you have your new user. 

3) Publish the web app. 

* Enable hosting at https://console.firebase.google.com/project/[your-project]/apphosting

* npm install -g firebase-tools

    firebase init hosting --project dataclouder-pro 
    Answer the questions 
    directory -> www, single-page app: y -> GitHub no -> override yes

    This is just to get the firebase.json and .firebaserc files (you can also copy them).



# Deploy to firebase 

### Manual deploy 

```bash 
    npm run build
    firebase deploy --only hosting:dataclouder-pro
    firebase deploy --only hosting:dataclouder-dev : change .firebaserc to dataclouder-dev
```

#### deploy using make 

make deploy


### Automatic deploy 
Pending... 
connect with Google Cloud Trigger.s


# 4) Add Android

    1) To avoid delaying other steps, it is best to create your certificate right away. 
        * Reasons: It is required for publication and for multiple environments to work. 
        * It is required for Google login.
        
    2) Create keystore. 

        * Navigate to the android folder. cd android/app

        * keytool -genkey -v -keystore dataclouder.keystore -alias pro -keyalg RSA -keysize 2048 -validity 10000

        * Prepare to answer:
            name: jordan
            unit: dev
            organization: dataclouder
            city: cdmx
            province: cdmx
            country code: mx
            confirm: y

        * Optional: Create a second key for another environment for greater security, or use the same one for speed and convenience.
        keytool -genkey -v -keystore dataclouder.keystore -alias dev -keyalg RSA -keysize 2048 -validity 10000

        pass: Hola1234

    3) Obtain the corresponding certificates and save them in the credentials.
    keytool -list -v -keystore dataclouder.keystore

        * Go to Google Cloud Console, https://console.cloud.google.com/apis/credentials?project=[your-project], you will see a default Firebase one used by the web.
    
        * Create an Android client -> Create OAuth client ID

        * Create an Android certificate.

        * (Optional) Add the consent screen.

        * Select your universal ID dev.dataclouder.template.

    4) Add Android to the project (ionic add android is already done but only to compare file changes) or make file configurations. 

        * Build Gradle is already prepared, change the variables and environment names / TODO: See if I can change the variables.

        * Modify the main project files.

        * Run the project and test Google authentication.

# Add iOS
    1) Create the iOS authentication credential.
    2) Extract the client ID and reverse client ID data in the Additional Information section.
    
    TODO: Understand how to extract the developer team, script to change the developer team 97TH9F3GM9. 
    
    From the interface, I set it as a variable $(REVERSED_CLIENT_ID) but here you just need to add the data to the configuration files. 
    From the interface, I created the configuration files to modify the pbxproj.

## 🚀 Development

Start the development server:
```bash
npm run start
```

## 📄 License

### Backend 

This project also comes with ready to use backend in Nest.js and Python FastAPI.

-> https://github.com/adamofig/dataclouder-python-template

-> https://github.com/adamofig/dataclouder-template-node


1) Create a NEST project with the template. 

## 2) Deploy to Google Cloud. 

Very easy step if you want to automate the deployment on Google Cloud. 

#### 1) Create a new project in Google Cloud. 
Or use the existing one.

#### 3) Add the secrets for environments ts or upload your environment to your source code if project is private. 


#### 2) Create firebase docker images to compile as intermediate steps. 

#### 3) Create a new trigger. 







