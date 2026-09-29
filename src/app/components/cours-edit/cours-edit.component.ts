import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../../services/cours.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cours-edit',
  imports: [FormsModule], // 👈 Ajouté NgIf ici
  templateUrl: './cours-edit.component.html',
  styleUrl: './cours-edit.component.css'
})
export class CoursEditComponent implements OnInit {

  coursTab: any = [];
  cour: any = {};
  errorMsg!: string;

  constructor(private coursService: CoursService, private router: Router) {}
 
  ngOnInit() {
    // 🟢 CORRECTION : On lit la clé exacte avec un "c" minuscule
    // On ajoute une sécurité pour lire l'ancienne clé avec majuscule au cas où
    let mId = localStorage.getItem("courId") || localStorage.getItem("CourId");
    
    if (!mId) {
      this.errorMsg = "Impossible de récupérer l'identifiant du cours.";
      console.error("Erreur : Aucun ID de cours trouvé dans le localStorage.");
      return;
    }

    // Appel du service pour récupérer le cours par ID
    this.coursService.getCoursById(mId).subscribe(
      (data: any) => {
        console.log("Here is data from get cours by ID", data);  
        if (data && data.cour) {
          this.cour = data.cour;  
        } else if (data) {
          this.cour = data; // Fallback si le backend renvoie directement l'objet cours
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération du cours :", error);
        this.errorMsg = "Erreur de chargement du cours depuis le serveur.";
      }
    );
  }

  editCour() {
    console.log("Here new Cour values", this.cour);
    this.coursService.editCoursById(this.cour).subscribe(
      (data: any) => {
        console.log("Here is data from edit cour", data);
        
        if (data && data.msg === 'Edited with success') {
          // 🔄 Redirection intelligente selon le rôle de l'utilisateur connecté
          const connectedUser = JSON.parse(localStorage.getItem('connectedUser') || '{}');
          if (connectedUser.role === 'admin') {
            this.router.navigate(["admin"]);
          } else {
            this.router.navigate(["teacher"]); // 🟢 Redirige le prof vers son espace dédié
          }
        } else {
          this.errorMsg = "Cour Not Edited";
        }
      },
      (error) => {
        console.error("Erreur lors de la modification du cours :", error);
        this.errorMsg = "Cour Not Edited";
      }
    );
  }
}
