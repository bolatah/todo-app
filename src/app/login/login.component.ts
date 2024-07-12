import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  AuthState,
  selectAuthToken,
  selectAuthenticatedUser,
  selectIsAuthenticated,
} from '../store/selectors/auth.selectors';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide: boolean = true;

  form: FormGroup = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(40)],
    ],
  });
  apiUrl = 'http://localhost:9002/login';
  user$ = new Observable();
  isAuthenticated$ = new Observable();
  private token$ = new Observable();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ auth: AuthState }>
  ) {
    this.token$ = this.store.select(selectAuthToken);
  }

  ngOnInit(): void {}

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  onSubmit(): void {
    this.authService
      .login(this.form.get('username')?.value, this.form.get('password')?.value)
      .subscribe((_response: any) => {
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl); 
      });
  }
}
