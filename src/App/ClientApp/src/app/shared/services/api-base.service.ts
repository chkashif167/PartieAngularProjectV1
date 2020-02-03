

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { map, catchError } from 'rxjs//operators';

import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { UtilityService } from '@partie/core/services/utility.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';

@Injectable()
export class ApiBaseService {

  protected baseUrl = '';
  protected cdnBaseUrl = '';
  private messages = '';

  private httpRequestsInProgress:string[];

  constructor(private readonly http: HttpClient,
    protected readonly configurationService: ConfigurationService,
    protected readonly utilityService: UtilityService,
    protected readonly uiUpdateManager:UiUpdatesManagerService) {

    this.baseUrl = configurationService.gatewayApiUrl;
    this.cdnBaseUrl = configurationService.getCdnBaseUrl;
    this.httpRequestsInProgress = new Array<string>();

  }

  protected get<T>(id: any, endpoint: string): Observable<T> {

    const url = this.createUrl(endpoint, id);
    return this.http.get(url).pipe(map((response: T) => this.trimResponse(response, endpoint) as T));
  }

  protected post<TInput, TOutput>(model: TInput, endpoint: string, disableMultipleRequests:boolean = true): Observable<TOutput> {

    if (disableMultipleRequests) {
      if (this.httpRequestsInProgress.filter(x => x === endpoint).length > 0) {
         console.log(`Blocked duplicate call for endpoint: ${endpoint}`);  return empty();
      }
      this.httpRequestsInProgress.push(endpoint);
    }
    

    const url = this.createUrl(endpoint, null);

    return this.http.post(url, model)
      .pipe(catchError((resp: HttpErrorResponse) => this.handleErrorResponse(resp, endpoint)))
      .pipe(map((response: any) => this.trimResponse(response, endpoint) as TOutput));
   
  }

  // Handle API errors
  private handleErrorResponse(error: HttpErrorResponse, endpoint:string) {
    this.httpRequestsInProgress = this.httpRequestsInProgress.filter(x => x !== endpoint);

    //return throwError (error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, Description: ${error.error.title}`);
      console.log('Error Response Details:', error.error);
    }
    return empty();
  }

  protected postWithFile(formData: FormData, endpoint: string): Observable<HttpEvent<any>> {
  
    const options: {
      observe: 'events';
      reportProgress: boolean;
    } = {
      reportProgress: true,
      observe: 'events'
    };

    const url = this.createUrl(endpoint, null);

    return this.http.post(url, formData, options);
  }

  protected delete<T>(id: any, endpoint: string): Observable<T> {

    const url = this.createUrl(endpoint, id);
    return this.http.delete(url).pipe(map((response: any) => this.trimResponse(response, endpoint) as T));
  }

  private createUrl(endpoint: string, id: any): string {

    const lastCharBaseUrl = this.baseUrl.substring(this.baseUrl.length - 1, this.baseUrl.length);
    const firstCharEndPoint = endpoint.substring(0, 1);
    const endpointSubString = endpoint.substring(1, endpoint.length);

    if (lastCharBaseUrl === '/' && firstCharEndPoint === '/') {
      this.baseUrl = this.baseUrl;
      endpoint = endpointSubString;
    }

    return id === null
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}${endpoint}/${id}`;
  }

  private trimResponse(response: any, endPoint:string, showMessage = false) {

    this.httpRequestsInProgress = this.httpRequestsInProgress.filter(x => x !== endPoint);

    //const data = response.json();
    const data = response;
    if (showMessage && data.messages && data.messages.length > 0) {
      this.messages = this.buildMessageString(data.messages);
    }

    return data;
  }

  private buildMessageString(messages: any): string {

    let message = '';
    for (let msg of messages) {
      message += msg.message + '\n';
    }
    return message;
  }
}
