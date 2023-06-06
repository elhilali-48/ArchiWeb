import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GetInfoUserService } from 'src/app/service/get-info-user.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent {
  data : any;
  titre : string ="";
  description : string = "";
  createdAt : string =""
  id :string="";
  data_etudiant : any;
  constructor(private routeActivated : ActivatedRoute, private router : Router, private http : HttpClient, private cookie : CookieService, private infoService : GetInfoUserService){

  }

  ngOnInit(){
    this.routeActivated.params.subscribe(params=>{
      const url = `http://localhost:3500/projet/getOneProjet/${params['id']}`
      this.http.get<any>(url).subscribe(res=>{
        this.id = params['id']
        this.data = res.projet
        this.titre = res.projet.titre
        this.createdAt = res.projet.createdAt
        console.log(res.projet.status)
      },err=>{
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    })
    const id  = this.cookie.get("userId")
    this.infoService.getInfo(id).subscribe((data)=>{
      this.data_etudiant = data.data[0].info[0]
      console.log(this.data_etudiant)
    },(error)=>{
      console.log(error)
    })

  }
  // S'inscrire dans un projet
  inscrire(id_projet : any){
    const id_user = this.cookie.get('userId')
    const url = 'http://localhost:3500/projet/inscrireProjet';
    const data = {
      id_user,
      id_projet,
    }
    // Post
    this.http.post<any>(url, data).subscribe(
      (res) => {
        console.log(res);

         Swal.fire('Vous etes bien inscrit à ce projet!', '', 'success');
         window.location.reload();
         //this.router.navigate(['/dashbord/mes_projets']);
      },
      (err) => {
        //Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.error,
        });
      }
    );
  }

  // Abondonner un projet

  abandonner(id_projet : string){
    const id_user = this.cookie.get('userId')
    const url = 'http://localhost:3500/projet/abandonnerProjet';
    const data = {
      id_user,
      id_projet,
    }
    // Post
    this.http.post<any>(url, data).subscribe(
      (res) => {
        console.log(res);

         Swal.fire('Vous avez abandonné ce projet!', '', 'success');
         window.location.reload();
        // this.router.navigate(['/dashbord/mes_projets']);
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
