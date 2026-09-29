import { Component } from '@angular/core';
import { CoursesTablesComponent } from '../courses-tables/courses-tables.component';
import { EvaluationsTablesComponent } from '../evaluations-tables/evaluations-tables.component';

@Component({
  selector: 'app-student',
  imports: [CoursesTablesComponent, EvaluationsTablesComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {

}
