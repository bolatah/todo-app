import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export const dateToUnixTimestamp : HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) : Observable<HttpEvent<any>> => {
   if(req.body && req.body.faellig){

    const faelligDate = new Date (req.body.faellig);
    const unixTimestamp= faelligDate.getTime();
    const unixTimeStampValue = Math.floor(unixTimestamp/1000);

    const modifiedReq = req.clone({
        body: {...req.body, faellig: unixTimeStampValue}
    })
      return next(modifiedReq)  
   }
   
    return next(req) 
}