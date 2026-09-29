import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Un BehaviorSubject permet de diffuser en temps réel l'état de l'utilisateur
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor() {}

  // Récupère l'utilisateur stocké au chargement initial (F5)
  private getUserFromStorage() {
    const user = localStorage.getItem('connectedUser');
    return user ? JSON.parse(user) : null;
  }

  // Appelé lors du Login réussi
  setUser(user: any) {
    localStorage.setItem('connectedUser', JSON.stringify(user));
    this.userSubject.next(user); // Informe tous les composants abonnés (comme le Header)
  }

  // Appelé lors du Logout
  clearUser() {
    localStorage.removeItem('connectedUser'); // Supprime le jeton/profil
    this.userSubject.next(null); // Informe instantanément le Header qu'il n'y a plus d'utilisateur
  }
}
