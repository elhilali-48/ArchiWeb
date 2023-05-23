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

import { DataTablesModule } from 'angular-datatables';
import { AjouterEnseignantComponent } from './components/administrateur/ajouter-enseignant/ajouter-enseignant.component';

import { ReactiveFormsModule  } from '@angular/forms';
import { ModifierEnseignantComponent } from './components/administrateur/modifier-enseignant/modifier-enseignant.component';
import { AfficherEnseignantComponent } from './components/administrateur/afficher-enseignant/afficher-enseignant.component';
import { GestionEtudiantComponent } from './components/administrateur/gestion-etudiant/gestion-etudiant.component';
import { AjouterEtudiantComponent } from './components/administrateur/ajouter-etudiant/ajouter-etudiant.component';
import { AfficherEtudiantComponent } from './components/administrateur/afficher-etudiant/afficher-etudiant.component';
import { ModifierEtudiantComponent } from './components/administrateur/modifier-etudiant/modifier-etudiant.component';

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

    // Datatable
    DataTablesModule
  ]
})
export class DashbordModule { }
