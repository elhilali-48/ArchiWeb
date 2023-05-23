import { HttpClient } from '@angular/common/http';
import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-afficher-enseignant',
  templateUrl: './afficher-enseignant.component.html',
  styleUrls: ['./afficher-enseignant.component.css']
})
export class AfficherEnseignantComponent {
  email : string = "";
  nom : string = "";
  prenom : string = "";
  sexe: string = "";
  createdAt : string ="";
  date : Date ;
  data : any;
  constructor(private route : ActivatedRoute, private http : HttpClient){}

  ngOnInit(){
    this.route.params.subscribe(params => {

      const url = `http://localhost:3500/enseignant/get/${params['id']}`

      this.http.get<any>(url).subscribe(res=>{

        this.email = res.user_id.email
        this.nom = res.nom
        this.prenom = res.prenom
        this.sexe = res.sexe
        this.date = res.dateNaissance
        this.createdAt = res.createdAt


      },err=>{
        console.log(err.error)
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    });
  }

}
