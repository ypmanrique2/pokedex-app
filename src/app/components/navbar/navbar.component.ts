import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  // Streams directos desde los servicios
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
