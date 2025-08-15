import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { ApiBalancerService } from '../api-balancers.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { IApiBalancer } from '../models/api-balancers.model';

@Component({
  selector: 'app-ApiBalancer-detail',
  imports: [JsonPipe],
  templateUrl: './api-balancer-detail.component.html',
  styleUrl: './api-balancer-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiBalancerDetailComponent implements OnInit {
  private ApiBalancerService = inject(ApiBalancerService);
  private activatedRoute = inject(ActivatedRoute);

  public ApiBalancerId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public ApiBalancer = signal<IApiBalancer | null>(null);

  ngOnInit(): void {
    this.loadApiBalancer();
  }

  private async loadApiBalancer() {
    const ApiBalancer = await this.ApiBalancerService.getApiBalancer(this.ApiBalancerId);
    this.ApiBalancer.set(ApiBalancer);
  }
}
