import { Component, inject } from '@angular/core';
import { DcOtpLoginComponent, LocalJwtAuthResponse } from '@dataclouder/ngx-auth';
import { DcAnalyticsService } from '@dataclouder/ngx-analytics';

@Component({
  selector: 'app-auth-component',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [DcOtpLoginComponent],
})
export class LoginComponent {
  private readonly analytics = inject(DcAnalyticsService);

  onAuthenticated(res: LocalJwtAuthResponse): void {
    const userId = res.user.userId || res.user.uid;
    if (userId) {
      this.analytics.identify(userId);
    }
    this.analytics.track('signup', { source: 'signin' });
  }
}
