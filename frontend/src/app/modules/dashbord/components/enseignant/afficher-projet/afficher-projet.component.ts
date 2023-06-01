import { HttpClient } from '@angular/common/http';
import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-afficher-projet',
  templateUrl: './afficher-projet.component.html',
  styleUrls: ['./afficher-projet.component.css']
})
export class AfficherProjetComponent {
  titre : string = "";
  description : string = "";
  competencesAcquis: String[] = [];
  competencesRequis: String[] = [];
  createdAt : string ="";
  imagePath : string ="";
  status : string ="";
  etudiantInscrit : number;
  date : Date ;
  data : any;
  constructor(private route : ActivatedRoute, private http : HttpClient){}

  ngOnInit(){
    this.route.params.subscribe(params => {

      const url = `http://localhost:3500/projet/getOneProjet/${params['id']}`

      this.http.get<any>(url).subscribe(res=>{
        this.titre = res.projet.titre
        this.date = res.dateNaissance
        this.createdAt = res.projet.createdAt
        this.description = res.projet.description
        this.etudiantInscrit = res.projet.resultatsEtudiants.length
        this.competencesAcquis = res.projet.competence_acquis
        this.competencesRequis = res.projet.competence_requis
        this.imagePath = res.projet.imagePath
        this.status = res.projet.status


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
