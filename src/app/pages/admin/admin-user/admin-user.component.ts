import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { Endpoints } from 'src/app/core/enums';

import { AppAuthClaims, ExpireDateOptions, PermissionType, PlanOptions, RolOptions, RolType } from 'src/app/dc-user-module/user.class';
import { HttpService } from 'src/app/services/http.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { PermissionNamePipe } from './permision-name.pipe';

type InputClaim = {
  type: string;
  expMonths: number | null;
  exp: Date | null;
  num?: number | null;
};

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, JsonPipe, PermissionNamePipe, KeyValuePipe, IonicModule],
})
export class AdminUserComponent {
  private formBuilder = inject(FormBuilder);
  private httpService = inject(HttpService);
  private toastController = inject(ToastController);

  public userType = PermissionType;
  public permissions = PermissionType;
  public deleteUserForm = '';
  // variables for  enums options
  public permissionsOptions: any = [];
  public rolOptions = RolOptions;
  public expireDateOptions = ExpireDateOptions;

  public userClaims: AppAuthClaims = {} as AppAuthClaims;

  public permissionInput: InputClaim = { type: '', expMonths: null, exp: null, num: null };

  public rolInput: InputClaim = { type: '', expMonths: null, exp: null };

  public plaModel: RolType = RolType.Admin;

  public planInput: InputClaim = { type: '', expMonths: null, exp: null };

  public planExpireDate: Date = new Date();
  public existingUser = false;

  public planOptions = PlanOptions;

  public formGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    plan: this.formBuilder.group({
      type: [''],
      exp: [null as Date | null],
    }),
    permissions: this.formBuilder.group<any>([]),
    roles: this.formBuilder.group<any>([]),
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  public resetForm(): void {
    this.formGroup.controls.roles = this.formBuilder.group<any>([]);
    this.formGroup.controls.permissions = this.formBuilder.group<any>([]);
    this.formGroup.controls.plan.reset();
  }

  private addPermission(permission: string, permissionObj: any): void {
    if (this.formGroup.controls.permissions.get(permission)) {
      // this.formGroup.controls.permissions.get(permission).setValue(permissionObj);
    } else {
      this.formGroup.controls.permissions.addControl(permission, new FormControl(permissionObj));
    }
  }

  private addRolControl(rol: string, expireDate: Date | null): void {
    if (this.formGroup.controls.roles.get(rol)) {
      this.formGroup.controls.roles.get(rol)?.setValue(expireDate);
    } else {
      this.formGroup.controls.roles.addControl(rol, new FormControl(expireDate));
    }
    console.log('addRolControl', this.formGroup.controls.roles);
  }

  public removeControl(controlName: string, control: any): void {
    // this.formGroup.controls[controlName].removeControl(control);
    this.formGroup.updateValueAndValidity();
  }

  public addPermissionFormGroup(): void {
    const permissionObj: { exp: Date | null; num?: number } = { exp: this.permissionInput.exp };
    if (this.permissionInput.num) {
      permissionObj.num = this.permissionInput.num;
    }
    this.addPermission(this.permissionInput.type, permissionObj);
  }

  public addRolFormGroup(): void {
    if (!this.rolInput.type) {
      alert('Debe seleccionar un rol');
      return;
    }
    this.addRolControl(this.rolInput.type, this.rolInput.exp);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  public async getUserClaims() {
    this.resetForm();
    const email = this.formGroup.value.email;
    if (!email) return;

    this.formGroup.controls.email.setValue(email.toLowerCase());

    this.existingUser = false;

    const claims = await this.httpService.getDataFromService<AppAuthClaims>(`${Endpoints.Admin.Claims}/${email}`);
    this.userClaims = { ...claims };

    console.log('claims', claims);
    await this.showToast(`Se obtuvieron los datos del usuario ${email}`);
    this.existingUser = true;
    if (claims.permissions) {
      Object.keys(claims.permissions).forEach(key => {
        this.addPermission(key, claims.permissions[key as keyof typeof claims.permissions]);
      });
    }

    if (claims.roles) {
      Object.keys(claims.roles).forEach(key => {
        this.addRolControl(key, claims.roles?.[key as keyof typeof claims.roles]);
      });
    }

    if (claims.plan) {
      this.formGroup.controls.plan.setValue({ type: claims.plan.type, exp: claims?.plan?.exp || null });
    }
  }

  public changePlan() {
    this.calculateExpireDate(this.planInput);

    this.formGroup.controls.plan.setValue({
      type: this.planInput.type,
      exp: this.planInput.exp,
    });
  }

  public async updateUser() {
    this.formGroup.updateValueAndValidity();

    const updatedData: any = this.formGroup.value;
    try {
      // TODO: check that the endpoint is correct
      const claims = await this.httpService.postDataToService(Endpoints.Admin.Claims, updatedData);
      await this.showToast(`Los cambios se verán reflejados la próxima vez que ${updatedData.email} inicie sesión`);

      // if (this.userService.getUserSnapshot().email === updatedData.email) {
      //   await this.userService.updateUserClaimsAndRefresh(claims);
      // }
    } finally {
      console.log('finally');
    }
  }

  public calculateExpireDate(input: InputClaim) {
    // const date = new Date();
    // if (input.expMonths == null) {
    //   input.exp = null;
    //   return;
    // } else {
    //   input.exp = addMonths(date, input.expMonths);
    // }
  }

  public async deleteUser() {
    const isConfirmed = confirm('¿Está seguro que desea eliminar el usuario?');
    if (isConfirmed) {
      const email = this.deleteUserForm;
      try {
        await this.httpService.deleteDataFromService(`${Endpoints.AdminUser}/${email}`);
        await this.showToast(`El usuario ${email} fue eliminado`);
      } finally {
        this.deleteUserForm = '';
      }
    }
  }
}
