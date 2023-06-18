import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerer-projet',
  templateUrl: './gerer-projet.component.html',
  styleUrls: ['./gerer-projet.component.css']
})
export class GererProjetComponent {
  data : any;
  progressionTotal : any;
  sommeProgressions : number = 0;
  resultProgrssion : number;
  progress : number = 0;
  allCompetencesAcquises: boolean = true;
  disableElements: boolean[] = [];
  constructor(private http : HttpClient, private router : Router, private cookie : CookieService, private routeActive : ActivatedRoute){}

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    const id = this.cookie.get("userId");
    const projet = this.routeActive.snapshot.paramMap.get("id") ?? '';
    const url = `http://localhost:3500/projet/getInfoEtudiantProjet/${projet}/${id}`;
    this.http.get<any>(url).subscribe(
      (res) => {
        res.data.forEach((element :any) => {
          if(element._id == projet){
            this.data = element
            this.allCompetencesAcquises = this.data.resultatsEtudiants.competencesAcquises.every((comp: any) => comp.progression === 100);
            this.progressionTotal = element.resultatsEtudiants.competencesAcquises
            const resultatsEtudiants = element.resultatsEtudiants.competencesAcquises;
            if (resultatsEtudiants.length > 0) {
              const firstElementProgression = resultatsEtudiants[0].progression;
              this.disableElements = resultatsEtudiants.map((comp : any) => comp.progression !== firstElementProgression);
            }
            for (let i = 0; i < element.resultatsEtudiants.competencesAcquises.length; i++) {
              this.sommeProgressions += element.resultatsEtudiants.competencesAcquises[i].progression;
            }

            this.resultProgrssion = (this.sommeProgressions/element.resultatsEtudiants.competencesAcquises.length)
          }
        });
      },
      (err) => {
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        });
      }
    );
  }

  changeStatus(id_comp: string,status : string){
    const id_user = this.cookie.get("userId");
    const id_projet = this.routeActive.snapshot.paramMap.get("id") ?? '';

    const url = "http://localhost:3500/projet/changerStatus"
    const data = {
      id_user : id_user,
      id_projet : id_projet,
      id_comp,
      status
    }
    this.http.post<any>(url,data).subscribe(res=>{
      this.loadData()
      Swal.fire('Compétence modifié!', '', 'success')
    },err=>{
      //Error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.error,
      })
    })

  }
  onChangeProgression(event : Event, id_comp : string){
    const progress = (event.target as HTMLInputElement).value;
    const id_user = this.cookie.get("userId");
    const id_projet = this.routeActive.snapshot.paramMap.get("id") ?? '';

    const url = "http://localhost:3500/projet/changerStatus"
    const data = {
      id_user : id_user,
      id_projet : id_projet,
      id_comp,
      progress
    }
    this.http.post<any>(url,data).subscribe(res=>{
      this.loadData()
    },err=>{
      //Error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.error,
      })
    })
  }

  terminerProjet(){
    const id_user = this.cookie.get("userId");
    const id_projet = this.routeActive.snapshot.paramMap.get("id") ?? '';

    const url = "http://localhost:3500/projet/cloturerProjet"
    const data = {
      id_user : id_user,
      id_projet : id_projet,
    }
    this.http.post<any>(url,data).subscribe(res=>{
      Swal.fire('Félicitation Vous avez terminé le projet', '', 'success')
    },err=>{
      //Error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.error,
      })
    })
  }
}
