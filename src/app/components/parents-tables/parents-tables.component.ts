import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-parents-tables',
  imports: [NgFor],
  templateUrl: './parents-tables.component.html',
  styleUrl: './parents-tables.component.css'
})
export class ParentsTablesComponent {
// Define the COURSES table data
//fake DB
parentsTab:any = [];

  //Creer new instance cad constructor
constructor(private router: Router,private userService:UserService) {}

ngOnInit() {
  // Appel de la méthode du service pour récupérer tous les parents
  this.userService.getAllParents().subscribe({
    next: (response) => {
      // response = { tab : [{}, {}, {}] }
      this.parentsTab = response.tab;
      console.log("Here is parent service response after getting all parents", response);
    },
    error: (err) => {
      // Gestion des erreurs en cas de coupure ou problème serveur
      console.error("Erreur lors de la récupération des parents :", err);
    }
  }); // <-- Les accolades et parenthèses sont maintenant correctement fermées
}

displayParent(id:any){

  //location.replace('page.html');=> refresh
  //sol 1
  localStorage.setItem("parentId",id);
  //navigate to teacherInfo page
  this.router.navigate(['parentInfo']);

}

editParent(id:any){
  //location.replace('page.html');=> refresh
  //sol 1
  localStorage.setItem("ParentId",id);
  this.router.navigate(['parentEdit']);

}

  deleteParent(id: number) {
    this.userService.deleteParentById(id).subscribe(
        (response) => {

       console.log("Here is user service response after deleting parent",response);
      if (response.msg == "Deleted with success"){ 

        this.userService.getAllParents().subscribe(
          (data)=>{
            this.parentsTab = data.tab;
          }
        )
      }

    }

    );
  }
}
