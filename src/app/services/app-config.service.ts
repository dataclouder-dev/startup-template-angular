import { inject, Injectable, InjectionToken } from '@angular/core';

export interface IAppConfig {
  projectName: string;
  version: string;
  envName: string;
  production: boolean;
  authenticationRequired: boolean;
  backendNodeUrl: string;
  backendPythonUrl: string;
  clientId: string;
  mobile: {
    appleAppId: string;
    appleRedirectURI: string;
    androidClientId: string;
    iosClientId: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  public config: IAppConfig = inject(APP_CONFIG);
}
