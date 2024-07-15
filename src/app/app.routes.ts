import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { HeaderComponent } from './header/header.component';
import { authGuard } from './auth.guard';
import { RegistrationComponent } from './register/register.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
      },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      
      {
        path: 'dashboard',
            component: DashbordComponent,
            canActivate: [authGuard], 

      },
      {
        path: 'activate-account',
        component: ActivateAccountComponent
      },
      {
        path: 'header',
            component: HeaderComponent,
      },
      {
        path: 'register',
            component: RegistrationComponent,
      },
      {
        path: 'register-admin',
            component: RegistrationComponent,
      },
      {
        path: 'chat',
            component: ChatComponent,
      },

];
