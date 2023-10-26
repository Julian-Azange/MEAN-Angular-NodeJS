import { AuthService } from './../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarToken()
    .pipe(
      tap( valid => {
        if ( !valid ){
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.validarToken()
    .pipe(
      tap( valid => {
        if ( !valid ){
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
