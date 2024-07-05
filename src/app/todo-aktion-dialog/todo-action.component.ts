import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Todo } from '../store/models/todos.models';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodosService } from '../services/todos.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-todo-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatFormField,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-action.component.html',
  styleUrl: './todo-action.component.scss',
})
export class TodoActionDialogComponent {
  form: FormGroup = this.formBuilder.group({
    beschreibung: ['', [Validators.required]],
    faellig: ['', this.data.action !== 'Complete' ? [Validators.required] : []],
    prioritaet: [
      1,
      this.data.action !== 'Complete'
        ? [Validators.required, Validators.min(1), Validators.max(4)]
        : [],
    ],
    erledigt: false,
  });

  constructor(
    private formBuilder: FormBuilder,
    private todosService: TodosService,
    public dialogRef: MatDialogRef<TodoActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string; todo?: Todo }
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'Edit' && this.data.todo) {
      const faelligDate = new Date(Number(this.data.todo.faellig) * 1000);
      const faelligString = faelligDate.toISOString().substring(0, 10);

      this.form.patchValue({
        beschreibung: this.data.todo.beschreibung,
        faellig: faelligString,
        prioritaet: this.data.todo.prioritaet,
        erledigt: this.data.todo.erledigt,
      });
    } else if (this.data.action === 'Complete' && this.data.todo) {
      const faelligDate = new Date(Number(this.data.todo.faellig) * 1000);
      const faelligString = faelligDate.toISOString().substring(0, 10);

      this.form.patchValue({
        beschreibung: this.data.todo.beschreibung,
        faellig: faelligString,
        prioritaet: this.data.todo.prioritaet,
      });
    } else if (this.data.action === 'Incomplete' && this.data.todo) {
      const faelligDate = new Date(Number(this.data.todo.faellig) * 1000);
      const faelligString = faelligDate.toISOString().substring(0, 10);
      this.form.patchValue({
        beschreibung: this.data.todo.beschreibung,
        faellig: faelligString,
        prioritaet: this.data.todo.prioritaet,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const todo: Todo = this.form.value;
      if (this.data.action === 'Add') {
        this.todosService.addTodo(todo).subscribe(() => {
          this.dialogRef.close(todo);
        });
      } else if (this.data.action === 'Edit') {
        const id = this.data?.todo?.id;
        if (id) {
          this.todosService.updateTodo(todo, id).subscribe(() => {
            this.dialogRef.close(todo);
          });
        }
      } else if (this.data.action === 'Complete' && this.data.todo) {
        const id = this.data.todo.id;
        this.todosService.markAsCompleted(todo, id).subscribe(() => {
          this.dialogRef.close(todo);
        });
      } else if (this.data.action === 'Incomplete' && this.data.todo) {
        const id = this.data.todo.id;
        this.todosService.markAsIncomplete(todo, id).subscribe(() => {
          this.dialogRef.close(todo);
        });
      }
    } else {
      console.log('Form is not valid');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
