import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluation-edit',
  imports: [FormsModule],
  templateUrl: './evaluation-edit.component.html',
  styleUrl: './evaluation-edit.component.css'
})
export class EvaluationEditComponent implements OnInit {

  evaluation: any = {};
  errorMsg!: string;

  constructor(private router: Router, private evaluationService: EvaluationService) {}

  ngOnInit() {
    // 🟢 CORRECTION : On utilise la clé uniformisée avec un "e" minuscule
    // On ajoute une sécurité pour lire l'ancienne clé au cas où
    let mId = localStorage.getItem("evaluationId") || localStorage.getItem("EvaluationId");
    
    if (!mId) {
      this.errorMsg = "Impossible de récupérer l'identifiant de l'évaluation.";
      return;
    }

    // Appel du service pour récupérer l'évaluation par ID
    this.evaluationService.getEvaluationsById(mId).subscribe(
      (data: any) => {
        console.log("Here is data from get evaluations by ID", data);  
        if (data && data.evaluation) {
          this.evaluation = data.evaluation;  
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'évaluation :", error);
        this.errorMsg = "Erreur de chargement des données depuis le serveur.";
      }
    );
  }

  editEvaluation() {
    console.log("Here new Evaluation values", this.evaluation);
    this.evaluationService.editEvaluationsById(this.evaluation).subscribe(
      (data: any) => {
        console.log("Here is data from edit evaluation", data);
        
        if (data && data.msg === 'Edited with success') {
          // 🔄 Redirection après succès : l'espace "admin" ou "teacher" selon l'utilisateur
          const connectedUser = JSON.parse(localStorage.getItem('connectedUser') || '{}');
          if (connectedUser.role === 'admin') {
            this.router.navigate(["admin"]);
          } else {
            this.router.navigate(["teacher"]);
          }
        } else {
          // Si l'API renvoie un autre message, on affiche l'erreur
          this.errorMsg = "Evaluation Not Edited";
        }
      },
      (error) => {
        console.error("Erreur lors de la modification :", error);
        this.errorMsg = "Evaluation Not Edited";
      }
    );
  }
}
