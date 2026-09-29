import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-parents',
  imports: [],
  templateUrl: './parents.component.html',
  styleUrl: './parents.component.css'
})
export class ParentsComponent {

  @Input() obj:any = {};

}
