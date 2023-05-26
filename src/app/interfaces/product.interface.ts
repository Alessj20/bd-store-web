export interface Product {
  ID: number;
  DESCRIPTION: string;
  NAME: string;
  PRICE: number;
  EXISTENCE: number;
  IMAGEN: string;
}

export interface ProductInCart {
  ID: number;
  DESCRIPTION: string;
  NAME: string;
  PRICE: number;
  EXISTENCE: number;
  IMAGEN: string;
  UNITS: number;
}
