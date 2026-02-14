import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Live2dService } from '../live2ds.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ILive2d } from '../models/live2ds.model';

@Component({
  selector: 'app-live2d-detail',
  imports: [JsonPipe],
  templateUrl: './live2d-detail.component.html',
  styleUrl: './live2d-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Live2dDetailComponent implements OnInit {
  private live2dService = inject(Live2dService);
  private activatedRoute = inject(ActivatedRoute);

  public live2dId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public live2d = signal<ILive2d | null>(null);

  ngOnInit(): void {
    this.loadLive2d();
  }

  private async loadLive2d() {
    const live2d = await this.live2dService.findOne(this.live2dId);
    this.live2d.set(live2d);
  }
}
