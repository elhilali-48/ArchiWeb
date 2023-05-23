import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  data: any;
  constructor(private http : HttpClient, private cookieService : CookieService, private router : Router){

    this.data = {}

  }

  ngOnInit(){
    // Récupérer l'id à partir du cookie
    const user_id :string = this.cookieService.get('userId')
    const url = "http://localhost:3500/user/getInfo/"+user_id
    if(user_id){
      this.http.get<any>(url).subscribe(res=>{
        this.data = res.data[0]
        console.log(this.data );

      },err=>{
        console.log(err);

      })
    }

  }

  // Se déconnecter
  logout(){

    this.cookieService.deleteAll('userId')
    this.router.navigate(['/'])
  }

}

