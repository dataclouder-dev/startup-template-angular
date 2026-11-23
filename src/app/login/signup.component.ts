import { Component, inject } from '@angular/core';
import { DcOtpLoginComponent, LocalJwtAuthResponse } from '@dataclouder/ngx-auth';
import { DcAnalyticsService } from '@dataclouder/ngx-analytics';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [DcOtpLoginComponent],
})
export class AppSignupComponent {
  private readonly analytics = inject(DcAnalyticsService);

  onAuthenticated(res: LocalJwtAuthResponse): void {
    const userId = res.user.userId || res.user.uid;
    if (userId) {
      this.analytics.identify(userId);
    }
    this.analytics.track('signup', { source: 'signup' });
  }
}
