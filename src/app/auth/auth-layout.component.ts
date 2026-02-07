import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { APP_CONFIG } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-auth-layout',
  template: `
    <div class="main-content">
      <div>
        <h1 class="title"><img routerLink="/" style="width: 120px" src="assets/defaults/icons/logo.svg" alt="Logo" /></h1>
      </div>

      <router-outlet></router-outlet>

      <p class="info-version">{{ envName }} {{ version }}</p>
    </div>
  `,
  styles: [
    `
      .main-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
      }
      .title {
        margin-bottom: 2rem;
      }
      .info-version {
        position: absolute;
        bottom: 1rem;
        font-size: 0.8rem;
        color: #888;
      }
    `,
  ],
  standalone: true,
  imports: [RouterOutlet, RouterLink, CardModule],
})
export class AuthLayoutComponent {
  private config = inject(APP_CONFIG);
  public envName = this.config.envName;
  public version = this.config.version;
}
