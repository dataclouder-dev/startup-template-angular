### Work in Progress
    If you see this project by accident, be aware that it is very buggy at this point.
    
## Dataclouder Template

This project is a template to create an Angular/Ionic App connected with Firebase Auth.

* Authentication system is ready. 
* You only need to add the logic. 


### Getting starting
Use the scripts to download projects and use start_project script in every template.
create the folder to contain all your projects.
donwload the download-templates.sh script change name for project name and id, and run it. 
download-templates.sh : should download all projects and future will install all the dependencies. 


### Instructions 

1) Clone the project. 

    git clone https://github.com/adamofig/dataclouder-template-ionic.git optional-renaming

2) Rename the project. use the AutoStarts scripts


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

### AutoStarts (WIP...)

There is a better way to use the auto starts

```cd auto_start```

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

4) Add Android

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

### Add iOS

    1) Create the iOS authentication credential.
    2) Extract the client ID and reverse client ID data in the Additional Information section.
    
    TODO: Understand how to extract the developer team, script to change the developer team 97TH9F3GM9. 
    
    From the interface, I set it as a variable $(REVERSED_CLIENT_ID) but here you just need to add the data to the configuration files. 
    From the interface, I created the configuration files to modify the pbxproj.

    ### How to create a configuration to have a different ID. 

### Run the App

    npm run start

### Backend 

1) Create a NEST project with the template. 
2) Deploy to Google Cloud. 

python rename_project.py lobo-alfa
