import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ajouter-projet',
  templateUrl: './ajouter-projet.component.html',
  styleUrls: ['./ajouter-projet.component.css'],


})
export class AjouterProjetComponent {
  competences: String[] = [];
  competencesRequis: String[] = [];
  nouvelleCompetence: string = '';
  nouvelleCompetenceRequis: string = '';
  titre: string = '';
  description: string = '';
  selectedFile: File | null = null;


  addProjetForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {
    this.addProjetForm = new FormGroup({
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }
  ajouterCompetence() {
    console.log(this.competences);
    console.log(this.addProjetForm.get('nouvelleCompetence')?.value);
    if (this.addProjetForm.get('nouvelleCompetence')?.value.trim() !== '') {
      this.competences.push(
        this.addProjetForm.get('nouvelleCompetence')?.value
      );
      this.addProjetForm.get('nouvelleCompetence')?.setValue('');
    }
  }
  ajouterCompetenceRequis() {
    console.log(this.competencesRequis);
    console.log(this.addProjetForm.get('nouvelleCompetenceRequis')?.value);
    if (
      this.addProjetForm.get('nouvelleCompetenceRequis')?.value.trim() !== ''
    ) {
      this.competencesRequis.push(
        this.addProjetForm.get('nouvelleCompetenceRequis')?.value
      );
      this.addProjetForm.get('nouvelleCompetenceRequis')?.setValue('');
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
    // Récupérer l'id
    const id = this.cookieService.get('userId');
    if (this.addProjetForm.valid) {
      const url = 'http://localhost:3500/projet/create';
      const formData = new FormData();
      formData.append('titre', this.addProjetForm.get('titre')?.value);
      formData.append('description', this.addProjetForm.get('description')?.value);
      formData.append('enseignant_id', id);
      formData.append('competence_acquis', JSON.stringify(this.competences));
      formData.append('competence_requis', JSON.stringify(this.competencesRequis));
      formData.append('status', 'En cours');
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
      this.http.post<any>(url, formData).subscribe(
        (res) => {
          console.log(res);

          Swal.fire('Projet bien ajouté!', '', 'success');
          this.router.navigate(['/dashbord/projet']);
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
  }
}
