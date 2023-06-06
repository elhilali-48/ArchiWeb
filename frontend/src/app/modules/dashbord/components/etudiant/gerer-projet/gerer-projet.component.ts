import { Component } from '@angular/core';

@Component({
  selector: 'app-gerer-projet',
  templateUrl: './gerer-projet.component.html',
  styleUrls: ['./gerer-projet.component.css']
})
export class GererProjetComponent {
  constructor(){}

  onTabClick(event: Event) {
    event.preventDefault();
  }
}
