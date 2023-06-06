import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-projet-liste',
  templateUrl: './projet-liste.component.html',
  styleUrls: ['./projet-liste.component.css']
})
export class ProjetListeComponent {
  data :any [];
  constructor(private http : HttpClient, private router : Router){}

  ngOnInit(){
    const url = `http://localhost:3500/projet/getAllProjets`

    this.http.get<any>(url).subscribe(res=>{
      this.data = res.data
    },err=>{
      console.log(err.error)
      // Error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
      })
    })
  }

  afficherProjet(id : string){
    this.router.navigate(["dashbord/projet_details/"+id])
  }
}
