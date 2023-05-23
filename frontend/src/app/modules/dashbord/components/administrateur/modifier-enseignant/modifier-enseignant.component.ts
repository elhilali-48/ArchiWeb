import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modifier-enseignant',
  templateUrl: './modifier-enseignant.component.html',
  styleUrls: ['./modifier-enseignant.component.css']
})
export class ModifierEnseignantComponent {

  nom : string = "";
  prenom : string = "";
  email : string = "";
  sexe : string = "";
  date : string = "";

  data : any;
  user :any;
  id : string = ""
  updateEnseignantForm : FormGroup
  constructor(private route: ActivatedRoute, private http : HttpClient, private router: Router){
    this.data = {}
    this.user = {}

  }

  ngOnInit(){

    //Récupere les infos
    this.route.params.subscribe(params => {

      const url = `http://localhost:3500/enseignant/get/${params['id']}`

      this.http.get<any>(url).subscribe(res=>{
        console.log(res)
        this.id = params['id']
        this.data = res
        this.user = res.user_id
        this.email = res.user_id.email
        this.updateEnseignantForm.setValue({
          nom : res.nom,
          prenom : res.prenom,
          sexe :res.sexe,
          email : res.user_id.email,
          date : res.dateNaissance
        })
        console.log('ggg')
        console.log(this.data.user_id.email);

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

    this.updateEnseignantForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      sexe: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    if(this.updateEnseignantForm.valid){
      const url = `http://localhost:3500/enseignant/update/${this.id}`
      const data = {
        email : this.updateEnseignantForm.get('email')?.value,
        nom : this.updateEnseignantForm.get('nom')?.value,
        prenom : this.updateEnseignantForm.get('prenom')?.value,
        sexe : this.updateEnseignantForm.get('sexe')?.value,
        dateNaissance : this.updateEnseignantForm.get('date')?.value,
      }
      this.http.put<any>(url,data).subscribe(res=>{
        console.log(res)
        Swal.fire('Les informations sont modifiés!', '', 'success')
        this.router.navigate(['/dashbord/enseignant']);

      },err=>{
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    }
  }

}
