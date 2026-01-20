import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { UserService, UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // Streams directos desde servicios
  readonly user$ = this.userService.userProfile$; // naming consistente
  readonly isAuthenticated$ = this.auth.isAuthenticated$;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
