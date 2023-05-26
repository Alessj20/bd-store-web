import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralIncome } from 'src/app/interfaces/general-income.interface';
import { ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  products: ProductInCart[] = [];
  generalIncome!: GeneralIncome;
  isLoggedIn: boolean = false;

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientService.variableNavbar$.subscribe(valor => {
      this.isLoggedIn = valor;
    });
    this.products = this.cartService.getCart();
  }

  decrementCart(index: number) {
    this.products[index].UNITS--;
    this.cartService.cart = this.products;
    const products: ProductInCart[] = this.cartService.getCart();
    this.cartService.actualizarVariableNavbar(products);
  }

  incrementCart(index: number) {
    this.products[index].UNITS++;
    this.cartService.cart = this.products;
    const products: ProductInCart[] = this.cartService.getCart();
    this.cartService.actualizarVariableNavbar(products);
  }

  deleteCartItem(index: number) {
    this.products.splice(index, 1);
    this.cartService.deleteProduct(index);
  }

  addUnits(event: any, index: number) {
    this.products[index].UNITS = event;
    this.cartService.cart = this.products;
    const products: ProductInCart[] = this.cartService.getCart();
    this.cartService.actualizarVariableNavbar(products);
  }
}
