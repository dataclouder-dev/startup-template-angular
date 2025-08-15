export const environment = {
  projectName: 'Dataclouder Template',
  version: '0.0.19',
  envName: 'DEV',
  production: false,
  authenticationRequired: true,

  backendNodeUrl: 'http://192.168.2.3:8080',
  // backendNodeUrl: 'https://dataclouder-dev-node-server-514401908603.us-central1.run.app',
  // backendPythonUrl: 'http://localhost:8000',
  backendPythonUrl: 'https://dataclouder-dev-python-server-514401908603.us-central1.run.app',

  mobile: {
    appleAppId: 'com.dc-template.app.dev',
    appleRedirectURI: 'https://dataclouder-dev.firebaseapp.com/__/auth/handler',
    androidClientId: '484991861457-chhvmiqtjq22je1nr9m13ouljrdeuhpi.apps.googleusercontent.com', // No la uso
    iosClientId: '484991861457-o3j8n8fv21huerkd0pj8r719jssrtbnh.apps.googleusercontent.com',
  },

  firebase: {
    apiKey: 'AIzaSyC4LDGaigo4TJDSnCToPuIiOkcjJ8OpsoQ',
    authDomain: 'dataclouder-dev.firebaseapp.com',
    projectId: 'dataclouder-dev',
    storageBucket: 'dataclouder-dev.firebasestorage.app',
    messagingSenderId: '514401908603',
    appId: '1:514401908603:web:dac63e04e6b0accd986fde',
  },
};
