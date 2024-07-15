import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { RegistrationRequest } from '../models/registration-request';
import { AuthService } from '../auth.service';
import { ActivateAccountComponent } from '../activate-account/activate-account.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, ActivateAccountComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})

export class RegistrationComponent {

 
  registerRequest: RegistrationRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    Roles: []
  };
  errorMsg: string[] = [];
  selectedRole: string = 'ADMIN'; // Default role selection

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const currentPath = this.route.snapshot.url[0]?.path; // Get the first segment of the current URL
    if (currentPath === 'register-admin') {
      this.selectedRole = 'ADMIN'; // Set default role for admin registration
    }
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];
    this.registerRequest.Roles = [this.selectedRole];
    console.log('Selected Role:', this.selectedRole);
    this.authService.registerUser({ body: this.registerRequest })
      .subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
        },
        error: (err) => this.handleRegistrationError(err)
      });
  }

  registerAdmin() {
    this.errorMsg = [];
    this.registerRequest.Roles = [this.selectedRole];
    console.log('Selected Role:', this.selectedRole);
    this.authService.registerAdmin({ body: this.registerRequest })
      .subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
        },
        error: (err) => this.handleRegistrationError(err)
      });
  }

  private handleRegistrationError(err: any) {
    console.error('Error object:', err);
    if (err.error && err.error.validationErrors) {
      this.errorMsg = err.error.validationErrors;
      this.showErrorSnackbar(this.errorMsg.join(', '));
    } else if (err.error && err.error.message) {
      this.errorMsg = [err.error.message];
      this.showErrorSnackbar(this.errorMsg[0]);
    } else {
      this.errorMsg = ['Unknown error occurred.'];
      this.showErrorSnackbar(this.errorMsg[0]);
    }
  }

  private showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snackbar-error']
    });
  }
}