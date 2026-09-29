import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTablesComponent } from './courses-tables.component';

describe('CoursesTablesComponent', () => {
  let component: CoursesTablesComponent;
  let fixture: ComponentFixture<CoursesTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
