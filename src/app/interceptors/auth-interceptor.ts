import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const authToken = authService.getToken();

    if (authToken) {
        const authRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${authToken}` }
        });

        return next(authRequest).pipe(
            tap({
                next: (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // Handle successful responses if needed
                    }
                },
                error: (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401 || err.status === 403) {
                            authService.forceLogout();
                        }
                    }
                }
            })
        );
    }
    return next(req);
};
