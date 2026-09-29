import { NgFor, NgIf } from '@angular/common'; // Ajoutez NgIf si vous l'utilisez dans le HTML
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursService } from '../../services/cours.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-courses-tables',
  imports: [NgFor, NgIf],
  templateUrl: './courses-tables.component.html',
  styleUrl: './courses-tables.component.css'
})
export class CoursesTablesComponent implements OnInit {

  coursTab: any[] = [];
  loading = true;
  error = '';
  role = '';

  constructor(
    private router: Router,
    private coursService: CoursService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const connectedUser = JSON.parse(localStorage.getItem('connectedUser') || '{}');
    const userId = connectedUser._id;
    this.role = connectedUser.role ? connectedUser.role.toLowerCase() : '';

    if (!userId) {
      this.error = "Utilisateur non connecté.";
      this.loading = false;
      return;
    }

    if (this.role === 'teacher') {
      this.loadTeacherCourses(userId);
    } else if (this.role === 'student') {
      this.loadStudentCourses(userId); // Appelle la méthode corrigée ci-dessous
     } else if (this.role === 'admin') { 
        this.loadAllCourses();

     } else {
      this.error = "Rôle non reconnu.";
      this.loading = false;
    }
    // 💡 Le bloc de code dupliqué et erroné qui se trouvait ici a été supprimé.
  }

  // Cours enseignés par ce teacher
  loadTeacherCourses(teacherId: string) {
    this.coursService.getCoursByTeacherId(teacherId).subscribe({
      next: (response) => {
        console.log("Here is cours service response for this teacher", response);
        this.coursTab = response.tab;
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des cours :", err);
        this.error = "Impossible de charger vos cours.";
        this.loading = false;
      }
    });
  }

  // ✅ CORRIGÉ : Utilise maintenant la route Express dédiée aux étudiants
  loadStudentCourses(studentId: string) {
    this.coursService.getCoursByStudentId(studentId).subscribe({
      next: (response) => {
        console.log("Here is cours service response for this student", response);
        // Récupère directement le tableau 'tab' renvoyé par votre route Express
        this.coursTab = response.tab; 
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des cours de l'étudiant :", err);
        this.error = "Impossible de charger vos cours.";
        this.loading = false;
      }
    });
  }

  loadAllCourses() {
  this.coursService.getAllCours().subscribe({
    next: (response) => {
      this.coursTab = response.tab;   // adapte si ta route renvoie { cours: [...] }
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = "Impossible de charger les cours.";
      this.loading = false;
    }
  });
}

  displayCour(id: any) {
    localStorage.setItem("courId", id);
    this.router.navigate(['coursInfo']);
  }

  editCour(id: any) {
    localStorage.setItem("courId", id);
    this.router.navigate(['coursEdit']);
  }

  deleteCour(id: any) {
    if (this.role !== 'teacher') return;

    this.coursService.deleteCoursById(id).subscribe({
      next: (response: any) => {
        console.log("Here is cours service response after deleting cours", response);
        if (response.msg == "Deleted with success") {
          const connectedUser = JSON.parse(localStorage.getItem('connectedUser') || '{}');
          this.loadTeacherCourses(connectedUser._id);
        }
      },
      error: (err) => console.error(err)
    });
  }

  get canEdit(): boolean {
  return this.role === 'teacher' || this.role === 'admin';
}
}
