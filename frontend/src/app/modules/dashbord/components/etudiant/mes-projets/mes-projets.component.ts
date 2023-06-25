import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mes-projets',
  templateUrl: './mes-projets.component.html',
  styleUrls: ['./mes-projets.component.css']
})
export class MesProjetsComponent {
  // Attribut :
  id : string ="";
  data : any[];

  constructor(private http : HttpClient, private router :Router, private cookie : CookieService){

  }
  ngOnInit(){
    // Récupérer l'id de l'utilisateur
    const id = this.cookie.get("userId")

    const url = `http://localhost:3500/projet/mes_projets/${id}`
    this.http.get<any>(url).subscribe(res=>{
      console.log(res)
      this.data = res.data
    },err=>{
      console.log(err)
      // Error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
      })
    })
  }
  gereProjet(id : string){
    this.router.navigate(['/dashbord/gerer_projet/'+id])
  }
  getProgressionMoyenne(projet: any): number {
    let totalProgression = 0;
    for (const competence of projet.resultatsEtudiants.competencesAcquises) {
      totalProgression += competence.progression;
    }
    const moyenne = totalProgression / projet.resultatsEtudiants.competencesAcquises.length;
    return moyenne;
  }
}
