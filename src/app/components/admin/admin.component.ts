import { Component } from '@angular/core';
import { TeacherComponent } from '../teacher/teacher.component';
import { TeachersTablesComponent } from '../teachers-tables/teachers-tables.component';
import { StudentsTablesComponent } from '../students-tables/students-tables.component';
import { ParentsTablesComponent } from '../parents-tables/parents-tables.component';
import { CoursesTablesComponent } from '../courses-tables/courses-tables.component';
import { SignupTeacherComponent } from '../signup-teacher/signup-teacher.component';
import { ClassesTablesComponent } from '../classes-tables/classes-tables.component';


@Component({
  selector: 'app-admin',
  imports: [TeachersTablesComponent, StudentsTablesComponent, ParentsTablesComponent, CoursesTablesComponent ,ClassesTablesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
