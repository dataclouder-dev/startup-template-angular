import { Injectable, inject } from '@angular/core';
import { ToastAlertsAbstractService, ToastData } from '@dataclouder/ngx-core';
import { ToastController } from '@ionic/angular';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastAlertService extends ToastAlertsAbstractService {
  private toastController = inject(ToastController);
  private messageService = inject(MessageService);

  private async presentToast(data: ToastData, color: string, duration: number, icon: string) {
    const toast = await this.toastController.create({
      message: `${data.title}: ${data.subtitle}`,
      color: color,
      duration: duration,
      position: 'top',
      icon: icon,
    });
    toast.present();
  }

  // All toast ionic
  // public success(data: ToastData) {
  //   this.presentToast(data, 'success', 3000, 'thumbs-up-outline');
  // }

  // info(data: ToastData): void {
  //   this.presentToast(data, 'primary', 3000, 'information-circle-outline');
  // }

  // warn(data: ToastData): void {
  //   this.presentToast(data, 'warning', 4500, 'warning-outline');
  // }

  // error(data: ToastData): void {
  //   this.presentToast(data, 'danger', 4000, 'alert-circle-outline');
  // }

  public success(data: ToastData) {
    this.messageService.add({
      key: 'main-toast',
      severity: 'success',
      summary: data.title,
      detail: data.subtitle,
      life: 4000,
    });
  }

  info(data: ToastData): void {
    this.messageService.add({
      key: 'main-toast',
      severity: 'info',
      summary: data.title,
      detail: data.subtitle,
      life: 4000,
    });
  }

  warn(data: ToastData): void {
    this.messageService.add({
      key: 'main-toast',
      severity: 'warn',
      summary: data.title,
      detail: data.subtitle,
      life: 4500,
    });
  }

  error(data: ToastData): void {
    try {
      this.messageService.add({
        key: 'main-toast',
        severity: 'error',
        summary: data.title,
        detail: data.subtitle,
        life: 4000,
      });
    } catch (error) {
      console.error('Error en ToastService.error');
    }
  }
}
