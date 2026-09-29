import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationEditComponent } from './evaluation-edit.component';

describe('EvaluationEditComponent', () => {
  let component: EvaluationEditComponent;
  let fixture: ComponentFixture<EvaluationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
