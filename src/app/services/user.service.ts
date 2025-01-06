import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { EndPoint } from '../core/enums';

export interface IUser {
  id: string;
  email: string;
  urlPicture: string;
  //   authStrategy: string; // optional
  //   personalData: Partial<PersonalData>;
  //   claims: AppAuthClaims;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}
  public user: IUser | null = null;

  public async findUser(): Promise<IUser> {
    return this.httpService.getDataFromService(EndPoint.GetUser);
  }
}
