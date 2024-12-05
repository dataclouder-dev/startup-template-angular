### Work in Progress
    if you see this project by accident be aware that is very buggy at this point.
    
## Dataclouder Template

This project is a template to create Angular/Ionic App connected with firebase auth

* Autentification system is ready. 
* You only need to add the logic. 


### Instructions 

1) Clone the project. 

    git clone https://github.com/dataclouder/dataclouder-template.git

2) Rename project. 

There is an script to rename the project, basically will rename all the files and folders.

    * package.json 
    * ionic.config.json
    * environment.ts
    * capacitor.config.ts // Nombre del app. debe ser unico. dev.dataclouder.template cambiar

you need. 
Project name: your-app-name
Apps ClientIds: com.your-web-page.app-name


Example: 
    python3 rename_project.py lobo-alfa com.loboalfa.app

### change the firebase credentials. 

get createntials from firebase console, (create a new project if you don't have one)
copy and paste the credentials in the environment.ts

Thats all at this point, you should be able to run the app and be able to signup, email or google.

    npm run start

### Add storage to firebase.
* Hay que cambiar proyecto a firebase blaze y agregar una cuenta de facturación.
* Iniciar Storage en la consola y ponerle reglas, (Vale de pruebas para iniciar)

### Change android and ios ids. Future work...

    Android (Pendinte )
    *   build.gradle
    *   strings.xml
    * MainActivity.java -> este me preocupa para es un nombre de paquete,

    Ios
    *   project.pbxproj
    * Info.plist


2) Add firebase variables in the environment.ts make sure your app is set with permisions to localhost. 


* Go to firebase autentication https://console.firebase.google.com/project/[your-project]/authentication
* Agrega autentificación con correo, Agrega autentificación con Google 
* ver a dominios autorizados por default esta localhost. 
* Ve a configuración de proyecto -> tus apps y crea una nueva app o obten los datos de firease si ya la tienes, guarda estos datos en environment.ts
* listo inicia sesión y verifica en https://console.firebase.google.com/project/[tu-proyecto]/authentication/users que tienes tu nuevo usuario. 

3) Publicar web. 

* Activa el hosting https://console.firebase.google.com/project/[your-project]/apphosting

* npm install -g firebase-tools

    firebase init hosting --project dataclouder-pro 
    Contentar las preguntas 
    directory -> www, single-web: y ->  github no -> override yes

    Todo es solo para tener los archivos firebase.json .firebaserc (tambien se puede copiar)


4) Agregar android

    1) Para no retrazar los otros pasos lo mejor es crear tu certificado de una. 
        * Razones: Se requiere para la publicación, y que funcionen varios ambientes, 
        * Se requiere para el login de Google
        
    2) Crear keystore. 

        *   posicionate en la carpeta de android. cd android/app

        *   keytool -genkey -v -keystore dataclouder.keystore -alias pro -keyalg RSA -keysize 2048 -validity 10000

        * Preparado pregunta por 
            name: jordan
            unit: dev
            organization: dataclouder
            city: cdmx
            province: cdmx
            country code: mx
            confirm: y

        * Opcional: Crear una segunda clave para otro ambiente. mayor seguridad, o utiliza la misma para velocidad y practicidad
        keytool -genkey -v -keystore dataclouder.keystore -alias dev -keyalg RSA -keysize 2048 -validity 10000

        pass: Hola1234

    3)  Obtener los certificados correspondientes y guardarlos en las credenciales
    keytool -list -v -keystore dataclouder.keystore


        * Ir a console de google cloud, https://console.cloud.google.com/apis/credentials?project=[your-project] , se verá una default de firbase es la que utiliza la web
    
        * Crear cliente de android  ->  Create OAuth client ID

        * Crear un certificado de android 

        * (Opcional) agregar la pantalla de concentimiento. 

        *  Selecciona tu id universal dev.dataclouder.template, 

    4) Agregar android al proyecto (ionic add android ya esta pero solo para comparar cambios de archivos) o hacer configuraciones de archivos. 

        * Build Gradle ya esta preparado, cambiar las variables y nombres de ambiente / TODO: Ver si puedo cambiar las variables. 

        * Modificar archivos del proyecto principal. 

        * Ejecutar proyecto y probar la autentificación con Google. 



### Agregar iOS

    1) Crear la credencial de autentificación ios:
    2) Extraer los datos de client Id y reverse client id en la sección de Additional information.
    
    TODO: entender como extraer el developer team,  script para cambiar el developer team 97TH9F3GM9. 
    
    Desde la interfaz  puse como variable $(REVERSED_CLIENT_ID) pero ahora aqui solo hay que agregar los datos a los archivos de configuración. 
    Desde la interfaz creé los archivos de configuración para que modifique el pbxproj.

    ### Como crear una configuación para tener un id diferente. 


### Ejecutar App

    npm run start




### Backend 

1) Crear un proyecto de NEST con la plantilla. 
2) Desplegar a Google Cloud. 


python rename_project.py lobo-alfa
