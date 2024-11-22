## Dataclouder Template

This project is a template to create Angular/Ionic App connected with firebase auth

* Autentification system is ready. 

* You only need to add the logic. 


### Instructions 

1) Clone the project. 

2) Rename project. 

    * package.json 
    * ionic.config.json
    * environment.ts
    * capacitor.config.ts // Nombre del app. debe ser unico. dev.dataclouder.template cambiar

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

    Crear la credencial 
    Extraer los datos de client Id y reverse client id
    
    Desde la interfaz  puse como variable $(REVERSED_CLIENT_ID) pero ahora aqui solo hay que agregar los datos a los archivos de configuración. 
    Desde la interfaz creé los archivos de configuración para que modifique el pbxproj.

    ### Como crear una configuación para tener un id diferente. 


### Ejecutar App
    npm run start



### Backend 

1) Crear un proyecto de NEST con la plantilla. 
2) Desplegar a Google Cloud. 
