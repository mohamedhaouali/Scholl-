import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🟢 1. Importez le module global d'Angular

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule], // 🟢 2. Ajoutez-le obligatoirement dans ce tableau
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css'
})
export class EvaluationsComponent implements OnInit {

  @Input() obj: any = {}; // Reçoit l'objet depuis evaluations-info

  constructor() {}

  ngOnInit() {
    console.log("Composant Enfant Evaluations - Données reçues :", this.obj);
  }

    notesColor(a:number) {

    if(a > 10){
      return 'green';
    }else if(a < 10){
      return 'red';
    } else {
      return 'blue';
    }


}
}
