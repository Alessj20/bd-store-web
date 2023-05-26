import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/interfaces/new-user.interface';
import { User } from 'src/app/interfaces/user.interface';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  newUser: NewUser = {
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    dpi: 0,
    nit: '',
    birthday: new Date(),
    phone: 0,
    country: '',
    state: '',
    city: '',
    complement: '',
  };

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  register() {
    const validate: boolean = this.validateClient();
    if (validate) {
      this.clientService.getUser(this.newUser.username).subscribe((result) => {
        if (result.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'El usuario ya existe, agregue uno diferente',
          });
        } else {
          this.clientService
            .createClient(this.newUser)
            .subscribe((response) => {
              if (response.length > 0) {
                Swal.fire({
                  icon: 'success',
                  title: 'Usuario Creado',
                  text: `Hemos Creado tu usuario correctamente, ya puedes Iniciar Sesión.`,
                  confirmButtonText: 'Iniciar Sesión',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['/login']);
                  }
                });
              }
            });
        }
      });
    }
  }

  validateClient() {
    const user: NewUser = this.newUser;
    if (
      user.username === '' ||
      user.password === '' ||
      user.firstName === '' ||
      user.confirmPassword === '' ||
      user.firstLastName === '' ||
      user.country === '' ||
      user.state === '' ||
      user.city === '' ||
      user.complement === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Completa los datos obligatorios',
      });
      return false;
    } else if (user.password != user.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
      });
      return false;
    } else {
      return true;
    }
  }
}
