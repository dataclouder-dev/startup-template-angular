import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser, PlanType, PermissionType, RolType } from '../../dc-user-module/user.class';

import { UserService } from 'src/app/dc-user-module/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  profileForm: FormGroup;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.profileForm = this.fb.group({
      id: [''],
      urlPicture: [''],
      email: [''],
      personalData: this.fb.group({
        nickname: [''],
        username: [''],
        firstname: [''],
        lastname: [''],
        gender: [''],
        birthday: [null],
      }),
    });

    const user = this.userService.getUser();
    if (user) {
      this.profileForm.patchValue(user);
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.profileForm.valid) {
      const userData: IUser = this.profileForm.value;
      console.log('Form submitted:', userData);
      this.userService.saveUser(userData);
      // Handle form submission
    }
  }

  get nickname() {
    return this.profileForm.get('personalData.nickname');
  }
}
