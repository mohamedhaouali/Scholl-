import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // 💡 Ajout de OnInit
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-teacher',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signup-teacher.component.html',
  styleUrl: './signup-teacher.component.css'
})
export class SignupTeacherComponent implements OnInit {

  errorMsg!: string;
  path!: string;
  cvFile: File | null = null;
  cvError = '';

  signupForm!: FormGroup;
  private phoneRegex = /^\+?[0-9]{10,15}$/;
  private readonly maxCvSize = 5 * 1024 * 1024; // 5 Mo

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.path = this.router.url;

    this.signupForm = this.builder.group({
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]+$')]],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]+$')]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(6), Validators.pattern(this.phoneRegex)]],
      adress: ["", [Validators.required]],
      pwd: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      specialite: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    });
  }

  onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.cvError = '';
    this.cvFile = null;

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.cvError = 'Le CV doit être au format PDF.';
      input.value = '';
      return;
    }
    if (file.size > this.maxCvSize) {
      this.cvError = 'Le CV ne doit pas dépasser 5 Mo.';
      input.value = '';
      return;
    }
    this.cvFile = file;
  }

  signupteacher() {
    if (this.signupForm.invalid) {
      this.errorMsg = "Veuillez remplir correctement tous les champs requis.";
      return;
    }
    if (!this.cvFile) {
      this.cvError = 'Veuillez joindre votre CV en PDF.';
      return;
    }

    // On ne modifie pas signupForm.value : on construit le FormData
    const formData = new FormData();
    Object.entries(this.signupForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.path === '/signupAdmin') {
      formData.append('role', 'Admin');
    } else {
      formData.append('role', 'teacher');
      formData.append('status', 'pending');
    }
    formData.append('cv', this.cvFile);

    this.userService.addTeacher(formData).subscribe({
      next: (response: any) => {
        if (response.msg === 'Email already exists') {
          this.errorMsg = response.msg;
        } else {
          this.router.navigate(["signin"]);
        }
      },
      error: (error) => {
        console.error("Erreur d'inscription HTTP :", error);
        this.errorMsg = "Une erreur est survenue lors de la communication avec le serveur.";
      }
    });
  }
}
