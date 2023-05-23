import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
@Injectable({
  providedIn: 'root'
})
export class GuardLoginService {

  constructor(private _router:Router, private cookieService : CookieService) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean{
    // Vérifier si le cookie existe
    const cookieExist : boolean = this.cookieService.check('userId')
    // si le cookie existe alors on redirege vers la page de home
    if(!cookieExist){
      this._router.navigate(['/se_connecter'])
      return false
    }

    return true;
  }
}
