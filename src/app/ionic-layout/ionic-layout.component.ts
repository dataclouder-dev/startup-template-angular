import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  IonRouterOutlet,
  IonRouterLink,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonButton,
  IonFooter,
  NavController,
  IonAvatar,
  ActionSheetController,
  IonTab,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  heartOutline,
  heartSharp,
  archiveOutline,
  archiveSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  bookmarkOutline,
  bookmarkSharp,
  library,
  playCircle,
  radio,
  search,
  ellipsisHorizontal,
  ellipsisVertical,
  personCircle,
  helpCircle,
  home,
  homeOutline,
  homeSharp,
  codeWorking,
  codeWorkingOutline,
  codeWorkingSharp,
  eye,
  eyeOutline,
  eyeSharp,
  chatbubbleEllipses,
  chatbubbleEllipsesOutline,
  chatbubbleEllipsesSharp,
} from 'ionicons/icons';
import { RouteNames } from '../core/enums';
import { environment } from 'src/environments/environment';
import { FirebaseAuthService } from '@dataclouder/app-auth';

@Component({
  selector: 'app-ionic-layout',
  templateUrl: './ionic-layout.component.html',
  styleUrl: './ionic-layout.component.css',
  standalone: true,
  imports: [
    IonTab,
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
    CommonModule,
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
    IonRouterOutlet,
    IonMenuToggle,
    IonMenuButton,
  ],
})
export class IonicLayoutComponent implements OnInit {
  public envName = environment.envName;
  public projectName = environment.projectName;
  public version = environment.version;
  public user: any = {};

  public appPages = [
    { title: 'Home', url: '/page/home', icon: 'home' },
    { title: 'Explore', url: '/page/explore', icon: 'eye' },
    { title: 'Test', url: '/page/test', icon: 'code-working' },
    { title: 'Chat', url: '/page/chat', icon: 'chatbubble-ellipses' },
  ];
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
    private navController: NavController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
      home,
      homeOutline,
      homeSharp,
      codeWorking,
      codeWorkingOutline,
      codeWorkingSharp,
      eye,
      eyeOutline,
      eyeSharp,
      chatbubbleEllipses,
      chatbubbleEllipsesOutline,
      chatbubbleEllipsesSharp,
    });
    addIcons({ library, playCircle, radio, search });
    addIcons({ ellipsisHorizontal, ellipsisVertical, helpCircle, personCircle, search });
  }

  ngOnInit(): void {
    this.firebaseAuthService.authState$.subscribe((auth: any) => {
      if (auth) {
        this.user = {
          email: auth.email,
          displayName: auth.displayName,
          photoURL: auth.photoURL,
          emailVerified: auth.emailVerified,
        };
      }

      console.log(this.user);
    });
  }

  logout() {
    console.log('logout');
    this.firebaseAuthService.logOut('/auth/signin');
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
            this.router.navigate(['/profile']);
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
}
