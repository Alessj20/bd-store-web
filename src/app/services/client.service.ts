import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { NewUser } from '../interfaces/new-user.interface';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  variableNavbar$ = this.isLoggedIn.asObservable();

  client!: Client;

  paymentType!: number;

  actualizarVariableNavbar(loggedIn: boolean) {
    this.isLoggedIn.next(loggedIn);
  }

  constructor(private readonly http: HttpClient) { }

  getUserValidation(user: string, password: string): Observable<Client[]> {
    return this.http.get<Client[]>(`http://localhost:3000/user/${user}/${password}`)
  }

  createClient(newUser :NewUser): Observable<User[]> {
    return this.http.post<User[]>(`http://localhost:3000/create-client`, newUser)
  }

  getUser(username: string): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/find-user/${username}`)
  }

  get clientInfo() {
    return this.client;
  }

  set clientInfo(client: Client) {
    this.client = client;
  }

  get payment() {
    return this.paymentType;
  }

  set payment(payment: number) {
    this.paymentType = payment;
  }

}
