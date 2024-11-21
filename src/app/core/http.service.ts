import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, lastValueFrom, tap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { environment } from 'src/environments/environment';
import { AppExeption } from './classets';
import { AppHttpCode } from './enums';
// import { NGXLogger } from 'ngx-logger';

// import { UtilsService } from '../utils.service';
// import { environment } from '../../../environments/environment';
// import { DeletedData } from '../../core/classes';
// import { AppExeption } from '../classes';
// import { ToastService } from './toast.service';
// import { FirebaseAuthService } from '../firebase-auth.service';
// import { AppHttpCode } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    // private toastrService: ToastService,
    // private logger: NGXLogger,
    // private utilsService: UtilsService,
    private httpClient: HttpClient,
    private firebaseAuthService: FirebaseAuthService,
  ) {}

  public postDataToService<T = any>(service: string, data: any, host = 'nodejs'): Promise<T> {
    const url = `${this.getHostUrl(host)}/${service}`;
    // const dataPlain = this.utilsService.toPlainObject(data);
    // TODO necesito el plain? 
    const response$ = this.httpClient.post<T>(url, data).pipe(
      tap(this.pipeCheckAppStatus.bind(this)),
      catchError((err) => {
        this.handleError(err);
        return throwError(() => err);
      }),
    );

    return lastValueFrom<T>(response$);
  }

  public putDataToService<T = any>(service: string, data: any, host = 'nodejs'): Promise<T> {
    const url = `${this.getHostUrl(host)}/${service}`;
    // const dataPlain = this.utilsService.toPlainObject(data);
    const response$ = this.httpClient.put<T>(url, data).pipe(
      catchError((err) => {
        this.handleError(err);
        return throwError(() => err);
      }),
    );

    return lastValueFrom<T>(response$);
  }

  public async getDataFromService<T = any[]>(service: string, host = 'nodejs', skipErrorHandling = false) {
    const url = `${this.getHostUrl(host)}/${service}`;

    const get$ = this.httpClient.get<T>(url).pipe(
      catchError((err) => {
        if (!skipErrorHandling) {
          this.handleError(err);
        }
        return throwError(() => err);
      }),
    );

    return lastValueFrom<T>(get$);
  }

  public async getDataFromAPI<T = any[]>(service: string, host = 'nodejs') {
    const url = `${this.getHostUrl(host)}/${service}`;

    const get$ = this.httpClient.get<T>(url, { observe: 'response' }).pipe(
      tap(this.pipeCheckAppStatus.bind(this)),
      catchError((err) => {
        this.handleError(err);
        return throwError(() => err);
      }),
      map((response) => response.body),
    );

    return lastValueFrom<T>(get$);
  }

//   public async deleteDataFromService(service: string, host = 'nodejs'): Promise<DeletedData> {
//     const url = `${this.getHostUrl(host)}/${service}`;
//     const delete$ = await this.httpClient.delete<DeletedData>(url).pipe(
//       catchError((err) => {
//         this.handleError(err);
//         return throwError(() => err);
//       }),
//     );
//     return lastValueFrom<DeletedData>(delete$);
//   }

  public getObservable<T>(service: string, host = 'nodejs'): Observable<T> {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;
    return this.httpClient.get<T>(url, { observe: 'response' }).pipe(
      tap(this.pipeCheckAppStatus.bind(this)),
      catchError(this.pipeError.bind(this)),
      map((response) => response.body),
    );
  }

  private pipeCheckAppStatus(response: any) {
    // reviso el tipo de status para hacer acciones adicionales
    // agregar este tap a todos los métodos que necesiten verifcar el status.
    // necesito bind para acceder a las variables locales
    if ([AppHttpCode.GoodRefreshToken, AppHttpCode.ErrorRefreshToken].includes(response.status)) {
      this.firebaseAuthService.refreshToken();
    }
  }

  private pipeError(err: HttpErrorResponse) {
    this.handleError(err);
    return throwError(() => err);
  }

  public postObservable<ReturnType, DataType>(
    service: string,
    data: DataType,
    skipErrorHandling = false,
    host = 'nodejs',
  ): Observable<ReturnType | any> {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;
    return this.httpClient.post<ReturnType>(url, data).pipe(
      catchError((err) => {
        if (!skipErrorHandling) {
          this.handleError(err);
        }
        return throwError(() => err);
      }),
    );
  }

  public deleteObservable<ReturnType>(service: string, host = 'nodejs'): Observable<ReturnType> {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;

    return this.httpClient.delete<ReturnType>(url).pipe(
      // Estrategía de catch and rethrow solo para mostrar el mensaje en alert
      catchError((err) => {
        this.handleError(err);
        return throwError(err);
      }),
    );
  }

  // NOTE : este método es único solo para la creación, no utilizar en la actualización
  public async createUserData(userData: any, id: string): Promise<any> {
    const url = `${environment.backUrl}/user/${id}`;
    // this.logger.debug('Guardando usuario', url);
    // const dataPlain = this.utilsService.toPlainObject(userData);
    // const response = await this.httpClient.post(url, dataPlain).toPromise();
    // return response;
    return null;
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 0) {
    //   this.toastrService.error('No es posible conectar con el servidor', 'Revisa tu conexión a internet');
      // alert('No es posible contactar con el servidor');
      // this.router.navigateByUrl('/auth/login');
    } else if (err.status === AppHttpCode.ErrorRefreshToken) {
      // probablmente nunca vea esta linea en accion pero solo por si acaso le pase a alguien
      console.log('refreshing token...');
      this.firebaseAuthService.refreshToken();
    //   this.toastrService.warn('El token caduco', 'Todo bien, refrescando token...');
    } else {
      const error: AppExeption = err.error;
      const message = error?.error_message || 'Ocurrió un problema';
      const explanation = error?.explanation || 'Si el error persiste contactanos por cualquier red social';
    //   this.toastrService.error(message, explanation);
    }
  }

  private getHostUrl(host: string): string {
    return host === 'python' ? environment.backUrl : environment.backApisUrl;
  }

  public async uploadAudioFile(service: string, blobFile: Blob, jsonParams = null, host = 'nodejs'): Promise<any> {
    const data = JSON.stringify(jsonParams);

    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;

    const formData = new FormData();
    formData.append('file', blobFile);

    const response$ = this.httpClient.post(url, formData, { headers: { metadata: data } });
    return lastValueFrom(response$);
  }

  public async receiveFile(service: string, data: any, host = 'nodejs') {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;
    const response$ = this.httpClient.post(url, data, { observe: 'response', responseType: 'blob' });
    return lastValueFrom(response$);
  }
}
