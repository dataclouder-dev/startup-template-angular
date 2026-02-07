import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonFooter, IonApp } from '@ionic/angular/standalone';
import { APP_CONFIG } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-stack-ionic',
  standalone: true,
  imports: [IonApp, IonFooter, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, RouterOutlet],
  templateUrl: './stack-ionic.component.html',
  styleUrl: './stack-ionic.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackIonicComponent implements OnInit {
  private config = inject(APP_CONFIG);
  private router = inject(Router);

  public currentPath: string = ' ';

  public projectName = this.config.projectName;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }
}
