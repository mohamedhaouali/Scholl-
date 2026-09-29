import { Component, OnInit, signal } from '@angular/core'; // 👈 On ajoute 'signal'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  // 🧠 Utilisation d'un Signal pour forcer la mise à jour immédiate du HTML
  connectedUserSignal = signal<any>(null);

  get connectedUser() {
    return this.connectedUserSignal();
  }

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.connectedUserSignal.set(user); // 👈 On met à jour le signal ici
      console.log("Header - user mis à jour :", user);
    });
  }

  isLoggedIn(): boolean {
    return this.connectedUserSignal() !== null; // 👈 Évalué instantanément
  }

  /**
   * 🛡️ Contrôle du rôle de l'utilisateur connecté
   */
  hasRole(role: string): boolean {
    const user = this.connectedUserSignal();
    return user && user.role === role;
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['signin']);
  }
}
