import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(url)
      .pipe(
        // catchError(this.handleError<T>())
      );
  }

  public post<T>(url: string, data): Observable<T> {
    return this.http.post<T>(url, data)
      .pipe(
        // catchError(this.handleError<T>())
      );
  }

  public put<T>(url: string, data): Observable<T> {
    return this.http.put<T>(url, data)
      .pipe(
        // catchError(this.handleError<T>())
      );
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url)
      .pipe(
        // catchError(this.handleError<T>())
      );
  }

  // private handleError<T>(result?: T) {
  //   return (error): Observable<T> => {
  //     console.log(error);
  //     let message: any;
  //     if (error.status === 401) {
  //       message = "Su sesión ha caducado.";
  //     } else if (error.status === 500) {
  //       message = error.error.Message + " Para más detalle vea la consola.";
  //     } else if (error.status === 400 || error.status === 409 || error.status === 404 || error.status === 412 || error.status === 422) {
  //       message = error.error;
  //     } else {
  //       message = error.message;
  //     }

  //     if (!message) message = 'Error de servidor interno, para más detalle vea la consola.';

  //     this.showMessage(error.status, error.statusText, message);

  //     return of(result as T);
  //   };
  // }

  // public showMessage(status: number, title: string, message: string): void {
  //   const modal = this.dialog.open(ErrorComponent, {
  //     data: { title: `${status} ${title}`, message: message, statusCode: status }
  //   });

  //   modal.afterClosed().subscribe((response: boolean) => {
  //     if (status === 401) {
  //       localStorage.removeItem("sessionId");
  //       localStorage.removeItem("userId");
  //       localStorage.removeItem("usuario");
  //       this.router.navigate(['login']);
  //     }
  //   });

  // }
}
