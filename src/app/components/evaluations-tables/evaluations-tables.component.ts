import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../../services/evaluation.service';
import { Router } from '@angular/router';
import {  NgFor } from '@angular/common';

@Component({
  selector: 'app-evaluations-tables',
  imports: [NgFor],
  templateUrl: './evaluations-tables.component.html',
  styleUrl: './evaluations-tables.component.css'
})
export class EvaluationsTablesComponent implements OnInit {

  evaluationsTab: any = [];
  connectedUser: any = null;

  constructor(private router: Router, private evaluationService: EvaluationService) {}

ngOnInit() {
  this.connectedUser = JSON.parse(localStorage.getItem('connectedUser') || 'null');
  this.loadEvaluations();
}

loadEvaluations() {
  this.evaluationService.getAllEvaluations().subscribe((response: any) => {
    const role = String(this.connectedUser?.role).toLowerCase();
    const all = response.tab || [];

if (role === 'student') {
  const myId = String(this.connectedUser?._id ?? this.connectedUser?.id);

  // le student ne garde que ses propres évaluations
  this.evaluationsTab = all.filter((e: any) =>
    String(e.studentId?._id ?? e.studentId) === myId
  );
} else {
  this.evaluationsTab = all;
}
  });
}

  displayEvaluation(id: any) {
    if (!this.connectedUser) {
      this.router.navigate(['signin']);
      return;
    }

    // 🟢 SÉCURITÉ : Conversion en minuscules pour parer aux écarts de saisie ('Student' vs 'student')
    const role = this.connectedUser.role ? this.connectedUser.role.toLowerCase() : '';

    // 🟢 RECTIFICATION : L'étudiant ('student') doit obligatoirement pouvoir lire sa note
    if (role === 'teacher' || role === 'admin' || role === 'parent' || role === 'student') {
      localStorage.setItem("evaluationId", id);
      this.router.navigate(['evaluationInfo']);
    } else {
      console.warn("Accès refusé pour la consultation : Rôle insuffisant.", this.connectedUser.role);
    }
  }

  editEvaluation(id: any) {
    if (!this.connectedUser) {
      this.router.navigate(['signin']);
      return;
    }

    const role = this.connectedUser.role ? this.connectedUser.role.toLowerCase() : '';

    // 🔒 RESTRICTION : Modification réservée aux profs et admins
    if (role === 'teacher' || role === 'admin') {
      localStorage.setItem("evaluationId", id);
      this.router.navigate(['evaluationEdit']);
    } else {
      console.warn("Accès refusé pour l'édition : Seuls les enseignants et admins peuvent modifier.");
    }
  }

  deleteEvaluation(id: any) {
    const role = this.connectedUser?.role ? this.connectedUser.role.toLowerCase() : '';
    
    // 🔒 RESTRICTION : Suppression réservée aux profs et admins
    if (role !== 'teacher' && role !== 'admin') {
      console.error("Action non autorisée.");
      return;
    }

    this.evaluationService.deleteEvaluationById(id).subscribe(
      (response: any) => {
        console.log("Here is evaluation service response after deleting evaluation", response);
        if (response && response.msg === "Deleted with success") {
          this.evaluationService.getAllEvaluations().subscribe(
            (data: any) => {
              this.evaluationsTab = data.tab;
            }
          );
        }
      }
    );
  }
}
