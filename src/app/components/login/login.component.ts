import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit { 

  errorMsg!: string;
  loginForm!: FormGroup;
  private phoneRegex = /^\+?[0-9]{10,15}$/; 

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.builder.group({
      phone: ["", [Validators.required, Validators.minLength(6), Validators.pattern(this.phoneRegex)]],
      pwd: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
    });
  }

   login() {
    if (this.loginForm.invalid) {
      this.errorMsg = "Veuillez remplir correctement les champs.";
      return;
    }

    this.userService.signin(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log("login response from BE", response);

        if (response.msg === "Account pending validation") {
          this.errorMsg = "Votre compte est en attente de validation par l'administrateur.";
          return;
        }

        if (response.msg === "Account rejected") {
          this.errorMsg = "Votre demande d'inscription a été refusée.";
          return;
        }

          if (response.msg === "Login with success") {

          // 🟢 1. Enregistrement synchrone obligatoire en premier
          localStorage.setItem('connectedUser', JSON.stringify(response.user));

          // 🟢 2. Notification du flux asynchrone via le service
          this.authService.setUser(response.user);

          // 🟢 3. Lecture du rôle pour la redirection
          const userRole = response.user.role ? response.user.role.toLowerCase() : '';

          // 🟢 4. Utilisation d'un léger délai (setTimeout) pour laisser Angular respirer et finaliser l'écriture locale
          setTimeout(() => {
            if (userRole === "teacher") {
              this.router.navigate(['teacher']);
            } else if (userRole === "student") {
              this.router.navigate(['student']);
            } else if (userRole === "parent") {
              this.router.navigate(['parent']); 
            } else if (userRole === "admin") {
              this.router.navigate(['admin']);
            } else {
              this.router.navigate(['']);
            }
          }, 50); // Un délai de 50ms suffit à valider le cycle d'écriture

        } else {
          this.errorMsg = "Numéro de téléphone ou mot de passe incorrect.";
        }
      },
      error: (err) => {
        console.error("Erreur HTTP de connexion :", err);
        this.errorMsg = "Une erreur est survenue lors de l'authentification.";
      }
    }); 
  }
}