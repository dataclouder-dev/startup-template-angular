import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import {
  ProfileFormComponent,
  ProfileSettingsFormComponent,
  ProfileSettingsValue,
  emptyProfileSettings,
} from '@dataclouder/ngx-users';
import { AudioSpeed, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { AppUserService } from 'src/app/services/app-user.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
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
    DatePipe,
    RouterLink,
    IonicModule,
    ProfileFormComponent,
    ProfileSettingsFormComponent,
    ButtonModule,
    CardModule,
    TagModule,
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

  public planExpirationDate = computed<Date | null>(() => {
    const rawExp = this.userService.user()?.claims?.plan?.exp;
    if (!rawExp) return null;
    const parsed = new Date(rawExp);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  });

  public settingsModel = signal<ProfileSettingsValue>({
    ...emptyProfileSettings(),
    audioSpeed: AudioSpeed.Regular,
  });

  public saveData(event: unknown) {
    console.log(event);
  }
}
