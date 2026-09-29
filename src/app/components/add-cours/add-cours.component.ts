import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursService } from '../../services/cours.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-cours',
  imports: [NgIf,ReactiveFormsModule,NgFor],
  templateUrl: './add-cours.component.html',
  styleUrl: './add-cours.component.css'
})
export class AddCoursComponent {

  errorMsg!: string;

  //Form Id

  coursForm! : FormGroup;
  cour: any = {};
   // 🟢 LA SOLUTION : Remplacer les accolades {} par des crochets []
  teachersTab: any[] = []; 


  constructor(private builder: FormBuilder,private coursService:CoursService,private router:Router,
 private userService:UserService) { }

      ngOnInit() {

    this.coursForm = this.builder.group({
       name: ["",[Validators.required, Validators.minLength(3),Validators.pattern('[a-zA-Z]+$')]],
     
       duree: ["",[Validators.required]],

       description: ["",[Validators.required, Validators.minLength(4)]],
      
        tId: ["", [Validators.required]], 
      
    });
this.userService.getAllTeachers().subscribe(
    (response: any) => {
      if (response && Array.isArray(response.tab)) {
        this.teachersTab = response.tab;
      } else if (Array.isArray(response)) {
        this.teachersTab = response;
      } else {
        this.teachersTab = []; // Fallback si le format est étrange
      }
    },
    (error) => {
      console.error("La requête a échoué, sécurité activée :", error);
      this.teachersTab = []; // 🟢 FORCE un tableau vide en cas de 404 pour empêcher le crash NG02200
    }
  );
 
    

  }


addCours() {
  if (this.coursForm.invalid) {
    this.errorMsg = "Veuillez remplir correctement tous les champs requis.";
    return;
  }

  const connectedUser = JSON.parse(localStorage.getItem('connectedUser') || '{}');
  const connectedId = connectedUser._id || connectedUser.id;

  // Si c'est un teacher qui crée le cours, il en est le propriétaire
  if (connectedUser.role === 'teacher') {
    if (!connectedId) {
      this.errorMsg = "Erreur : Impossible de récupérer votre identifiant d'enseignant.";
      return;
    }
    this.coursForm.patchValue({ tId: connectedId });
  }

    // Sinon (admin) : on garde le tId choisi dans le select

  this.coursService.addCours(this.coursForm.value).subscribe(
    (response: any) => {
      if (response && response.msg === 'Cour added with success') {
        this.router.navigate(['teacher']);
      } else {
        this.errorMsg = "Le serveur n'a pas pu confirmer l'ajout du cours.";
      }
    },
    (error) => {
      console.error("Erreur lors de l'ajout du cours :", error);
      this.errorMsg = "Une erreur est survenue lors de l'enregistrement.";
    }
  );
}



  }



