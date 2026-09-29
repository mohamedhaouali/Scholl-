import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Requis pour utiliser *ngIf et [src] dans le HTML
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-student-edit',
  imports: [FormsModule, CommonModule], // Ajout de CommonModule ici
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent {

  studentsTab: any = [];
  student: any = {};
  errorMsg!: string;
  
  // Variables pour gérer la photo
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    let MID = localStorage.getItem("studentId");
    this.userService.getStudentById(MID).subscribe(
      (data) => {
        console.log("Here is data from get student by ID", data);  
        this.student = data.user;  
      }
    );
  }

  // Capturer le fichier lorsque l'utilisateur choisit une image
  onPhotoSelected(event: any): void {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    if (file) {
      this.selectedFile = file;

      // Générer un aperçu visuel instantané dans le formulaire
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  editStudent() {
    console.log("Here new Student values", this.student);
    
    // Déclaration du conteneur FormData pour envoyer les données textuelles ET le fichier
    const formData = new FormData();
    formData.append('_id', this.student._id || localStorage.getItem("studentId")); // Assurez-vous d'envoyer l'ID au backend
    formData.append('firstName', this.student.firstName || '');
    formData.append('lastName', this.student.lastName || '');
    formData.append('email', this.student.email || '');
    formData.append('phone', this.student.phone || '');
    formData.append('adress', this.student.adress || '');
    
    // Si l'utilisateur a sélectionné une nouvelle photo, on l'ajoute au FormData
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    // On passe ici 'formData' au lieu de l'objet 'this.student'
    this.userService.editStudentById(formData).subscribe(
      (data) => {
        console.log("Here is data from edit student", data);

        if (data.msg == 'Edited with success') {
          this.router.navigate(["admin"]);
        } else {
          this.errorMsg = "Student Not Edited";
        }
      }
    );
  }
}
