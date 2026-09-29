import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-edit',
  imports: [FormsModule],
  templateUrl: './teacher-edit.component.html',
  styleUrl: './teacher-edit.component.css'
})
export class TeacherEditComponent {

// Define the MATCHES table data
//fake DB  

  teacherstab:any = [

];

teacher:any = {};
  errorMsg!: string;

  //Creer new instance cad constructor
constructor(private userService: UserService,private router:Router) {}
 
  ngOnInit() {
    let mId = localStorage.getItem("TeacherId");
     //appel service pour recuperer le teacher par id
    this.userService.geTeacherById(mId).subscribe(
       (data) => {

          console.log("Here is data from get teacher by ID", data);
          //this.teacher jeya min teacher:any = {}
          // teacher jeya min backend get
          this.teacher = data.user;    

       }


      );

    
  }



  editTeacher() {
    console.log("Here new teacher values", this.teacher);
    
    // 4. Utilisation de la structure recommandée .subscribe({ next, error })
    this.userService.editTeacherById(this.teacher).subscribe({
      next: (data) => {
        console.log("Here is data from edit teacher", data);
        
        if (data.msg === "Edited with success") {
          this.router.navigate(["admin"]);
        } else {
          this.errorMsg = "teacher Not Edited";
        }
      },
      error: (err) => {
        console.error("Erreur lors de la modification :", err);
        this.errorMsg = "Erreur réseau ou serveur : modification échouée.";
      }
    });
  }

}