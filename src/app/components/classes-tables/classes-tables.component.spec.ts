import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesTablesComponent } from './classes-tables.component';

describe('ClassesTablesComponent', () => {
  let component: ClassesTablesComponent;
  let fixture: ComponentFixture<ClassesTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
