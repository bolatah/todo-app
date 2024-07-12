import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { todosReducer } from './store/reducers/todos.reducer';
import { authReducer } from './store/reducers/auth.reducer';
import { AuthGuard } from './guards/auth.guard';
import { authInterceptor } from './store/interceptors/auth.interceptor';
import { dateToUnixTimestamp } from './store/interceptors/date-to-unix-timestamp.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthGuard,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, dateToUnixTimestamp])),
    provideStore({
      todos: todosReducer,
      auth: authReducer,
    }),
  ],
};
