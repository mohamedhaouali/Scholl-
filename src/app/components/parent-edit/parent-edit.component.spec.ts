import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentEditComponent } from './parent-edit.component';

describe('ParentEditComponent', () => {
  let component: ParentEditComponent;
  let fixture: ComponentFixture<ParentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
