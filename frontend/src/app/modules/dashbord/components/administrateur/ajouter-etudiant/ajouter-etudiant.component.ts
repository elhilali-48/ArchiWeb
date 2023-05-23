import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-ajouter-etudiant',
  templateUrl: './ajouter-etudiant.component.html',
  styleUrls: ['./ajouter-etudiant.component.css']
})
export class AjouterEtudiantComponent {

  nom : string = "";
  prenom : string = "";
  email : string = "";
  password : string = "";
  sexe : string = "";
  date : string = "";

  addEtudiantForm : FormGroup;

  constructor(private router: Router, private http : HttpClient , private fb: FormBuilder){
    this.addEtudiantForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      sexe: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    if(this.addEtudiantForm.valid){
      const url = "http://localhost:3500/etudiant/create"
      const data = {
        email : this.addEtudiantForm.get('email')?.value,
        password : this.addEtudiantForm.get('password')?.value,
        nom : this.addEtudiantForm.get('nom')?.value,
        prenom : this.addEtudiantForm.get('prenom')?.value,
        sexe : this.addEtudiantForm.get('sexe')?.value,
        dateNaissance : this.addEtudiantForm.get('date')?.value,
      }
      this.http.post<any>(url,data).subscribe(res=>{
        console.log(res)

        Swal.fire('Enseignant bien ajouté!', '', 'success')
        this.router.navigate(['/dashbord/etudiant']);

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
}
