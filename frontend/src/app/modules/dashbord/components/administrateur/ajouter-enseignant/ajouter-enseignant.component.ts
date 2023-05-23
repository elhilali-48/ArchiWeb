import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouter-enseignant',
  templateUrl: './ajouter-enseignant.component.html',
  styleUrls: ['./ajouter-enseignant.component.css']
})
export class AjouterEnseignantComponent {

  // input
  nom : string = "";
  prenom : string = "";
  email : string = "";
  password : string = "";
  sexe : string = "";
  date : string = "";

  addEnseignantForm : FormGroup;

  constructor(private fb:FormBuilder, private http: HttpClient, private route : Router) {

    this.addEnseignantForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      sexe: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });

  }

  onSubmit(){
    if(this.addEnseignantForm.valid){
      const url = "http://localhost:3500/enseignant/create"
      const data = {
        email : this.addEnseignantForm.get('email')?.value,
        password : this.addEnseignantForm.get('password')?.value,
        nom : this.addEnseignantForm.get('nom')?.value,
        prenom : this.addEnseignantForm.get('prenom')?.value,
        sexe : this.addEnseignantForm.get('sexe')?.value,
        dateNaissance : this.addEnseignantForm.get('date')?.value,
      }
      this.http.post<any>(url,data).subscribe(res=>{
        console.log(res)

        Swal.fire('Enseignant bien ajouté!', '', 'success')
        this.route.navigate(['/dashbord/enseignant']);

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
