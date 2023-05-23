import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router'

interface DecodedToken {
  id: string;
  // ajouter d'autres propriétés si nécessaire
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  loginForm: FormGroup;

  constructor(private fb:FormBuilder, private http: HttpClient, private cookieService : CookieService, private route : Router) {

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

     // Vérifier si le cookie existe
     const cookieExist : boolean = this.cookieService.check('userId')
     // si le cookie existe alors on redirege vers la page de home
     if(cookieExist){
       this.route.navigate(['/dashbord'])

     }
  }



  onSubmit() {
    if(this.loginForm.valid){
      const url = "http://localhost:3500/user/login"
      const data = {
        email : this.loginForm.get('email')?.value,
        password : this.loginForm.get('password')?.value
      }
      this.http.post<any>(url,data).subscribe(res=>{
        // Success Add Token
        const decoded : DecodedToken = jwt_decode(res.token);
        const userId = decoded.id

        // Set Cookie
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 50); // Expire after 5 minutes
        this.cookieService.set('userId', userId, expires);

        Swal.fire('Connexion réusi!', '', 'success')
        this.route.navigate(['/dashbord']);

      },err=>{
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    }
  }

}
