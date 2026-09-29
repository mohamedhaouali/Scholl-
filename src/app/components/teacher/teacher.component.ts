import { Component } from '@angular/core';
import { CoursesTablesComponent } from '../courses-tables/courses-tables.component';
import { StudentsTablesComponent } from '../students-tables/students-tables.component';

@Component({
  selector: 'app-teacher',
  imports: [CoursesTablesComponent,StudentsTablesComponent],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {


}


