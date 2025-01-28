import { DatePipe, JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FirebaseAuthService } from '@dataclouder/app-auth';
// import { addMonths } from 'date-fns';
import { EndPoint } from 'src/app/core/enums';
import { AppAuthClaims, ExpireDateOptions, PermissionType, PlanOptions, RolOptions, RolType } from 'src/app/dc-user-module/user.class';
import { UserService } from 'src/app/dc-user-module/user.service';
import { HttpService } from 'src/app/services/http.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { PermissionNamePipe } from './permision-name.pipe';

// import { AdminApi, ExpireDateOptions, PermissionType, PermissionsOptions, PlanOptions, RolOptions, RolType } from 'src/app/core/enums';
// import { ToastService } from 'src/app/core/system/toast.service';
// import { HttpService } from 'src/app/core/system/http.service';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { DropdownModule } from 'primeng/dropdown';
// import { AppAuthClaims } from 'src/app/core/classes';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { JsonPipe, NgFor, DatePipe, NgIf, KeyValuePipe } from '@angular/common';
// import { PermissionNamePipe } from './permision-name.pipe';
// import { CalendarModule } from 'primeng/calendar';
// import { UserService } from 'src/app/core/data-services/user.service';
// import { FirebaseAuthService } from 'src/app/core/firebase-auth.service';

type InputClaim = {
  type: string;
  expMonths: number | null;
  exp: Date | null;
  num?: number | null;
};

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, JsonPipe, NgFor, NgIf, PermissionNamePipe, KeyValuePipe, IonicModule],
})
export class AdminUserComponent {
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

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    // private toastrService: ToastService,
    private userService: UserService,
    private firebaseAuthService: FirebaseAuthService,
    private toastController: ToastController
  ) {}

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

    const claims = await this.httpService.getDataFromService<AppAuthClaims>(`${EndPoint.Admin.Claims}/${email}`);
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
      const claims = await this.httpService.postDataToService(EndPoint.Admin.Claims, updatedData);
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
        await this.httpService.deleteDataFromService(`${EndPoint.AdminUser}/${email}`);
        await this.showToast(`El usuario ${email} fue eliminado`);
      } finally {
        this.deleteUserForm = '';
      }
    }
  }
}
