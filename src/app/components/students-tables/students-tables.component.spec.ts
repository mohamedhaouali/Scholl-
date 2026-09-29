import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsTablesComponent } from './students-tables.component';

describe('StudentsTablesComponent', () => {
  let component: StudentsTablesComponent;
  let fixture: ComponentFixture<StudentsTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
