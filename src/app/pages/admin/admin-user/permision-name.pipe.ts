import { Pipe, PipeTransform } from '@angular/core';
// import { PermissionsOptions } from 'src/app/core/enums';
// import { PermissionsOptions } from './admin-user.component';

@Pipe({
  name: 'permissionName',
  standalone: true,
})
export class PermissionNamePipe implements PipeTransform {
  transform(type: string): string {
    try {
      // TODO: implement this pipe
      // const permission = PermissionsOptions.find((option) => option.value === type).name;
      // return permission;
      return 'Not Valid: implement this pipe';
    } catch (error) {
      return 'Not Valid: ' + type;
    }
  }
}
