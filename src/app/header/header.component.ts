import { Component } from '@angular/core';
import { DashbordComponent } from '../dashbord/dashbord.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DashbordComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private _authService:AuthService){

  }
  // logout(){
  //   this._authService.logout();
  // }
}
