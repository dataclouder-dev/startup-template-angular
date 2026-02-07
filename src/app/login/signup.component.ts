import { Component, OnInit } from '@angular/core';
import { DCSignupComponent } from '@dataclouder/ngx-auth';

// TODO: Creo que este no lo utilizo

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [DCSignupComponent],
})
export class AppSignupComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('SignupComponent ngOnInit');
  }
}
