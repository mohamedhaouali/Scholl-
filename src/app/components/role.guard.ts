import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const allowed = allowedRoles.map(r => r.toLowerCase());
    const hasAccess = (u: any) => !!u && allowed.includes(String(u.role).toLowerCase());

    const localUser = JSON.parse(localStorage.getItem('connectedUser') || 'null');
    if (hasAccess(localUser)) return true;

    return authService.user$.pipe(
      take(1),
      map(user => {
        const currentUser = user || localUser;
        if (hasAccess(currentUser)) return true;

        if (!currentUser) {
          console.warn('Non connecté. Redirection vers signin.');
          router.navigate(['signin']);
        } else if (currentUser.role === 'parent') {
          router.navigate(['']);
        } else {
          console.warn('Rôle non autorisé :', currentUser.role, '| attendus :', allowedRoles);
          router.navigate(['']); // ou une page "accès interdit"
        }
        return false;
      })
    );
  };
};
