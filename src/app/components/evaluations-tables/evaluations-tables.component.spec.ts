import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsTablesComponent } from './evaluations-tables.component';

describe('EvaluationsTablesComponent', () => {
  let component: EvaluationsTablesComponent;
  let fixture: ComponentFixture<EvaluationsTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationsTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
