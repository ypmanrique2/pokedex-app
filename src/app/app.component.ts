import { Component, OnInit} from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Valida sesión UNA sola vez al iniciar la app
    this.auth.validarSesion().subscribe();
  }
}
