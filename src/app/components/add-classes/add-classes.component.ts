import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { UserService } from '../../services/user.service';
import { CoursService } from '../../services/cours.service';

@Component({
  selector: 'app-add-classes',
  imports: [NgIf,ReactiveFormsModule,NgFor],
  templateUrl: './add-classes.component.html',
  styleUrl: './add-classes.component.css'
})
export class AddClassesComponent {

    errorMsg!: string;

  //Form Id

  classesForm! : FormGroup;
  classe: any = {};
  studentsTab: any = {};
  coursTab: any = {};

   constructor(private builder: FormBuilder,private classeService:ClasseService
    ,private router:Router,private userService:UserService,private coursService:CoursService
) { }

     ngOnInit() {

    this.classesForm = this.builder.group({
       name: ["",[Validators.required]],
       studentId: ["", [Validators.required]],
      courId: ["",[Validators.required]], 

    });
  this.userService.getAllStudents().subscribe(
      (response) => {
        this.studentsTab = response.tab;
      }
    );

     this.coursService.getAllCours().subscribe(
      (response) => {
        this.coursTab = response.tab;
      }
    );

}

    addClasses() {

    console.log("Classes Object", this.classesForm.value);
    this.classeService.addClasses(this.classesForm.value).subscribe(
      (response) => { 
      console.log("Here is classes service response after adding cours",response);
        
    }

    );
  }

}
