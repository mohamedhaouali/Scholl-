import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cours',
  imports: [],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent {

   @Input() obj:any = {};

}
