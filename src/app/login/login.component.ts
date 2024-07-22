import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashbordComponent } from '../User/dashbord/dashbord.component';
import { RegistrationComponent } from '../register/register.component';
import {AuthenticationRequest} from '../models/authentication-request';
import {TokenService} from '../token/token.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Roles } from '../models/roles';
import { SuperadminDashboardComponent } from '../SuperAdmin/superadmin-dashboard/superadmin-dashboard.component';
import { AdminDashboardComponent } from '../Admin/admin-dashboard/admin-dashboard.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,DashbordComponent,
     RegistrationComponent ,
     CommonModule
     , RouterModule,
      FormsModule,
       SuperadminDashboardComponent,
        AdminDashboardComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AuthService,

  ],})
  export class LoginComponent {

   
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  login() {
    this.errorMsg = [];
    this.authService.authenticate({ body: this.authRequest }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string; // Set token
        this.tokenService.userRoles = res.roles; // Set roles from response
  
        const userRoles = this.tokenService.userRoles;
  
        if (userRoles.includes(Roles.SUPERADMIN)) {
          console.log('this is superadmin');
          this.router.navigate(['superadmin-dashboard']);
        } else if (userRoles.includes(Roles.ADMIN)) {
          console.log('this is admin');
          this.router.navigate(['admin-dashboard']);
        } else {
          console.log('this is user');
          this.router.navigate(['dashboard']);
        }
      },
      error: (err) => {
        console.error('Error object:', err);
        if (err.status === 401) {
          this.openSnackBar('Email or password incorrect', 'Close');
        } else {
          this.openSnackBar('Unknown error occurred.', 'Close');
        }
      }
    });
  }
  


  register() {
    this.router.navigate(['register']);
  }

  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    // Optionally add a CSS class for styling
    config.panelClass = ['custom-snackbar'];

    this.snackBar.open(message, action, config);
  }
}