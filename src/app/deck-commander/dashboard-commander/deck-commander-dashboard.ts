import { Component, OnInit, OnDestroy, Inject, Renderer2, HostListener, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DeckCommanderService } from '../deck-commanders.service';
import { IDeckCommander } from '../models/deck-commanders.model';

@Component({
  selector: 'app-deck-commander',
  templateUrl: './deck-commander-dashboard.html',
  styleUrls: ['./deck-commander-dashboard.scss'],
})
export class DeckCommanderComponent implements OnInit, OnDestroy {
  private deckCommanderService = inject(DeckCommanderService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  buttons = signal<IDeckCommander[]>([]);
  status = signal('Ready');

  private kioskExitListeners: (() => void)[] = [];

  constructor() {}

  ngOnInit() {
    this.updateStatus('Stream Deck Ready');
    this.deckCommanderService.getDeckCommanders().then(deckCommanders => {
      this.buttons.set(deckCommanders);
    });
  }

  ngOnDestroy() {
    this.kioskExitListeners.forEach(listener => listener());
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  handleFullscreenChange() {
    const isFullscreen =
      this.document.fullscreenElement ||
      (this.document as any).webkitFullscreenElement ||
      (this.document as any).mozFullScreenElement ||
      (this.document as any).msFullscreenElement;

    const fullscreenBtn = this.document.getElementById('fullscreenBtn');
    if (isFullscreen) {
      if (fullscreenBtn) fullscreenBtn.textContent = '🔲 Exit Fullscreen';
      this.updateStatus('Fullscreen mode enabled');
    } else {
      if (fullscreenBtn) fullscreenBtn.textContent = '🔳 Fullscreen';
      this.updateStatus('Fullscreen mode disabled');
      this.exitKioskMode(false); // Ensure kiosk mode is also exited
    }
  }

  handleButtonPress(button: IDeckCommander) {
    if (!button) return;

    this.executeCommand(button);
    const buttonElement = this.document.querySelector(`[data-id="${button.id}"]`);
    if (buttonElement) {
      this.animateButton(buttonElement as HTMLElement);
    }

    if (button.action && typeof (this as any)[button.action] === 'function') {
      (this as any)[button.action]();
    }

    this.updateStatus(`${button.name} activated`);

    setTimeout(() => {
      this.updateStatus('Ready');
    }, 2000);
  }

  animateButton(element: HTMLElement) {
    this.renderer.addClass(element, 'active');
    setTimeout(() => {
      this.renderer.removeClass(element, 'active');
    }, 200);
  }

  updateStatus(message: string) {
    this.status.set(message);
  }

  toggleFullscreen() {
    if (
      !this.document.fullscreenElement &&
      !(this.document as any).webkitFullscreenElement &&
      !(this.document as any).mozFullScreenElement &&
      !(this.document as any).msFullscreenElement
    ) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const elem = this.document.documentElement as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    const doc = this.document as any;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }

  enterKioskMode() {
    this.renderer.setStyle(this.document.querySelector('.header'), 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.fullscreen-controls'), 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.status'), 'display', 'none');
    this.enterFullscreen();
    this.renderer.setStyle(this.document.body, 'cursor', 'none');
    this.setupKioskExit();
    this.updateStatus('Kiosk mode enabled - swipe from top to exit');
  }

  setupKioskExit() {
    let startY = 0;
    let isSwipeFromTop = false;

    const touchstartListener = this.renderer.listen(this.document, 'touchstart', (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isSwipeFromTop = startY < 50;
    });

    const touchmoveListener = this.renderer.listen(this.document, 'touchmove', (e: TouchEvent) => {
      if (isSwipeFromTop) {
        const currentY = e.touches[0].clientY;
        const swipeDistance = currentY - startY;
        if (swipeDistance > 100) {
          this.exitKioskMode();
        }
      }
    });

    this.kioskExitListeners.push(touchstartListener, touchmoveListener);
  }

  exitKioskMode(doExitFullscreen = true) {
    this.renderer.setStyle(this.document.querySelector('.header'), 'display', 'block');
    this.renderer.setStyle(this.document.querySelector('.fullscreen-controls'), 'display', 'flex');
    this.renderer.setStyle(this.document.querySelector('.status'), 'display', 'block');
    this.renderer.setStyle(this.document.body, 'cursor', 'default');

    if (doExitFullscreen) this.exitFullscreen();

    this.updateStatus('Kiosk mode disabled');
    this.kioskExitListeners.forEach(listener => listener());
    this.kioskExitListeners = [];
  }

  toggleMic() {
    this.updateStatus('Microphone toggled');
  }
  toggleCamera() {
    this.updateStatus('Camera toggled');
  }
  toggleScreen() {
    this.updateStatus('Screen share toggled');
  }
  toggleMusic() {
    this.updateStatus('Music toggled');
  }
  toggleLights() {
    this.updateStatus('Lights toggled');
  }
  openDiscord() {
    this.updateStatus('Opening Discord...');
  }
  openOBS() {
    this.updateStatus('Opening OBS Studio...');
  }
  openTwitter() {
    this.updateStatus('Opening Twitter...');
  }
  adjustVolume() {
    this.updateStatus('Volume adjusted');
  }
  startTimer() {
    this.updateStatus('Timer started');
  }
  showWeather() {
    this.updateStatus('Showing weather...');
  }
  openSettings() {
    this.updateStatus('Opening settings...');
  }

  public async executeCommand(deckCommander: IDeckCommander) {
    const results = await this.deckCommanderService.executeCommand(deckCommander);
    this.updateStatus('Command executed');
    debugger;
  }
}
