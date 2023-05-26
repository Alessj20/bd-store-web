import { Injectable } from '@angular/core';
import { Product, ProductInCart } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralIncome } from '../interfaces/general-income.interface';
import { User } from '../interfaces/user.interface';
import { PaymentMethods } from '../interfaces/payment-methods.interface';
import { DetailIncome } from '../interfaces/detail-income.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/products`);
  }

  getProductsBySearch(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/products/${query}`);
  }

  getProductsByPrice(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/price`);
  }

  getProductsByNewest(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:3000/new`);
  }

  createIncome(body: GeneralIncome): Observable<GeneralIncome[]> {
    return this.http.post<GeneralIncome[]>(
      `http://localhost:3000/general-bill`,
      body
    );
  }

  createDetailIncome(body: DetailIncome): Observable<DetailIncome[]> {
    return this.http.post<DetailIncome[]>(
      `http://localhost:3000/detail-bill`,
      body
    );
  }

  getPaymentMethods(): Observable<PaymentMethods[]> {
    return this.http.get<PaymentMethods[]>(
      `http://localhost:3000/payment-methods`
    );
  }

  updateExistences(id: number, units: number): Observable<String> {
    return this.http.put<String>(
      `http://localhost:3000/update-existences/${id}/${units}`,
      ''
    );
  }
}
