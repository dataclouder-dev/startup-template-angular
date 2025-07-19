import { Injectable, inject } from '@angular/core';
import { UserDataExchange, UserDataExchangeAbstractService } from '@dataclouder/ngx-agent-cards';
import { UserService } from '../dc-user-module/user.service';
import { ChatUserSettings } from '@dataclouder/ngx-core';

@Injectable({
  providedIn: 'root',
})
export class UserDataExchangeService implements UserDataExchangeAbstractService {
  private userService = inject(UserService);

  getUserDataDescriptions(): { key: string; value: any; description: string }[] {
    return [];
  }
  getUserDataInformation(): string {
    return 'There is no user data yet';
  }

  constructor() {}

  getUserDataExchange(): UserDataExchange {
    const userData = this.userService.getUser()?.personalData;

    // TODO: Get age from birthday
    return {
      name: userData?.firstname || 'Usuario',
      gender: userData?.gender || 'Masculino',
      imgUrl: 'assets/defaults/images/default_conversation_card.webp',
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

  getUserChatSettings(): ChatUserSettings {
    const settings = {
      realTime: true,
      superHearing: true,
      repeatRecording: true,
      fixGrammar: true,
      synthVoice: true,
      userMessageTask: false,
      assistantMessageTask: false,
    };
    return settings;
  }
}
