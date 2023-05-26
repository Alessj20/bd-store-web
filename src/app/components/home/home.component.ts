import { Component } from '@angular/core';
import { Product, ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products: Product[] = [];
  newProducts: Product[] = [];
  isLoggedIn: boolean = false;
  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly utilService: UtilService,
    private readonly clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientService.variableNavbar$.subscribe(valor => {
      this.isLoggedIn = valor;
    });
    this.getProducts();
    this.getNewProducts();
  }

  getProducts() {
    this.productService.getProductsByPrice().subscribe((response) => {
      this.products = response;
    });
  }

  getNewProducts() {
    this.productService.getProductsByNewest().subscribe((response) => {
      this.newProducts = response;
    });
  }

  addToCart(product: Product) {
    let cart: ProductInCart[] = this.cartService.getCart();
    console.log(cart)
    let index: number = 0;
    let findProduct: ProductInCart[] = [];
    cart.forEach((pd, index) => {
      if (pd.ID === product.ID) {
        console.log("entrooo")
        findProduct.push(pd);
        index = index;
        return;
      }
    });

    if (findProduct.length > 0) {
      this.cartService.incrementProductUnits(index);
    } else {
      this.cartService.addProduct(product);
    }
    const products: ProductInCart[] = this.cartService.getCart();
    this.cartService.actualizarVariableNavbar(products);
  }
}
