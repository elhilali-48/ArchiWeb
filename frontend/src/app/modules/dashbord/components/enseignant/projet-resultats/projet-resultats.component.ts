import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-projet-resultats',
  templateUrl: './projet-resultats.component.html',
  styleUrls: ['./projet-resultats.component.css']
})
export class ProjetResultatsComponent {
  data :any;
  constructor(private http : HttpClient, private routeActive : ActivatedRoute, private router : Router){

  }
  ngOnInit(){
    this.loadData()
  }
  loadData(){
    const id_projet = this.routeActive.snapshot.paramMap.get("id") ?? '';

    const url = 'http://localhost:3500/projet/afficherResultsEtudiant';
    const data = {
      id_projet,
    }
    // Post
    this.http.post<any>(url, data).subscribe(
      (res) => {
        console.log(res)
        this.data = res.data
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
