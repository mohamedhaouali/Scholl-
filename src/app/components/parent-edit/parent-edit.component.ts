import { Component, OnInit } from '@angular/core'; // 1. Import de l'interface OnInit
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parent-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './parent-edit.component.html',
  styleUrl: './parent-edit.component.css'
})
export class ParentEditComponent implements OnInit { // 2. Implémentation explicite de OnInit

  parentsTab: any = [
    { id: 1, firstName: "med", lastName: "Calculus", email: "med@gmail.com", telephone: "123456789", adresse: "tunis" },
    { id: 2, firstName: "john", lastName: "Mechanics", email: "john@gmail.com", telephone: "987654321", adresse: "beja" },
    { id: 3, firstName: "jane", lastName: "Organic Chemistry", email: "jane@gmail.com", telephone: "456789123", adresse: "gafsa" }
  ];

  parent: any = {};
  errorMsg!: string;

  constructor(private userService: UserService, private router: Router) {}
 
  ngOnInit() {
    let mId = localStorage.getItem("parentId");
    
    // 3. Sécurisation du type pour supprimer l'erreur TS2345 (string | null)
    if (mId && mId !== 'undefined') {
      this.userService.getParentById(mId as any).subscribe({
        next: (data) => {
          console.log("Here is data from get parent by ID", data);
          this.parent = data.user;    
        },
        error: (err) => {
          console.error("Erreur lors de la récupération :", err);
          this.errorMsg = "Impossible de récupérer les informations du parent.";
        }
      });
    } else {
      console.warn("Aucun parentId trouvé dans le localStorage.");
    }
  }

  editParent() {
    console.log("Here new Parent values", this.parent);
    
    // 4. Utilisation de la structure recommandée .subscribe({ next, error })
    this.userService.editParentById(this.parent).subscribe({
      next: (data) => {
        console.log("Here is data from edit parent", data);
        
        if (data.msg === "Edited with success") {
          this.router.navigate(["admin"]);
        } else {
          this.errorMsg = "Parent Not Edited";
        }
      },
      error: (err) => {
        console.error("Erreur lors de la modification :", err);
        this.errorMsg = "Erreur réseau ou serveur : modification échouée.";
      }
    });
  }
}
