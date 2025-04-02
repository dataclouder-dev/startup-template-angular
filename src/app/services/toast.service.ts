import { Injectable, inject } from '@angular/core';
import { ToastAlertsAbstractService, ToastData } from '@dataclouder/ngx-core';
import { ToastController } from '@ionic/angular';
// import { ToastAlertsAbstractService, ToastData } from '@dataclouder/ngx-agent-cards';

@Injectable({
  providedIn: 'root',
})
export class ToastAlertService extends ToastAlertsAbstractService {
  private toastController = inject(ToastController);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  private async presentToast(data: ToastData, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: `${data.title}: ${data.subtitle}`,
      color: color,
      duration: duration,
      position: 'bottom',
    });
    toast.present();
  }

  public success(data: ToastData) {
    this.presentToast(data, 'success', 4000);
  }

  info(data: ToastData): void {
    this.presentToast(data, 'primary', 4000);
  }

  warn(data: ToastData): void {
    this.presentToast(data, 'warning', 4500);
  }

  error(data: ToastData): void {
    this.presentToast(data, 'danger', 4000);
  }
}
