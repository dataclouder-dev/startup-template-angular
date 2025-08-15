
import { Component, HostListener } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pwa-install',
  templateUrl: './pwa-install.component.html',
  styleUrls: ['./pwa-install.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon],
})
export class PwaInstallComponent {
  installPrompt: any = null;

  constructor() {
    addIcons({ downloadOutline });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    console.log('PWA install prompt event fired.');
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later.
    this.installPrompt = event;
  }

  installPwa(): void {
    if (!this.installPrompt) {
      alert('No install prompt available');
      return;
    }
    console.log('Installing PWA...');
    this.installPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the prompt
      this.installPrompt = null;
    });
  }
}
