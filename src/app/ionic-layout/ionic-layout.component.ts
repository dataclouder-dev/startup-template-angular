import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterLink,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonTabBar,
  IonTabButton,
  IonButton,
  IonFooter,
  IonAvatar,
  ActionSheetController,
  MenuController,
} from '@ionic/angular/standalone';
import * as ionicons from 'ionicons/icons'; // import all icons

import { LocalJwtAuthService, PlanIconPipe } from '@dataclouder/ngx-auth';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { AppUserService } from 'src/app/services/app-user.service';
import { PwaInstallComponent } from '../components/pwa-install/pwa-install.component';
import { APP_CONFIG } from '@dataclouder/ngx-core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-ionic-layout',
  templateUrl: './ionic-layout.component.html',
  styleUrl: './ionic-layout.component.css',
  standalone: true,
  imports: [
    IonAvatar,
    IonFooter,
    IonButton,
    IonTabButton,
    IonTabBar,
    RouterOutlet,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonHeader,
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonMenuToggle,
    ToggleButtonModule,
    FormsModule,
    PwaInstallComponent,
    ToggleSwitchModule,
    PlanIconPipe,
  ],
})
export class IonicLayoutComponent implements OnInit {
  private localJwtAuthService = inject(LocalJwtAuthService);
  private router = inject(Router);
  private actionSheetController = inject(ActionSheetController);
  private menuController = inject(MenuController);
  public userService = inject(AppUserService);

  private config = inject(APP_CONFIG);

  public envName = this.config.envName;
  public projectName = this.config.projectName;
  public version = this.config.version;
  public user = this.userService.user();
  public menuVisible: boolean = true;

  public appPages = [
    { title: 'Home', url: '/page/home', icon: 'home' },
    { title: 'Lessons', url: '/page/lessons', icon: 'eye' },
    { title: 'Agents Conversation', url: '/page/agents', icon: 'chatbubble-ellipses' },
    { title: 'Suscripción', url: '/page/billing', icon: 'card' },
    { title: 'Profile', url: '/page/stack/profile', icon: 'person' },
  ];

  public adminPages = [
    { title: 'Planes y Precios', url: '/page/admin/pricing', icon: 'pricetag' },
    { title: 'Admin Users', url: '/page/admin/users', icon: 'people' },
    { title: 'Agent Rules', url: '/page/admin/agent-rules', icon: 'receipt' },
    { title: 'Generics', url: '/page/generics', icon: 'code-working' },
    { title: 'Test', url: '/page/test', icon: 'flask' },
    { title: 'AI Playground', url: '/page/ai-playground', icon: 'sparkles' },
    { title: 'Design System', url: '/design-system', icon: 'color-palette' },
  ];

  public testingPages = [{ title: 'Test', url: '/page/test', icon: 'code-working' }];

  // Add this property to track dark mode state
  public isDarkMode: boolean = false;

  constructor() {
    addIcons(ionicons);

    // Check if dark mode was previously enabled
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.initializeDarkMode();
  }

  ngOnInit(): void {
  }

  async logout() {
    this.userService.clearUser();
    await this.localJwtAuthService.logout(false);
    await this.router.navigateByUrl('/');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Actions',
      buttons: [
        {
          text: 'Ir al perfil',
          icon: 'share',
          handler: () => {
            // this.navController.navigateForward(RouteNames.Profile);
            this.router.navigate(['/page/stack/profile']);
          },
        },

        {
          text: 'Cerrar sesión',
          role: 'destructive',
          icon: 'close',
          handler: async () => {
            this.logout();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public goToStack(path: string) {
    // this.navController.navigateForward(path);
    this.router.navigate(['/page/profile']);
  }

  // Update the toggleDarkMode method
  toggleDarkMode() {
    // this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);

    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  // Add this method to initialize dark mode on component creation
  private initializeDarkMode() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);

    document.body.classList.toggle('dark', this.isDarkMode);
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (window.innerWidth > 992) {
      // For desktop view, just enable/disable the menu
      this.menuController.enable(this.menuVisible);
    } else {
      // For mobile view, toggle the menu
      this.menuController.toggle();
    }
  }
}
