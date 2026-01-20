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
  isAuthenticated$ = this.authService.isAuthenticated$;
  userProfile$: Observable<UserProfile> = this.userService.userProfile$;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
