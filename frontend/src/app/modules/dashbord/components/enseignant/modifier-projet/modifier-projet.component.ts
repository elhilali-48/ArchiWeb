import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-modifier-projet',
  templateUrl: './modifier-projet.component.html',
  styleUrls: ['./modifier-projet.component.css']
})
export class ModifierProjetComponent {
  competences: String[] = [];
  competencesRequis: String[] = [];
  nouvelleCompetence: string = '';
  nouvelleCompetenceRequis: string = '';
  titre: string = '';
  description: string = '';
  selectedFile: File | null = null;
  imagePath : string= "";
  id :string ="";


  updateProjetFrom: FormGroup;

  constructor(
    private router: ActivatedRoute,
    private route : Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {
    this.updateProjetFrom = new FormGroup({
      titre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      nouvelleCompetence: new FormControl('', []),
      nouvelleCompetenceRequis: new FormControl('', []),
      image: new FormControl('', []),
    });
  }
  ngOnInit(){
    // Récupérer tous les infos du projet
    this.router.params.subscribe(params => {
      const url = `http://localhost:3500/projet/getOneProjet/${params['id']}`
      this.http.get<any>(url).subscribe(res=>{

        this.id = params['id']
        this.competences = res.projet.competence_acquis
        this.competencesRequis = res.projet.competence_requis
        this.imagePath = res.projet.imagePath

        this.updateProjetFrom.setValue({
          titre : res.projet.titre,
          description :res.projet.description,
          nouvelleCompetence : res.projet.competence_acquis,
          nouvelleCompetenceRequis : res.projet.competence_requis,
          image : ""
        })

      },err=>{
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    })

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }
  ajouterCompetence() {
    console.log(this.competences);
    console.log(this.updateProjetFrom.get('nouvelleCompetence')?.value);
    if (this.updateProjetFrom.get('nouvelleCompetence')?.value.trim() !== '') {
      this.competences.push(
        this.updateProjetFrom.get('nouvelleCompetence')?.value
      );
      this.updateProjetFrom.get('nouvelleCompetence')?.setValue('');
    }
  }
  ajouterCompetenceRequis() {
    console.log(this.competencesRequis);
    console.log(this.updateProjetFrom.get('nouvelleCompetenceRequis')?.value);
    if (
      this.updateProjetFrom.get('nouvelleCompetenceRequis')?.value.trim() !== ''
    ) {
      this.competencesRequis.push(
        this.updateProjetFrom.get('nouvelleCompetenceRequis')?.value
      );
      this.updateProjetFrom.get('nouvelleCompetenceRequis')?.setValue('');
    }
  }
  deleteCompetence(comp: any) {
    const index = this.competences.indexOf(comp);
    if (index !== -1) {
      this.competences.splice(index, 1);
    }
  }
  deleteCompetenceRequis(comp: any) {
    const index = this.competencesRequis.indexOf(comp);
    if (index !== -1) {
      this.competencesRequis.splice(index, 1);
    }
  }
  onSubmit() {

    if (this.updateProjetFrom.valid) {
      const url = 'http://localhost:3500/projet/updateProjet/'+this.id;
      const data = {
        titre : this.updateProjetFrom.get('titre')?.value,
        description : this.updateProjetFrom.get('description')?.value,
        competence_acquis : (this.competences),
        competence_requis : (this.competencesRequis),
        image : this.selectedFile
      }
      // const formData = new FormData();
      // formData.append('titre', "dsqd");
      // formData.append('description', this.updateProjetFrom.get('description')?.value);
      // formData.append('competence_acquis', JSON.stringify(this.competences));
      // formData.append('competence_requis', JSON.stringify(this.competencesRequis));
      // if (this.selectedFile) {
      //   formData.set('image', this.selectedFile, this.selectedFile.name);
      // }


      this.http.put<any>(url, data).subscribe(
        (res) => {
          console.log(res);
          Swal.fire('Projet bien modifié!', '', 'success');
           this.route.navigate(['/dashbord/projet']);
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
}
