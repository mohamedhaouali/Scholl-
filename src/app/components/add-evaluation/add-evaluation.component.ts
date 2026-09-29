import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation.service';
import { Router } from '@angular/router';
import { CoursService } from '../../services/cours.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-evaluation',
  imports: [NgIf,ReactiveFormsModule,NgFor],
  templateUrl: './add-evaluation.component.html',
  styleUrl: './add-evaluation.component.css'
})
export class AddEvaluationComponent {
   
  evaluation:any = {};

  coursTab: any =[];

  studentsTab: any =[];

  errorMsg!: string;

  //Form Id
  notesForm! : FormGroup;

  constructor(private builder: FormBuilder, private evaluationService:EvaluationService,private router:Router,private coursService:CoursService,
    private userService:UserService

  ) { }

      ngOnInit() {

    this.notesForm = this.builder.group({

      evaluation: ["",[Validators.required, Validators.minLength(4)]],
     
      note: ["",[Validators.required]],
      courId: ["",[Validators.required]],
      studentId: ["", [Validators.required]]

      
    });

       this.coursService.getAllCours().subscribe(
      (response) => {
        console.log('Réponse totale de l\'API :', response);
        console.log('Contenu de response.tab :', response.tab);
        this.coursTab = response.tab;
      }
  
    );

      this.userService.getAllStudents().subscribe(
      (response) => {
        console.log('Réponse totale de l\'API :', response);
        console.log('Contenu de response.tab :', response.tab);
        this.studentsTab = response.tab;
      }
  
    );


  }
  

    addNotes() {

    console.log("Notes Object", this.notesForm.value);
    this.evaluationService.addEvaluations(this.notesForm.value).subscribe(
      (response) => { 
      console.log("Here is evaluations service response after adding evaluations",response);
        
    }

    );

  }

}
