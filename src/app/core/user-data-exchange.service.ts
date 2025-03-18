import { Injectable } from '@angular/core';
import { UserDataExchange, UserDataExchangeAbstractService } from '@dataclouder/ngx-agent-cards';
import { UserService } from '../dc-user-module/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataExchangeService implements UserDataExchangeAbstractService {
  constructor(private userService: UserService) {}

  getUserDataExchange(): UserDataExchange {
    const userData = this.userService.getUser()?.personalData;

    // TODO: Get age from birthday
    return {
      name: userData?.firstname || 'Usuario',
      gender: userData?.gender || 'Masculino',
      // age: new Date().getFullYear() - new Date(userData?.birthday).getFullYear(),
      age: 20,
    };
  }

  getParseDict(): { [key: string]: string } {
    // sustituye todos los {{char}} {{user}} {{target}} {{base}} por el valor de la propiedad

    const userData = this.getUserDataExchange();

    return {
      user: userData.name,
    };
  }
}
