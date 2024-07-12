import { HttpRequest, HttpHandlerFn, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../selectors/auth.selectors';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  if (req.url.startsWith('http://localhost:9002/todos') || req.url.startsWith('http://localhost:9002/todo')) {
    const store = inject(Store);

    return store.select(selectAuthToken).pipe(
      mergeMap((token) => {
        const headers = new HttpHeaders().set('token', `${token}`);
        const authReq = req.clone({headers});
        return next(authReq);
      })
    );
  } else {
    return next(req);
  }
};
