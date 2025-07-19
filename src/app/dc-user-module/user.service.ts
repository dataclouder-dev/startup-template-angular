import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Endpoints } from '../core/enums';
import { IUser } from '@dataclouder/ngx-users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpService = inject(HttpService);

  public user: WritableSignal<IUser | null> = signal(null);

  public async findUserWithToken(): Promise<IUser | null> {
    const userData = await this.httpService.getDataFromService<IUser | null>(Endpoints.GetUser);
    this.user.set(userData);
    console.log(this.user());
    return this.user();
  }

  public getUser(): IUser | null {
    return this.user();
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
