import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import * as ionicons from 'ionicons/icons'; // import all icons

import { addIcons } from 'ionicons';

import { environment } from 'src/environments/environment';
import { FirebaseAuthService } from '@dataclouder/app-auth';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, MenuController } from '@ionic/angular';
import {
  IonApp,
  IonIcon,
  IonSplitPane,
  IonTabButton,
  IonTabBar,
  IonContent,
  IonAvatar,
  IonList,
  IonButton,
  IonListHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonHeader,
  IonNote,
  IonFooter,
  IonMenu,
  IonMenuToggle,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ionic-layout',
  templateUrl: './ionic-layout.component.html',
  styleUrl: './ionic-layout.component.css',
  standalone: true,
  imports: [
    IonFooter,
    IonNote,
    IonHeader,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonListHeader,
    IonButton,
    IonList,
    IonAvatar,
    IonContent,
    IonTabBar,
    IonTabButton,
    IonSplitPane,
    IonIcon,
    IonApp,
    IonMenu,
    IonMenuToggle,
    IonItem,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToggleButtonModule,
    FormsModule,
  ],
})
export class IonicLayoutComponent implements OnInit {
  private firebaseAuthService = inject(FirebaseAuthService);
  private router = inject(Router);
  private actionSheetController = inject(ActionSheetController);
  private menuController = inject(MenuController);

  public envName = environment.envName;
  public projectName = environment.projectName;
  public version = environment.version;
  public user: any = {};
  public menuVisible: boolean = true;

  public appPages = [
    { title: 'Home', url: '/page/home', icon: 'home' },
    { title: 'Lessons', url: '/page/lessons', icon: 'eye' },
    { title: 'Agents Conversation', url: '/page/chat', icon: 'chatbubble-ellipses' },
    { title: 'Generics', url: '/page/generics', icon: 'code-working' },
    { title: 'Test', url: '/page/test', icon: 'code-working' },
  ];

  public adminPages = [
    { title: 'Admin Users', url: '/page/admin-user', icon: 'people' },
    { title: 'Admin Other', url: '/page/admin-other', icon: 'settings' },
  ];

  public testingPages = [{ title: 'Test', url: '/page/test', icon: 'code-working' }];

  public isAdmin: boolean = false;

  // Add this property to track dark mode state
  public isDarkMode: boolean = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    addIcons(ionicons);

    // Check if dark mode was previously enabled
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.initializeDarkMode();
  }

  ngOnInit(): void {
    this.firebaseAuthService.authState$.subscribe((auth: any) => {
      if (auth) {
        this.user = {
          email: auth.email,
          displayName: auth.displayName,
          photoURL: auth.photoURL,
          emailVerified: auth.emailVerified,
          isAdmin: auth.email === 'admin@example.com',
        };
        // this.isAdmin = this.user.isAdmin;
        this.isAdmin = true;
      }

      console.log(this.user);
    });
  }

  logout() {
    console.log('logout');
    this.firebaseAuthService.logOut('/');
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
