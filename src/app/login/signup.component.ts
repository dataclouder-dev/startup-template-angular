import { Component, OnInit } from '@angular/core';
import { DCSignupComponent } from '@dataclouder/app-auth';

// TODO: Creo que este no lo utilizo

@Component({
  selector: 'app-signup-neuro',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [DCSignupComponent],
})
export class AppSignupComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('SignupComponent ngOnInit');
  }
}
