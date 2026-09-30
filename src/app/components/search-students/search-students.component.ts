import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { EvaluationsComponent } from '../evaluations/evaluations.component';


@Component({
  selector: 'app-search-students',
  imports: [ReactiveFormsModule, NgIf, EvaluationsComponent, NgFor],
  templateUrl: './search-students.component.html',
  styleUrl: './search-students.component.css'
})
export class SearchStudentsComponent implements OnInit {
  errorMsg: string = "";
  studentsTab: any = [];
  searchForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      phone: ["", Validators.required]
    });
  }

  searchStudents() {
    // Réinitialisation des états avant la nouvelle requête
    this.errorMsg = "";
    this.studentsTab = [];

    console.log("Here is phone from input", this.searchForm.value);
    
    this.userService.searchStudentsByphone(this.searchForm.value.phone).subscribe(
      (response) => {
        console.log("Here is the response after search students by phone", response);
        if (response.msg === "No students found") {
          this.errorMsg = response.msg;
        } else {
          this.studentsTab = response.students;
        }
      }
    );
  }
}
