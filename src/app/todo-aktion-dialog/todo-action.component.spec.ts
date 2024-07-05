import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTodoDialogComponent } from './todo-action.component';

describe('AddEditTodoDialogComponent', () => {
  let component: AddEditTodoDialogComponent;
  let fixture: ComponentFixture<AddEditTodoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTodoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
