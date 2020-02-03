
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

//Services
import { AuthService } from '@partie/core/services/auth.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {

  tokenFreeUrls: string[];

  constructor(private readonly authService: AuthService,
  private readonly configurationService: ConfigurationService) { }

  //function which will be called for all http calls
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let updatedRequest = request;

    const authHeaderValue = this.authService.getAuthorizationHeaderValue();

    if (authHeaderValue && this.allowAuthTokenInRequestHeader(updatedRequest)) {
      updatedRequest = request.clone({
        headers: request.headers.set("Authorization", authHeaderValue)
      });
    }


    console.log("Before making api call : ", updatedRequest);

    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            console.log("api call success :", event);
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            console.log("api call error :", event);
          }
        }
      )
    );
  }

  private allowAuthTokenInRequestHeader(httpRequest: HttpRequest<any>): boolean {

    if (!httpRequest.url.toLowerCase().startsWith(this.configurationService.gatewayApiUrl.toLowerCase()))
      return false;

    return true;

  }
}

