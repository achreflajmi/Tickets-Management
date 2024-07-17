import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './User/dashbord/dashbord.component';
import { HeaderComponent } from './header/header.component';
import { authGuard } from './auth.guard';
import { RegistrationComponent } from './register/register.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ChatComponent } from './User/chat/chat.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './SuperAdmin/superadmin-dashboard/superadmin-dashboard.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { AdminManagementComponent } from './SuperAdmin/admin-management-component/admin-management-component.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
      },
    {
        path: '',
        redirectTo: '/superadmin-dashboard',
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
      { path: 'admin-dashboard', component: AdminDashboardComponent }, // Admin Dashboard
      { path: 'superadmin-dashboard', component: SuperadminDashboardComponent }, // Superadmin Dashboard
      {
        path: 'header-admin',
            component: HeaderAdminComponent,
      },
      { path: 'admin-management', component: AdminManagementComponent },
      

];
