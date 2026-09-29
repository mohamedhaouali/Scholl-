import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClasseService } from '../../services/classe.service';

@Component({
  selector: 'app-classes-tables',
  imports: [NgFor],
  templateUrl: './classes-tables.component.html',
  styleUrl: './classes-tables.component.css'
})

export class ClassesTablesComponent {
//fake DB
classesTab: any = [];
//Creer new instance cad constructor
constructor(private router: Router,private classeService:ClasseService) {}

ngOnInit() {
  // faire appel a l'instance
  // service courService  c'est une classe
  this.classeService.getAllClasses().subscribe(
    (response) => {
      // response = {tab : [{},{},{}]
      this.classesTab = response.tab;
      console.log("Here is cour service response after getting all classes",response);
        
}
  

  );

 }


displayClasse(id: any){
  //location.replace('page.html');=> refresh
  //sol 1
  localStorage.setItem("classeId",id);
  //navigate to matchInfo page
  this.router.navigate(['classeInfo']);

}

editClasse(id:any){
  //location.replace('page.html');=> refresh
  //sol 1
  localStorage.setItem("classeId",id);
  this.router.navigate(['classeEdit']);

}

 deleteClasse(id: any) {
    this.classeService.deleteClassesById(id).subscribe(
  (response) => {

      console.log("Here is cours service response after deleting cours",response);

     if (response.msg == "Deleted with success"){ 

        this.classeService.getAllClasses().subscribe(
          (data)=>{
            this.classesTab = data.tab;
          }
        )
      }

    }

    );
  }



   }


 