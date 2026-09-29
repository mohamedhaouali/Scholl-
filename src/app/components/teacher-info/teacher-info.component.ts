import { Component } from '@angular/core';
import { TeachersComponent } from '../teachers/teachers.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-teacher-info',
  imports: [TeachersComponent],
  templateUrl: './teacher-info.component.html',
  styleUrl: './teacher-info.component.css'
})
export class TeacherInfoComponent {

teachersTab: any = [

{id:1,firstName:"Math",lastName:"Calculus",job:"info",email:"med@gmail.com",telephone:"123456",adresse:"tunis"},
{id:2,firstName:"Physics",lastName:"Mechanics",job:"phys",email:"john@gmail.com",telephone:"123456",adresse:"sfax"},
{id:3,firstName:"Chemistry",lastName:"Organic Chemistry",job:"math",email:"jane@gmail.com",telephone:"123456",adresse:"gafsa"}
];

  foundTeacher:any = {};

      //Creer new instance cad constructor
constructor(private userService: UserService) {}
 
  ngOnInit() {
    let MID = localStorage.getItem("teacherId");
    this.userService.geTeacherById (MID).subscribe(
     (data)=>{
        console.log("here is teacher service response after getting teacher by id:", data);
        this.foundTeacher = data.user;
      }  

    );

}

}


