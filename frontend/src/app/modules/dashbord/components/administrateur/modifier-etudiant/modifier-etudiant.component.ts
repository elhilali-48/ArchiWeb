import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modifier-etudiant',
  templateUrl: './modifier-etudiant.component.html',
  styleUrls: ['./modifier-etudiant.component.css']
})
export class ModifierEtudiantComponent {
  nom : string = "";
  prenom : string = "";
  email : string = "";
  sexe : string = "";
  date : string = "";

  data : any;
  user :any;
  id : string = ""
  updateEtudiantForm : FormGroup
  constructor(private route: ActivatedRoute, private http : HttpClient, private router: Router){
    this.data = {}
    this.user = {}

  }

  ngOnInit(){

    //Récupere les infos
    this.route.params.subscribe(params => {

      const url = `http://localhost:3500/etudiant/get/${params['id']}`

      this.http.get<any>(url).subscribe(res=>{
        console.log(res)
        this.id = params['id']
        this.data = res
        this.user = res.user_id
        this.email = res.user_id.email
        
        this.updateEtudiantForm.setValue({
          nom : res.nom,
          prenom : res.prenom,
          sexe :res.sexe,
          email : res.user_id.email,
          date : res.dateNaissance
        })

      },err=>{
        // Error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        })
      })
    });

    this.updateEtudiantForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      sexe: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    if(this.updateEtudiantForm.valid){
      const url = `http://localhost:3500/etudiant/update/${this.id}`
      const data = {
        email : this.updateEtudiantForm.get('email')?.value,
        nom : this.updateEtudiantForm.get('nom')?.value,
        prenom : this.updateEtudiantForm.get('prenom')?.value,
        sexe : this.updateEtudiantForm.get('sexe')?.value,
        dateNaissance : this.updateEtudiantForm.get('date')?.value,
      }
      this.http.put<any>(url,data).subscribe(res=>{
        console.log(res)
        Swal.fire('Les informations sont modifiés!', '', 'success')
        this.router.navigate(['/dashbord/etudiant']);

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
