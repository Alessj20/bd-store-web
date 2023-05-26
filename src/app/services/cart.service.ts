import { Injectable } from '@angular/core';
import { Product, ProductInCart } from '../interfaces/product.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { GeneralIncome } from '../interfaces/general-income.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  products: ProductInCart[] = [];

  private productsForLength = new BehaviorSubject<ProductInCart[]>([]);

  variableNavbar$ = this.productsForLength.asObservable();

  actualizarVariableNavbar(products: ProductInCart[]) {
    this.productsForLength.next(products);
  }
  constructor() {}

  addProduct(product: Product) {
    const newProduct: ProductInCart = {
      ID: product.ID,
      NAME: product.NAME,
      DESCRIPTION: product.DESCRIPTION,
      EXISTENCE: product.EXISTENCE,
      PRICE: product.PRICE,
      UNITS: 1,
      IMAGEN: product.IMAGEN,
    };
    this.products.push(newProduct);
  }

  incrementProductUnits(index: number) {
    this.products[index].UNITS++;
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
  }

  getCart() {
    return this.products;
  }

  get cart() {
    return this.products;
  }

  set cart(cart: ProductInCart[]) {
    this.products = cart;
  }
}
