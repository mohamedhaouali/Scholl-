import { Component } from '@angular/core';
import { CoursComponent } from '../cours/cours.component';
import { CoursService } from '../../services/cours.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cours-info',
  imports: [CoursComponent],
  templateUrl: './cours-info.component.html',
  styleUrl: './cours-info.component.css'
})
export class CoursInfoComponent {

coursTab:any = [];

  foundCours:any = {};

   //Creer new instance cad constructor
  constructor(private coursService: CoursService,private router: Router) {}
 
  ngOnInit() {
    let mID = localStorage.getItem("courId");
    this.coursService.getCoursById (mID).subscribe(
    (data)=>{
        console.log("here is cour service response after getting cour by id:", data);
         //afficher pour formulaire
        this.foundCours = data.cour;
      }

    );
  

}



}
