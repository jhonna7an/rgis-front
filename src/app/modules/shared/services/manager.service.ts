import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(url)
      .pipe(
        catchError(err => this.errorHandler(err)
      ));
  }

  public post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data)
      .pipe(
        catchError(err => this.errorHandler(err))
      );
  }

  public put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data)
      .pipe(
        catchError(err => this.errorHandler(err))
      );
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url)
      .pipe(
        catchError(err => this.errorHandler(err))
      );
  }

  errorHandler(error: HttpErrorResponse) {
    let message = error.error;

    if (error.status === 401 || error.status === 403) {
      message = "Su sesión ha caducado.";
    }

    if (error.status === 500) {
      message = 'Se produjo un error al intentar procesar la solicitud';
    }

    if (error.status === 503) {
      this.router.navigate(['/not-found']);
    }

    return throwError({status: error.status, message: error.error});
  }

  private handleError<T>(result?: T) {
    return (error): Observable<T> => {
      let message: any;
      if (error.status === 401 || error.status === 403) {
        console.log(error.error);
        message = "Su sesión ha caducado.";
      }

      if (!message) message = 'Error de servidor interno, para más detalle vea la consola.';

      // this.showMessage(error.status, error.statusText, message);

      return of(result as T);
    };
  }

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
