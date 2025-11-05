import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private requests: HttpRequest<unknown>[] = [];
  constructor() {}

  removeRequest(req: HttpRequest<unknown>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      url: environment.BACKEND_URL + '/api' + request.url,
    });

    const no_auth = ['/auth/signup', '/auth/login', '/auth/public-key'];
    if (!no_auth.includes(request.url)) {
      const token = sessionStorage.getItem('token');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return new Observable((observer) => {
      const subscription = next.handle(request).subscribe({
        next: (event) => {
          if (event instanceof HttpResponse) {
            observer.next(event);
          }
        },
        error: (err: {
          error: { message: string; statusCode: number };
          status: number;
        }) => {
          observer.error(err);
        },
        complete: () => {
          this.removeRequest(request);
          observer.complete();
        },
      });
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });
  }
}
