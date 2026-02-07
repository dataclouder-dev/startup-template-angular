# Understanding Ionic & Capacitor Commands

This reference explains the CLI commands used to develop, build, and run the Dataclouder template projects. It also clarifies the custom abstractions found in `package.json`.

---

## 🛠️ The Two CLI Toolkits

The project uses both **Ionic CLI** and **Capacitor CLI**. 

- **Ionic CLI (`ionic`)**: Focuses on the web environment, layout generation, and high-level platform runs.
- **Capacitor CLI (`npx cap`)**: Focuses on the native bridge, syncing web assets to native projects (`/ios`, `/android`), and opening native IDEs (Android Studio/Xcode).

you will now which CLI are you using by the name of the command. 

`ionic cap run  -> ionic CLI` but may buse cap internally 
`npx cap run -> capacitor CLI` b

The bad news i noticed is both are used depending on what you want to do, and ionic my change cap commands, no not always are equivalent. 

ionic capacitor open android
npx cap open android


> [!TIP]
> Use `ionic cap run` when you want a "live reload" experience where the app refreshes as you save code. Use `npx cap` for low-level project synchronization.

---

## 📜 Custom Scripts (package.json)

The `package.json` contains several "shorthand" commands to automate complex flows.

### iOS Commands
- `npm run ios:dev`: Builds the app with development configuration and launches it on a connected iOS device.
- `npm run ios:prod`: Builds the app with production optimizations and launches it with the "Release" configuration.
- `npm run ios:dev-sim`: Specifically targets a simulator (requires the simulator ID).

### Android Commands
- `npm run android:debug`: The fastest way to develop. Uses `ionic cap run` with live reload (`-l`) and external access (`--external`). that means will ask you for what device to use, and changes will reflected in real time. 
- `npm run android:install-dev`: A complete automation. Builds dev -> copies to Android -> compiles APK via Gradle -> installs via ADB -> launches the app.
- `npm run android:install-pro`: same as above but with production flags.

### Native Project Management
- `npx cap sync`: Crucial command. It updates native dependencies and copies the latest web build into the native folders.
- `npx cap open android`: Opens the project in Android Studio.
- `npx cap open ios`: Opens the project in Xcode.


### Build app for production

Problem with build, is that connections can't be http, so that means any backend request should be https.  
means that no more experimented everything should be ready. 



---

## 🤖 Why the Abstractions?

The scripts like `android:install-dev` are created because native development involves many steps:
1. `ng build`: Compile Angular.
2. `cap copy`: Move files.
3. `gradlew assemble`: Compile the APK.
4. `adb install`: Push to phone.

The template automates this so you can focus on the logic, but the AI and Developers should know that if a command fails, they should check the individual steps (e.g., check if the phone is connected via `adb devices`).
