import { Component } from '@angular/core';

import { DcLoginComponent } from '@dataclouder/app-auth';

@Component({
  selector: 'app-auth-component',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [DcLoginComponent],
})
export class LoginComponent {}
