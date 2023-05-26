import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { concatAll, map, tap } from 'rxjs/operators';
import { Client } from 'src/app/interfaces/client.interface';
import { DetailIncome } from 'src/app/interfaces/detail-income.interface';
import { GeneralIncome } from 'src/app/interfaces/general-income.interface';
import { ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  isWorking: boolean = true;
  pedido: number = 12345;
  isLoggedIn: boolean = false;
  progress: number = 0;
  products: ProductInCart[] = [];
  generalIncome!: GeneralIncome;
  detailIncome!: DetailIncome;
  client!: Client;
  paymentType!: number;

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit() {
    this.clientService.variableNavbar$.subscribe((valor) => {
      this.isLoggedIn = valor;
    });
    if (this.isLoggedIn) {
      this.products = this.cartService.getCart();
      this.client = this.clientService.clientInfo;
      this.paymentType = this.clientService.payment;
      console.log(this.paymentType);
      this.pay();
    } else {
      this.router.navigate(['/']);
    }
  }

  pay() {
    const generalIncome: GeneralIncome = this.createGeneralIncomeBody(
      this.client,
      this.paymentType
    );
    this.productService.createIncome(generalIncome).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.generalIncome = response[0];
          this.pedido = response[0].FAG_FACTURA_GENERAL || 0;
          let dividedProgress: number = 100 / this.products.length;
          const observables = this.products.map((pr) => {
            const body: DetailIncome = this.createDetailIncomeBody(
              pr,
              response[0].FAG_FACTURA_GENERAL || 0
            );
            return this.productService.createDetailIncome(body).pipe(
              tap({
                next: () => {
                  this.progress = this.progress + dividedProgress;
                  this.productService
                    .updateExistences(pr.ID, pr.UNITS)
                    .subscribe((r) => {
                    });
                },
              })
            );
          });
          this.executeUpload(observables);
          this.cartService.cart = [];
          this.cartService.actualizarVariableNavbar([]);
        }
      },
      complete: () => {
        setTimeout(() => {
          this.isWorking = false;
        }, 3000);
      },
      error: () => {
        console.log('error');
      },
    });
  }

  executeUpload(observables: any) {
    const observableSecuencial = of(...observables).pipe(
      map((observable: any) => observable),
      concatAll()
    );
    observableSecuencial.subscribe({
      complete: () => {
        console.log('terminado');
      },
    });
  }

  createGeneralIncomeBody(client: Client, paymentType: number) {
    const min = 1;
    const max = 5;
    const randomNumber: number = Math.random() * (max - min) + min;
    let total: number = 0;

    this.products.forEach((prod) => {
      total = total + prod.PRICE;
    });

    const body: GeneralIncome = {
      CLI_CLIENTE: client.CLI_CLIENTE,
      SUC_SUCURSAL: randomNumber,
      TPG_TIPO_PAGO: paymentType,
      FAG_TOTAL: total,
    };
    return body;
  }

  createDetailIncomeBody(product: ProductInCart, idGeneral: number) {
    const body: DetailIncome = {
      PRO_PRODUCTO: product.ID,
      FAD_CANTIDAD: product.PRICE,
      FAD_PRECIO: product.UNITS * product.PRICE,
      FAG_FACTURA_GENERAL: idGeneral,
    };
    return body;
  }
}
