import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HolidayService } from 'src/app/services/holiday.service';

@Injectable({
  providedIn: 'root'
})
export class RouteValidationGuard implements CanActivate {
  constructor(private holidayServiceObj: HolidayService, private route: Router) {

  }

  /**
   * canActivate should return true when user signed in
   * otherwise navigate to authentication page and return false
   * Use HolidayService authValidator function
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verificar si el usuario está autenticado utilizando el servicio HolidayService
    const isUserAuthenticated = this.holidayServiceObj.authValidator();

    if (isUserAuthenticated) {
      // Si el usuario está autenticado, permitir el acceso a la ruta
      return true;
    } else {
      // Si el usuario no está autenticado, navegar a la página de autenticación y denegar el acceso a la ruta
      this.route.navigateByUrl('/');
      return false;
    }
  }
}