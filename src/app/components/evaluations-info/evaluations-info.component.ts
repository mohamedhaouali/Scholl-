import { Component, OnInit } from '@angular/core'; // 🟢 CORRECTION 1 : Importer 'OnInit'
import { EvaluationsComponent } from '../evaluations/evaluations.component';
import { EvaluationService } from '../../services/evaluation.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 🟢 Ajout pour gérer le @if et la structure dans le HTML

@Component({
  selector: 'app-evaluations-info',
  imports: [EvaluationsComponent, CommonModule], // 🛠️ CommonModule englobe NgStyle, NgIf, etc.
  templateUrl: './evaluations-info.component.html',
  styleUrl: './evaluations-info.component.css'
})
export class EvaluationsInfoComponent implements OnInit { // 🟢 CORRECTION 2 : Ajouter 'implements OnInit'

  evaluationsTab: any = [];
  foundEvaluations: any = {};
  errorMsg!: string; // 🟢 Permet de stocker un message d'erreur si l'ID est introuvable

  constructor(private evaluationService: EvaluationService, private router: Router) {}

  ngOnInit() {
    let mID = localStorage.getItem("evaluationId");

    // 🛡️ Sécurité : Éviter de lancer une requête si l'identifiant est absent
    if (!mID) {
      this.errorMsg = "Impossible de récupérer l'identifiant de l'évaluation.";
      console.error("Aucun evaluationId trouvé dans le localStorage.");
      return;
    }

    this.evaluationService.getEvaluationsById(mID).subscribe({
      next: (data: any) => {
        console.log("here is evaluation service response after getting evaluation by id:", data);
        
        // 🟢 Sécurité : On s'adapte à la structure de retour de votre API Express
        if (data && data.evaluation) {
          this.foundEvaluations = data.evaluation;
        } else {
          this.foundEvaluations = data; // Si l'API renvoie directement l'objet
        }
      },
      error: (err) => {
        console.error("Erreur de chargement de l'évaluation :", err);
        this.errorMsg = "Erreur lors de la communication avec le serveur.";
      }
    });
  }
}
