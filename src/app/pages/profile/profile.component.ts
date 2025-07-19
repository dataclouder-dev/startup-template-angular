import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanType, PermissionType, RolType } from '../../dc-user-module/user.class';

import { UserService } from 'src/app/dc-user-module/user.service';
import { IUser } from '@dataclouder/ngx-users';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  public userService = inject(UserService);
  private toastService = inject(TOAST_ALERTS_TOKEN);

  profileForm: FormGroup;

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
        emotionalName: [''],
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
      this.toastService.success({ title: 'Profile updated', subtitle: 'Your profile has been updated successfully' });
      // Handle form submission
    } else {
      console.log('Form is invalid');
      this.toastService.error({ title: 'Form is invalid', subtitle: 'Please fill in all the fields' });
    }
  }

  get nickname() {
    return this.profileForm.get('personalData.nickname');
  }
}
