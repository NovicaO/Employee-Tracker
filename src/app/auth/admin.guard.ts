import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router){
    }

   canActivate(route:ActivatedRouteSnapshot,  router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean> | Observable<boolean>{
       if(this.authService.user.uid && this.authService.user.isAdmin && this.authService.user.isActivated) {
           return true;
       }
       return this.router.createUrlTree(['/auth']);
  }
    
}