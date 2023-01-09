import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SystemValues } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  constructor(private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const sys = new SystemValues();
    if (sys.IsUsrLoggedIn) { return true; }

   else{ 
    // alert("hello")
    const bankName = localStorage.getItem('__bName');
    localStorage.clear();
    
    localStorage.setItem('__bName', bankName);
    // this.router.navigate([bankName + '/login']);
    return false;
   }
    
  }
}
