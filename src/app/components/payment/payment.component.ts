import { Component } from '@angular/core';
import { PaymentMethods } from 'src/app/interfaces/payment-methods.interface';
import { ProductInCart } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  state: string = '';
  city: string = '';
  complement: string = '';
  fiscalName: string = '';
  nit: string = '';
  fiscalAddress: string = '';
  autocompleteBillingAddress: boolean = true;
  paymentType!: number;
  paymentMethods: PaymentMethods[] = [];
  cart: ProductInCart[] = [];
  total: number = 0;
  card!: string;
  cardtype!: string;
  month!: string;
  year!: string;
  cvv!: string;
  months: string[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  years: string[] = [
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
  ];
  tiposTarjeta = {
    VISA: 'Visa',
    MASTERCARD: 'Mastercard',
    DESCONOCIDA: 'Desconocida',
  };
  isLoggedIn: boolean = false;
  client!: Client;

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly clientService: ClientService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.clientService.variableNavbar$.subscribe((valor) => {
      this.isLoggedIn = valor;
    });
    if (this.isLoggedIn) {
      this.cart = this.cartService.getCart();
      this.setTotal();
      this.getPayments();
      this.fillClientInfo();
    } else {
      this.router.navigate(['/']);
    }
  }

  fillClientInfo() {
    this.client = this.clientService.clientInfo;
    this.state = this.client.CLI_DEPARTAMENTO || '';
    this.city = this.client.CLI_CIUDAD_RESIDENCIA || '';
    this.complement = this.client.CLI_DIRECCION || '';
    this.fiscalName =
      this.client.CLI_PRIMER_NOMBRE +
      ' ' +
      this.client.CLI_SEGUNDO_NOMBRE +
      ' ' +
      this.client.CLI_PRIMER_APELLIDO +
      ' ' +
      this.client.CLI_SEGUNDO_APELLIDO;
    this.nit = this.client.CLI_NIT || '';
    this.fiscalAddress =
      this.client.CLI_DEPARTAMENTO +
      ' ' +
      this.client.CLI_CIUDAD_RESIDENCIA +
      ' ' +
      this.client.CLI_DIRECCION +
      ' ';
  }

  setTotal() {
    this.cart.forEach((product) => {
      this.total = this.total + product.PRICE * product.UNITS;
    });
  }

  getPayments() {
    this.productService.getPaymentMethods().subscribe((response) => {
      this.paymentMethods = response;
    });
  }

  validarTarjeta() {
    this.card = this.card.replace(/\s+/g, '').replace(/-/g, '');
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(this.card)) {
      this.cardtype = this.tiposTarjeta.VISA;
    } else if (/^5[1-5][0-9]{14}$/.test(this.card)) {
      this.cardtype = this.tiposTarjeta.MASTERCARD;
    } else {
      this.cardtype = this.tiposTarjeta.DESCONOCIDA;
    }
  }

   setPayment() {
    this.clientService.payment = this.paymentType;
   }
}
