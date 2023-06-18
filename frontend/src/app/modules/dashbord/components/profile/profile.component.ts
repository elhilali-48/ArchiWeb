import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, ValidationErrors} from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent {
  updateProfileForm : FormGroup
  updatePasswordForm : FormGroup
  data:any;
  constructor(private http : HttpClient, private datePipe : DatePipe, private cookie : CookieService, private router : Router){

  }
  ngOnInit(){
    this.getData();
    // Paramètres du formulaires info :
    this.updateProfileForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      sexe: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });

    this.updatePasswordForm = new FormGroup({
      oldPass: new FormControl('', [Validators.required, Validators.minLength(2)]),
      newPass: new FormControl('', [Validators.required, Validators.minLength(2)]),
      confirmPass: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });

  }


  getData(){
    // Récupérer id dans le cookie

    const user_id = this.cookie.get('userId');

    // Requete post pour récupérer les infos de l'utilisateur

    const url = `http://localhost:3500/user/getInfo/${user_id}`;

    // Get
    this.http.get<any>(url).subscribe(
      (res) => {
        console.log(res)
        this.data = res.data
        this.updateProfileForm.setValue({
            nom : res.data[0].info[0].nom,
            prenom : res.data[0].info[0].prenom,
            sexe : res.data[0].info[0].sexe,
            date : this.datePipe.transform(res.data[0].info[0].dateNaissance,"yyyy-MM-dd")
        })

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

  // On submit Info
  onSubmitInfo(){
    const id = this.cookie.get('userId')
    if(this.updateProfileForm.valid){
      const url = `http://localhost:3500/user/updateProfile/${id}`
      const data = {
        nom : this.updateProfileForm.get('nom')?.value,
        prenom : this.updateProfileForm.get('prenom')?.value,
        sexe : this.updateProfileForm.get('sexe')?.value,
        dateNaissance : this.updateProfileForm.get('date')?.value,
      }
      this.http.put<any>(url,data).subscribe(res=>{
        this.getData();
        Swal.fire('Les informations sont modifiés!', '', 'success')

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

  // on save Password

  onSubmitPass(){
    const id = this.cookie.get('userId')
    if(this.updateProfileForm.valid ){
      // If two password matches

      const checkPass = (this.updatePasswordForm.get("newPass")?.value == this.updatePasswordForm.get("confirmPass")?.value) ? true : false

      if(checkPass){
          const url = `http://localhost:3500/user/change_password/${id}`

          const oldPass = this.updatePasswordForm.get('oldPass')?.value
          const newPass = this.updatePasswordForm.get('newPass')?.value
          const data = {
            oldPassword : oldPass,
            newPassword : newPass
          }
          this.http.put<any>(url,data).subscribe(res=>{

            if(res.status == 200){
              this.cookie.deleteAll('userId')

              Swal.fire('Les informations sont modifiés!', '', 'success')
              Swal.fire('Vous devez se reconnecter avec votre nouveau mot de pass', '', 'info')
              this.router.navigate(["/se_connecter"])
            }
          },err=>{
            // Error
            console.log(err)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.error.message,
            })
          })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Les deux mots de passe ne sont pas identiques"
        })
      }
    }
  }
}
