import { Component } from '@angular/core';
import { Product, ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: Product[] = [];
  search: string = '';

  ngOnInit(): void {}

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  searchProducts(): void {
    if (!this.search || this.search === '') {
      this.productService.getProducts().subscribe((response) => {
        this.products = response;
      });
    } else {
      this.productService
        .getProductsBySearch(this.search)
        .subscribe((response) => {
          this.products = response;
        });
    }
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
