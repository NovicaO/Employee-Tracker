import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class LoginAuthService implements CanActivate{
    constructor(private authService: AuthService, private router: Router){
    }

   canActivate(route:ActivatedRouteSnapshot,  router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean> | Observable<boolean>{
       if(this.authService.user && this.authService.user.isAdmin && this.authService.user.isActivated) {
          return this.router.createUrlTree(['/admin/tabs']);
       }else if(this.authService.user && !this.authService.user.isAdmin && this.authService.user.isActivated){
          return this.router.createUrlTree(['/employee/tabs']);
       }
       
  }
    
}