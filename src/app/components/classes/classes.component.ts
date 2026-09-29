import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classes',
  imports: [],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent {

  @Input() obj:any = {};

  
}
