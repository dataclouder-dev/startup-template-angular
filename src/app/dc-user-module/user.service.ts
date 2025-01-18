import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Endpoints } from '../core/enums';
import { IPersonalData, IUser } from './user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}
  public user: IUser | null = null;

  public async findUserWithToken(): Promise<IUser | null> {
    this.user = await this.httpService.getDataFromService(Endpoints.GetUser);
    return this.user;
  }

  public getUser(): IUser | null {
    return this.user;
  }

  public async saveUser(user: Partial<IUser>) {
    // need id and whatever attribute to update {id: 1, settings: {}}
    try {
      const results = await this.httpService.postDataToService(Endpoints.PostUser, user);
      // this.user = user;
      return results;
    } catch (err) {
      console.log('error updating user');
    }
  }
}
