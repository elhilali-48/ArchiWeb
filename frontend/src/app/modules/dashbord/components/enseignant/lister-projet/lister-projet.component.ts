import { HttpClient } from '@angular/common/http';
import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-lister-projet',
  templateUrl: './lister-projet.component.html',
  styleUrls: ['./lister-projet.component.css']
})
export class ListerProjetComponent {
  // Pagination variable
  cardsPerPage: number = 4; // Nombre de cartes à afficher par page
  pageIndex: number = 0; // Indice de la page actuelle
  totalCards: number = 0; // Nombre total de cartes
  data : any[];
  id : string;
  search : String;
  constructor(private http : HttpClient, private cookie : CookieService, private router : Router){}

  ngOnInit(){
    const id  = this.cookie.get("userId")
    this.id = id
    this.chargerData()
  }
  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }
  chargerData(){
    const url = `http://localhost:3500/projet/getAllProjets`

    this.http.get<any>(url).subscribe(res=>{
      this.data = res.data
      this.totalCards = res.data.length
      const totalPages = Math.ceil(this.totalCards/this.cardsPerPage);

      if(this.pageIndex >= totalPages){
        this.pageIndex = 0;
      }
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
  afficherProjet(id: string){
    this.router.navigate(['/dashbord/afficher_projet',id])
  }

  keyupSearch(event :any){
    const searchTerm = event.target.value.trim().toLowerCase();

    if(searchTerm){
      const filteredData = this.data.filter((item) =>
        item.titre.toLowerCase().includes(searchTerm)
      );

      this.data = filteredData
    }else{
      this.chargerData()
    }
  }

}
