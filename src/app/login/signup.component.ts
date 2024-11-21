import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService, SharedLoginComponent, SignupComponent } from '@dataclouder/app-auth';

@Component({
  selector: 'app-signup-neuro',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [SignupComponent],
})
export class AppSignupComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('SignupComponent ngOnInit');
  }
}
