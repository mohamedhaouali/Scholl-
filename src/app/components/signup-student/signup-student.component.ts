import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // 🟢 Ajout explicite de OnInit
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CoursService } from '../../services/cours.service';

@Component({
  selector: 'app-signup-student',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signup-student.component.html',
  styleUrl: './signup-student.component.css'
})
export class SignupStudentComponent implements OnInit { // 🟢 Implémentation de l'interface

  user: any = {};
  errorMsg!: string;
  path!: string;  
  file: any; 
  coursTab: any[] = []; 

  signupForm!: FormGroup;
  private phoneRegex = /^\+?[0-9]{10,15}$/;  

  constructor(
    private builder: FormBuilder,
    private coursService: CoursService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    // 🟢 Récupération du chemin de l'URL courante
    this.path = this.router.url;

    this.signupForm = this.builder.group({
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]+$')]],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]+$')]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(10), Validators.pattern(this.phoneRegex)]],
      adress: ["", [Validators.required, Validators.minLength(3)]],
      pwd: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      courId: ["", [Validators.required]],
    });

    // 🟢 Récupération automatique de la liste des cours pour le formulaire d'inscription
    this.coursService.getAllCours().subscribe({
      next: (response: any) => {
        // Ajustez 'response.tab' ou 'response.cours' selon le retour de votre CoursService
        this.coursTab = response.tab || response.cours || [];
        console.log("Cours chargés pour l'inscription :", this.coursTab);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des cours :", err);
      }
    });
  }

  signupstudent() {
  

    console.log("User Object", this.signupForm.value);

    // 🟢 FIX 1 : Syntaxe corrigée avec un "else if" propre et Casse synchronisée ('Admin' / 'Student')
    if (this.path === '/signupAdmin') {
      this.signupForm.value.role = 'Admin';
    } else if (this.path === '/signupstudent') {
      this.signupForm.value.role = 'Student';
    } else {
      this.signupForm.value.role = 'Student'; // Sécurité par défaut
    }

    // 🟢 Le statut est fixé à 'approved' d'office pour les étudiants (pas de validation Admin requise)
    this.signupForm.value.status = 'approved';

    this.userService.addStudent(this.signupForm.value, this.file).subscribe({
      next: (response: any) => {
        console.log("Here is user service response after adding user", response);

        if (response.msg === 'Email already exists') {
          this.errorMsg = "Cet email est déjà associé à un compte.";
        } else {
          // 🟢 FIX 2 : Redirection ciblée de l'étudiant vers sa page dédiée
          if (this.signupForm.value.role === 'Student') {
            this.router.navigate(["student"]);
          } else {
            this.router.navigate(["signin"]);
          }
        }       
      },
      error: (err) => {
        console.error("Erreur d'inscription de l'étudiant :", err);
        this.errorMsg = "Une erreur serveur est survenue lors de l'inscription.";
      }
    });
  }

  onImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) { 
      this.file = inputElement.files[0]; 
      console.log("Here is the selected file", this.file);
    }
  }
}
