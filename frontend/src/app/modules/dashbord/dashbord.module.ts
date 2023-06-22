import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashbordRoutingModule } from './dashbord-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { GestionEnseignantComponent } from './components/administrateur/gestion-enseignant/gestion-enseignant.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule} from '@angular/material/divider';
import { MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';



import { DataTablesModule } from 'angular-datatables';
import { AjouterEnseignantComponent } from './components/administrateur/ajouter-enseignant/ajouter-enseignant.component';

import { ReactiveFormsModule  } from '@angular/forms';
import { ModifierEnseignantComponent } from './components/administrateur/modifier-enseignant/modifier-enseignant.component';
import { AfficherEnseignantComponent } from './components/administrateur/afficher-enseignant/afficher-enseignant.component';
import { GestionEtudiantComponent } from './components/administrateur/gestion-etudiant/gestion-etudiant.component';
import { AjouterEtudiantComponent } from './components/administrateur/ajouter-etudiant/ajouter-etudiant.component';
import { AfficherEtudiantComponent } from './components/administrateur/afficher-etudiant/afficher-etudiant.component';
import { ModifierEtudiantComponent } from './components/administrateur/modifier-etudiant/modifier-etudiant.component';
import { GestionProjetComponent } from './components/enseignant/gestion-projet/gestion-projet.component';
import { AjouterProjetComponent } from './components/enseignant/ajouter-projet/ajouter-projet.component';
import { AfficherProjetComponent } from './components/enseignant/afficher-projet/afficher-projet.component';
import { ListerProjetComponent } from './components/enseignant/lister-projet/lister-projet.component';
import { ModifierProjetComponent } from './components/enseignant/modifier-projet/modifier-projet.component';
import { ProjetListeComponent } from './components/etudiant/projet-liste/projet-liste.component';
import { ProjetDetailsComponent } from './components/etudiant/projet-details/projet-details.component';
import { GetInfoUserService } from 'src/app/service/get-info-user.service';
import { MesProjetsComponent } from './components/etudiant/mes-projets/mes-projets.component';
import { GererProjetComponent } from './components/etudiant/gerer-projet/gerer-projet.component';
import { ProjetResultatsComponent } from './components/enseignant/projet-resultats/projet-resultats.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashbordComponent } from './components/dashbord/dashbord.component';

// Service



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    GestionEnseignantComponent,
    AjouterEnseignantComponent,
    ModifierEnseignantComponent,
    AfficherEnseignantComponent,
    GestionEtudiantComponent,
    AjouterEtudiantComponent,
    AfficherEtudiantComponent,
    ModifierEtudiantComponent,
    GestionProjetComponent,
    AjouterProjetComponent,
    AfficherProjetComponent,
    ListerProjetComponent,
    ModifierProjetComponent,
    ProjetListeComponent,
    ProjetDetailsComponent,
    MesProjetsComponent,
    GererProjetComponent,
    ProjetResultatsComponent,
    ProfileComponent,
    DashbordComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DashbordRoutingModule,
    // Materiel UI
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule,
    MatSliderModule,
    MatPaginatorModule,
    MatTabsModule,
    // Datatable
    DataTablesModule
  ],
  providers : [
    GetInfoUserService
  ]
})
export class DashbordModule { }
