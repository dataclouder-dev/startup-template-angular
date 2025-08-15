import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, lastValueFrom, tap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

function toPlainObject(objectClass: any) {
  return JSON.parse(JSON.stringify(objectClass));
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpClient = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  private getHostUrl(host: string = ''): string {
    if (host === 'python') {
      return environment.backendPythonUrl;
    }
    return environment.backendNodeUrl;
  }

  public postDataToService<T = any>(service: string, data: any, host = 'nodejs'): Promise<T> {
    const url = `${this.getHostUrl(host)}/${service}`;
    const dataPlain = toPlainObject(data);
    const response$ = this.httpClient.post<T>(url, dataPlain).pipe(
      // tap(this.pipeCheckAppStatus.bind(this)),
      catchError(err => {
        this.handleError(err);
        return throwError(() => err);
      })
    );

    return lastValueFrom<T>(response$);
  }

  public putDataToService<T = any>(service: string, data: any, host = 'nodejs'): Promise<T> {
    const url = `${this.getHostUrl(host)}/${service}`;
    const dataPlain = toPlainObject(data);
    const response$ = this.httpClient.put<T>(url, dataPlain).pipe(
      catchError(err => {
        this.handleError(err);
        return throwError(() => err);
      })
    );

    return lastValueFrom<T>(response$);
  }

  public async getDataFromService<T = any[]>(service: string, host = 'nodejs', skipErrorHandling = false) {
    const url = `${this.getHostUrl(host)}/${service}`;

    const get$ = this.httpClient.get<T>(url).pipe(
      catchError(err => {
        if (!skipErrorHandling) {
          this.handleError(err);
        }
        return throwError(() => err);
      })
    );

    return lastValueFrom<T>(get$);
  }

  public async putDataFromService(service: string, data: any, host = 'nodejs') {
    const url = `${this.getHostUrl(host)}/${service}`;
    const put$ = await this.httpClient.put<any>(url, data).pipe(
      catchError(err => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
    return lastValueFrom<any>(put$);
  }

  // public async getDataFromAPI<T = any[]>(service: string, host = 'nodejs') {
  //   const url = `${this.getHostUrl(host)}/${service}`;

  //   const get$ = this.httpClient.get<T>(url, { observe: 'response' }).pipe(
  //     tap(this.pipeCheckAppStatus.bind(this)),
  //     catchError((err) => {
  //       this.handleError(err);
  //       return throwError(() => err);
  //     }),
  //     map((response) => response.body),
  //   );

  //   return lastValueFrom<T>(get$);
  // }

  public async deleteDataFromService(service: string, host = 'nodejs'): Promise<any> {
    const url = `${this.getHostUrl(host)}/${service}`;
    const delete$ = await this.httpClient.delete<any>(url).pipe(
      catchError(err => {
        this.handleError(err);
        return throwError(() => err);
      })
    );
    return lastValueFrom<any>(delete$);
  }

  private pipeError(err: HttpErrorResponse) {
    this.handleError(err);
    return throwError(() => err);
  }

  public postObservable<ReturnType, DataType>(service: string, data: DataType, skipErrorHandling = false, host = 'nodejs'): Observable<ReturnType | any> {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;
    return this.httpClient.post<ReturnType>(url, data).pipe(
      catchError(err => {
        if (!skipErrorHandling) {
          this.handleError(err);
        }
        return throwError(() => err);
      })
    );
  }

  public async postFile(service: string, data: any, host = 'nodejs') {
    // use this to get raw response, file with headers simple versión getFile$
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;
    const response$ = this.httpClient.post(url, data, { observe: 'response', responseType: 'blob' }).pipe(
      catchError(async (err: HttpErrorResponse) => {
        // Convert blob error response to JSON

        if (err.error instanceof Blob) {
          try {
            const errorText = await err.error.text();
            (err as any).error = JSON.parse(errorText);
            console.log(errorText);
          } catch (e) {
            console.log(e);
            // If parsing fails, create a generic error
            (err as any).error = { error_message: 'Error processing file', explanation: 'Unable to process server response' };
          }
        }
        this.handleError(err);
        return throwError(() => err);
      })
    );
    return lastValueFrom(response$);
  }

  public deleteObservable<ReturnType>(service: string, host = 'nodejs'): Observable<ReturnType> {
    const hostUrl = this.getHostUrl(host);
    const url = `${hostUrl}/${service}`;

    return this.httpClient.delete<ReturnType>(url).pipe(
      // Estrategía de catch and rethrow solo para mostrar el mensaje en alert
      catchError(err => {
        this.handleError(err);
        return throwError(err);
      })
    );
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 0) {
      console.error('No es posible conectar con el servidor', 'Revisa tu conexión a internet');
      // alert('No es posible contactar con el servidor');
      // this.router.navigateByUrl('/auth/login');
    } else if (err.status === 211) {
      // probablmente nunca vea esta linea en accion pero solo por si acaso le pase a alguien
      console.log('refreshing token...');
    } else {
      const error: any = err.error;
      const message = error?.error_message || 'Ocurrió un problema';
      const explanation = error?.explanation || 'Si el error persiste contactanos por cualquier red social';
      console.error(message, explanation);
    }
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
