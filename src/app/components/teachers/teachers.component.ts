import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-teachers',
  imports: [],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css'
})
export class TeachersComponent {

@Input() obj:any = {};

}
