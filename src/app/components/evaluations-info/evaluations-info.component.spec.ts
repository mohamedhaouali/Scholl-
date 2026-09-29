import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsInfoComponent } from './evaluations-info.component';

describe('EvaluationsInfoComponent', () => {
  let component: EvaluationsInfoComponent;
  let fixture: ComponentFixture<EvaluationsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
