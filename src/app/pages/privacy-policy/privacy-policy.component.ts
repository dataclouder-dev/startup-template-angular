import { Component } from '@angular/core';
import { RouteNames } from 'src/app/core/enums';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class PrivacyPolicyComponent {
  public routesNames = RouteNames;
}
