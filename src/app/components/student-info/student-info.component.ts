import { Component } from '@angular/core';
import { StudentComponent } from '../student/student.component';
import { StudentsComponent } from '../students/students.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-student-info',
  imports: [StudentsComponent],
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.css'
})
export class StudentInfoComponent {

  // Define the COURSES table data
//fake DB
studentsTab:any = [


];

//Creer new instance cad constructor
constructor(private router: Router,private userService:UserService ) {}


  foundStudent:any = {};
 
  ngOnInit() {
    let MID = localStorage.getItem("studentId");
     this.userService.getStudentById (MID).subscribe(
(data)=>{
        console.log("here is student service response after getting student by id:", data);
        this.foundStudent = data.user;
      }  

    );

}

}