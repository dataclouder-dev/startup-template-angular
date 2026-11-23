import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import {
  ProfileFormComponent,
  ProfileSettingsFormComponent,
  ProfileSettingsValue,
  emptyProfileSettings,
} from '@dataclouder/ngx-users';
import { AudioSpeed, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { AppUserService } from 'src/app/services/app-user.service';
import { CardModule } from 'primeng/card';
import { DCConversationUserChatSettingsComponent } from '@dataclouder/ngx-agent-cards';
import { TranslateModule } from '@ngx-translate/core';

export const BaseLanguagesOptions = [
  { name: 'Español 🇪🇦 🇲🇽 ', code: 'es' },
  { name: 'Inglés 🇺🇸 🇬🇧 ', code: 'en' },
];

export const AudioSpeedOptions = [
  { name: 'Muy Lento', code: AudioSpeed.VerySlow },
  { name: 'Lento', code: AudioSpeed.Slow },
  { name: 'Normal', code: AudioSpeed.Regular },
  { name: 'Rápida', code: AudioSpeed.Fast },
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ProfileFormComponent,
    ProfileSettingsFormComponent,
    CardModule,
    DCConversationUserChatSettingsComponent,
    TranslateModule,
  ],
})
export class ProfileComponent {
  public userService = inject(AppUserService);
  private toastService = inject(TOAST_ALERTS_TOKEN);
  public hiddenFields = { targetLanguage: true };
  public audioSpeedOptions = AudioSpeedOptions;
  public baseLanguagesOptions = BaseLanguagesOptions;

  public settingsModel = signal<ProfileSettingsValue>({
    ...emptyProfileSettings(),
    audioSpeed: AudioSpeed.Regular,
  });

  public saveData(event: unknown) {
    console.log(event);
  }
}
