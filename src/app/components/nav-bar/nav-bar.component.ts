import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements AfterViewInit, OnInit {
  badgeCount: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private readonly clientService: ClientService
  ) {}

  ngAfterViewInit(): void {
    this.clientService.variableNavbar$.subscribe((valor) => {
      this.isLoggedIn = valor;
    });

    this.cartService.variableNavbar$.subscribe((valor) => {
      const products: ProductInCart[] = valor;
      let count: number = 0;
      products.forEach((product) => {
        count = count + product.UNITS;
      });
      this.badgeCount = count;
    });
  }

  ngOnInit(): void {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  closeSession() {
    this.clientService.actualizarVariableNavbar(false);
  }
}
