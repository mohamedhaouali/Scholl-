import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassesComponent } from './add-classes.component';

describe('AddClassesComponent', () => {
  let component: AddClassesComponent;
  let fixture: ComponentFixture<AddClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
