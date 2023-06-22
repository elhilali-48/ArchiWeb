import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GetInfoUserService } from 'src/app/service/get-info-user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {
  dataAdmin :any;
  dataEnseignant:any;
  dataEtudiant:any;
  user:any;
  constructor(private http : HttpClient, private router: Router, private cookie : CookieService, private service : GetInfoUserService){

  }

  ngOnInit(){
    this.getInfos()

  //  this.service.getInfo(this.cookie.get('userID')).subscribe((res)=>{
  //   console.log(res)
  //  });
  }

  getInfos(){
    // Récupérer les statistiques selon le role de l'utilisateur
    const id = this.cookie.get("userId")

        // Requete post pour récupérer les infos de l'utilisateur

        const url = `http://localhost:3500/user/statistique/${id}`;

        // Get
        this.http.get<any>(url).subscribe(
          (res) => {
            console.log(res)
            this.user = res.user
            this.dataAdmin = res.statAdmin
            this.dataEnseignant = res.stat
            this.dataEtudiant = res.statEtud
          },
          (err) => {
            console.log(err)
            //Error
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.error,
            });
          }
        );

  }

}
