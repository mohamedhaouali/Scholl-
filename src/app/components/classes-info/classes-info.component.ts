import { Component, OnInit } from '@angular/core';
import { ClasseService } from '../../services/classe.service';
import { Router } from '@angular/router';
import { ClassesComponent } from '../classes/classes.component';


@Component({
  selector: 'app-classes-info',
  imports: [ClassesComponent], // ✔️ Ajout de NgIf pour l'affichage asynchrone
  templateUrl: './classes-info.component.html',
  styleUrl: './classes-info.component.css'
})
export class ClassesInfoComponent implements OnInit { // ✔️ Implémente OnInit

  classesTab: any = [];
  
  // Initialisé à null pour pouvoir utiliser un bloc de chargement dans le HTML
  foundClasses: any = null;

  constructor(private classesService: ClasseService, private router: Router) {}
 
  ngOnInit() {
    // ✔️ Correction majeure : On récupère "classeId" pour correspondre au tableau
    let mID = localStorage.getItem("classeId");
    
    if (mID) {
      this.classesService.getClassesById(mID).subscribe({
        next: (data: any) => {
          console.log("Here is class service response after getting class by id:", data);
          
          // Sécurité si votre backend renvoie l'objet directement ou imbriqué
          this.foundClasses = data.classe || data;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération de la classe :", err);
        }
      });
    } else {
      console.warn("Aucun classeId trouvé dans le localStorage.");
    }
  }
}
