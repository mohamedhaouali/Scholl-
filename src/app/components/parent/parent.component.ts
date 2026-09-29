import { Component } from '@angular/core';
import { EvaluationsTablesComponent } from '../evaluations-tables/evaluations-tables.component';
import { EvaluationsComponent } from '../evaluations/evaluations.component';

@Component({
  selector: 'app-parent',
  imports: [EvaluationsTablesComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {

}
