export const environment = {
  projectName: 'Dataclouder Template',
  version: '0.0.11',
  envName: 'DEV',
  production: true,

  authenticationRequired: true,

  // backendNodeUrl: 'http://localhost:8080',
  backendNodeUrl: 'https://node-server-514401908603.us-central1.run.app',
  // backendPythonUrl: 'http://localhost:8000',
  backendPythonUrl: 'https://python-server-514401908603.us-central1.run.app',

  mobile: {
    appleAppId: 'com.dc-template.app.dev',
    appleRedirectURI: 'https://dataclouder-dev.firebaseapp.com/__/auth/handler',
    androidClientId: '484991861457-chhvmiqtjq22je1nr9m13ouljrdeuhpi.apps.googleusercontent.com', // No la uso
    iosClientId: '484991861457-o3j8n8fv21huerkd0pj8r719jssrtbnh.apps.googleusercontent.com',
  },

  firebase: {
    apiKey: 'AIzaSyBjUc3umM6iLMcdz6byw1BMfVoQWTO4p-0',
    authDomain: 'dataclouder-dev.firebaseapp.com',
    projectId: 'dataclouder-dev',
    storageBucket: 'dataclouder-dev.firebasestorage.app',
    messagingSenderId: '514401908603',
    appId: '1:514401908603:web:48a12af2f8ce2879986fde',
  },
};
