import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../services/classe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes-edit',
  imports: [FormsModule],
  templateUrl: './classes-edit.component.html',
  styleUrl: './classes-edit.component.css'
})
export class ClassesEditComponent {

      // Define the COURSES table data
//fake DB
classesTab:any = [];

  classe:any = {};
  errorMsg!: string;

   //Creer new instance cad constructor
constructor(private classesService: ClasseService, private router: Router) {}

  ngOnInit() {

    let mId = localStorage.getItem("classeId");
    //appel service pour recuperer le cours par id
   
          //appel service pour recuperer le match par id
    
      this.classesService.getClassesById(mId).subscribe(
       (data) => {

          console.log("Here is data from get cours by ID", data);  
           //this.cour jeya min match:any = {}
          // cour jeya min backend get
          this.classe = data.classe;  

       }


      );
  

}

  editClasse() {
    console.log("Here new classe values", this.classe);
    this.classesService.editClassesById(this.classe).subscribe(
          (data) => {

      console.log("Here is data from edit classe",data);
      //Naviguer vers admin component si la modification est effectue apres success
	  //SI non, afficher un msg d'erreur sous le form "Classe Not Edited"
	  
      if (data.msg == 'Edited with success') {
        this.router.navigate(["admin"]);
      } else {
        //si non, afficher un msg erreur sous la form "Classe not Edited" 
        //Classe Not Edited
        this.errorMsg = "Classe Not Edited";

      }
      

    }

    );

}
}

