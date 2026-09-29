import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersTablesComponent } from './teachers-tables.component';

describe('TeachersTablesComponent', () => {
  let component: TeachersTablesComponent;
  let fixture: ComponentFixture<TeachersTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
