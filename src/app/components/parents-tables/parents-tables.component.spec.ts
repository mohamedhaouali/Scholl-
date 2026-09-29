import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsTablesComponent } from './parents-tables.component';

describe('ParentsTablesComponent', () => {
  let component: ParentsTablesComponent;
  let fixture: ComponentFixture<ParentsTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentsTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentsTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
