import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionEnseignantComponent } from './components/administrateur/gestion-enseignant/gestion-enseignant.component';
import { AjouterEnseignantComponent } from './components/administrateur/ajouter-enseignant/ajouter-enseignant.component';
import { ModifierEnseignantComponent } from './components/administrateur/modifier-enseignant/modifier-enseignant.component';
import { AfficherEnseignantComponent } from './components/administrateur/afficher-enseignant/afficher-enseignant.component';
import { GestionEtudiantComponent } from './components/administrateur/gestion-etudiant/gestion-etudiant.component';
import { AjouterEtudiantComponent } from './components/administrateur/ajouter-etudiant/ajouter-etudiant.component';
import { AfficherEtudiantComponent } from './components/administrateur/afficher-etudiant/afficher-etudiant.component';
import { ModifierEtudiantComponent } from './components/administrateur/modifier-etudiant/modifier-etudiant.component';


const routes: Routes = [
  {
    path : '',
    component : HomeComponent,
    children : [
      {
        path : 'enseignant',
        component : GestionEnseignantComponent
      },
      {
        path : 'ajouter_enseignant',
        component : AjouterEnseignantComponent
      },
      {
        path : 'modifier_enseignant/:id',
        component : ModifierEnseignantComponent
      },
      {
        path : 'afficher_enseignant/:id',
        component : AfficherEnseignantComponent
      },
      {
        path : 'etudiant',
        component : GestionEtudiantComponent
      },
      {
        path : 'ajouter_etudiant',
        component : AjouterEtudiantComponent
      },
      {
        path : 'afficher_etudiant/:id',
        component : AfficherEtudiantComponent
      },
      {
        path : 'modifier_etudiant/:id',
        component : ModifierEtudiantComponent
      }



    ]

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashbordRoutingModule { }
