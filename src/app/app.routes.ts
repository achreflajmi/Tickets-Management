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
import { ClientManagementComponent } from './SuperAdmin/client-management-component/client-management-component.component';
import { TicketsManagementComponent } from './SuperAdmin/tickets-management/tickets-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashbordComponent},
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'register-admin', component: RegistrationComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'header-admin', component: HeaderAdminComponent },
  { path: 'admin-management', component: AdminManagementComponent },
  { path: 'client-management', component: ClientManagementComponent },
  { path: 'tickets-management', component: TicketsManagementComponent },
];
