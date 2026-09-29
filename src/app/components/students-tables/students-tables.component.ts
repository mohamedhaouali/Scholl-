import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-students-tables',
  imports: [NgFor, NgIf],
  templateUrl: './students-tables.component.html',
  styleUrl: './students-tables.component.css'
})
export class StudentsTablesComponent implements OnInit {

  studentsTab: any = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadStudents();
  }

  // Un teacher ne voit que ses students, l'admin voit tout
  loadStudents() {
    const user = JSON.parse(localStorage.getItem('connectedUser') || '{}');
    const userId = user._id || user.id;

    if (user.role === 'teacher' && userId) {
      this.userService.getStudentsByTeacher(userId).subscribe((response) => {
        this.studentsTab = response.tab || [];
      });
    } else {
      this.userService.getAllStudents().subscribe((response) => {
        this.studentsTab = response.tab || [];
      });
    }
  }

  displayStudent(id: any) {
    localStorage.setItem("studentId", id);
    this.router.navigate(['studentInfo']);
  }

  editStudent(id: any) {
    localStorage.setItem("studentId", id);
    this.router.navigate(['studentEdit']);
  }

  deleteStudent(id: number) {
    this.userService.deleteStudentById(id).subscribe((response) => {
      if (response.msg == "Deleted with success") {
        this.loadStudents();   // recharge avec le même filtre
      }
    });
  }
}