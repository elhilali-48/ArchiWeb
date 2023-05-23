import { Component } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
import {CookieService} from 'ngx-cookie-service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  test ="Abdel"

  constructor(private _router:Router, private cookieService : CookieService) {

  }


}
