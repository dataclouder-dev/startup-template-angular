import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser, PlanType, PermissionType, RolType } from '../../dc-user-module/user.class';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/dc-user-module/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
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
