import { NgFor, NgIf } from '@angular/common'; // 🟢 Ajout de NgIf pour les boutons conditionnels du HTML
import { Component, OnInit } from '@angular/core'; // 🟢 Ajout de OnInit
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-teachers-tables',
  imports: [NgFor, NgIf], // 🟢 Ajout de NgIf dans la liste des imports
  templateUrl: './teachers-tables.component.html',
  styleUrl: './teachers-tables.component.css'
})
export class TeachersTablesComponent implements OnInit { // 🟢 Implémentation explicite de l'interface OnInit

  teachersTab: any = [];

  // Créer new instance c-à-d constructor
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.refreshTeachersList();
  }

  // 🟢 Nouvelle méthode partagée pour éviter la répétition du code de rechargement
  refreshTeachersList() {
    this.userService.getAllTeachers().subscribe({
      next: (response) => {
        // response = { tab : [{}, {}, {}] }
        this.teachersTab = response.tab;
        console.log("Here is teacher service response after getting all teachers", response);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des enseignants :", err);
      }
    });
  }

  // 🟢 AJOUT : Méthode permettant de valider ou de rejeter le compte d'un enseignant
  changeStatus(id: any, status: 'approved' | 'rejected') {
    this.userService.updateTeacherStatus(id, status).subscribe({
      next: (response: any) => {
        console.log(`Statut de l'enseignant mis à jour avec succès en: ${status}`, response);
        // Rafraîchissement automatique de la liste après modification
        this.refreshTeachersList();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du statut :", err);
      }
    });
  }

  displayTeacher(id: any) {
    localStorage.setItem("teacherId", id);
    // navigate to teacherInfo page
    this.router.navigate(['teacherinfo']);
  }

  editTeacher(id: any) {
    localStorage.setItem("TeacherId", id);
    this.router.navigate(['teacherEdit']);
  }

  deleteTeacher(id: any) {
    this.userService.deleteTeacherById(id).subscribe({
      next: (response: any) => {
        console.log("Here is teacher service response after deleting teacher", response);
        
        // La condition correspond parfaitement au res.json({msg: "Deleted with success"}) de votre backend Express
        if (response.msg == "Deleted with success") {
          // Rafraîchissement automatique de la liste locale après suppression
          this.refreshTeachersList();
        }
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
      }
    });
  }
}
