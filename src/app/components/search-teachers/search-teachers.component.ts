import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../services/user.service';
import { TeachersComponent } from '../teachers/teachers.component';

@Component({
  selector: 'app-search-teachers',
  standalone: true,
  imports: [FormsModule, CommonModule, TeachersComponent],
  templateUrl: './search-teachers.component.html',
  styleUrl: './search-teachers.component.css'
})
export class SearchTeachersComponent implements OnInit {

  teacher: any = { 
    specialite: "" 
  };
  
  teachersTab: any[] = [];
  hasSearched: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() { }

  searchTeacher() {
    if (!this.teacher.specialite || !this.teacher.specialite.trim()) {
      return;
    }
  
    this.hasSearched = true;
    const queryValue = this.teacher.specialite.trim();
    console.log("👉 Recherche lancée pour :", queryValue);
  
    this.userService.searchTeachersByspecialite(queryValue).subscribe({
      next: (response: any) => {
        // ✅ On extrait le tableau depuis response.teachers ou response.matches selon votre backend
        this.teachersTab = response.teachers ;
        
        // 🔍 Traceur : Regardez la console de votre navigateur (F12) pour voir ce message !
        console.log("🚀 Données reçues par Angular :", this.teachersTab);
      },
      error: (err) => {
        console.error("❌ Erreur d'appel service :", err);
        this.teachersTab = [];
      }
    });
  }
}
