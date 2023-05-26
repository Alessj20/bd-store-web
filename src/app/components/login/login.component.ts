import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router
  ) {}
  ngOnInit() {}

  login() {
    this.clientService
      .getUserValidation(this.username, this.password)
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.clientService.client = response[0];
            this.clientService.actualizarVariableNavbar(true);
            this.router.navigate(['/']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Credenciales Incorrectas`,
            });
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Credenciales Incorrectas`,
          });
        },
      });
  }
}
