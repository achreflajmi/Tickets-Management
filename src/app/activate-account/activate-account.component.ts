import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import {skipUntil} from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  standalone: true,
  styleUrls: ['./activate-account.component.scss'],
  imports: [LoginComponent, CommonModule, CodeInputModule ],

})
export class ActivateAccountComponent {

  message = '';
  isOkay = true;
  submitted = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  protected readonly skipUntil = skipUntil;
}