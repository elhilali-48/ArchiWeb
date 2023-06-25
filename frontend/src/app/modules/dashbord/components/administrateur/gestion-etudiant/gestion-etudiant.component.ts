import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-gestion-etudiant',
  templateUrl: './gestion-etudiant.component.html',
  styleUrls: ['./gestion-etudiant.component.css']
})
export class GestionEtudiantComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: any[];
  constructor(private http: HttpClient, private location: Location, private router : Router) {}

  ngOnInit(): void {
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
          .set('role','Etudiant');

        this.http.get<DataTablesResponse>('http://localhost:3500/admin/getAllEnseignats', { params }).subscribe(
          resp => {
            console.log(resp);
            this.persons = resp.data;

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
        // { data: '_id' },
        { data: 'email' },
        { data: 'createdAt' },
        { data: 'role' },
        { data: 'password' }
      ]
    };
  }


  deleteEtudiant(id :string){
    if(id != ""){
      // Afficher un message de confirmation
      Swal.fire({
        title: 'Voulez-vous vraiment supprimer ce étudiant ?',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        denyButtonText: `Annuler`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const url = `http://localhost:3500/etudiant/delete/${id}`

          this.http.delete<any>(url).subscribe(res=>{
            console.log(res)
            Swal.fire(res.message, '', 'success')
            location.reload()
            this.router.navigate(['/dashbord/etudiant'])

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
  updateEtudiant(id :string){
    this.router.navigate(['/dashbord/modifier_etudiant/'+id])
  }
  afficherEtudiant(id :string){
    this.router.navigate([`/dashbord/afficher_etudiant/${id}`])
  }
}
