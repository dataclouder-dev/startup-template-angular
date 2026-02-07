import { Injectable, inject } from '@angular/core';
import { UserService } from '@dataclouder/ngx-users';

@Injectable({
  providedIn: 'root',
})
export class AppUserService extends UserService {
  constructor() {
    super();
    console.log(`%c AppUserService instantiated: ${Math.random()}`, 'color: #ff00ff; font-weight: bold; padding: 2px 4px; border: 1px solid #ff00ff;');
  }

  override getUserDataInformation(): string {
    return 'There is no user data yet';
  }
}
