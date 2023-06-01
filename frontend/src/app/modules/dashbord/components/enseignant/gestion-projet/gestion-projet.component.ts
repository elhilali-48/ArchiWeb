import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-gestion-projet',
  templateUrl: './gestion-projet.component.html',
  styleUrls: ['./gestion-projet.component.css']
})
export class GestionProjetComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  projets: any[];
  enseignant : any[];
  constructor(private http: HttpClient, private location: Location, private router : Router,private cookieService : CookieService) {}

  ngOnInit(): void {
    // Récupérer l'id
    const id = this.cookieService.get('userId')

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      paging: true,
      language: {
        url: './assets/frensh.json'
      },
      ajax: (dataTablesParameters: any, callback) => {
        const params = new HttpParams()
          .set('draw', dataTablesParameters.draw)
          .set('start', dataTablesParameters.start)
          .set('length', dataTablesParameters.length)
          .set('search[value]', dataTablesParameters.search.value)
          .set('id',id)

        this.http.get<DataTablesResponse>('http://localhost:3500/projet/getMyProjets', { params }).subscribe(
          resp => {
            console.log(resp);
            this.projets = resp.data;


            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          },
          error => {
            console.error(error);
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
          }
        );
      },
      columns: [
        { data: 'titre' },
        { data: 'nom' },
        { data: 'etudiants' },
        { data: 'enseignant' },
        {data : 'status'},
        { data: 'actions' }
      ]
    };
  }


  deleteProjet(id :string){
    if(id != ""){
      // Afficher un message de confirmation
      Swal.fire({
        title: 'Voulez-vous vraiment supprimer cet projet ?',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        denyButtonText: `Annuler`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const url = `http://localhost:3500/projet/delete/${id}`

          this.http.delete<any>(url).subscribe(res=>{
            console.log(res)
            Swal.fire(res.message, '', 'success')
            this.router.navigate(['/dashbord/projet'])

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
      })
    }
  }
  archiverProjet(id : string){
    if(id != ""){
      // Afficher un message de confirmation
      Swal.fire({
        title: 'Voulez-vous vraiment archivé cet projet ?',
        showCancelButton: true,
        confirmButtonText: 'Archivé',
        denyButtonText: `Annuler`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const data = {
            status : "Archivé"
          }
          const url = `http://localhost:3500/projet/archiveProjet/${id}`

          this.http.put<any>(url,data).subscribe(res=>{
            console.log(res)
            Swal.fire(res.message, '', 'success')
            this.router.navigate(['/dashbord/projet'])

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
      })
    }
  }
  updateProjet(id :string){
    this.router.navigate(['/dashbord/modifier_etudiant/'+id])
  }
  afficherProjet(id :string){
    this.router.navigate([`/dashbord/afficher_projet/${id}`])
  }
}
