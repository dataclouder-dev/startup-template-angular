import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { GenericService } from '../generics.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { IGeneric } from '../models/generics.model';

@Component({
  selector: 'app-generic-detail',
  imports: [JsonPipe],
  templateUrl: './generic-detail.component.html',
  styleUrl: './generic-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDetailComponent implements OnInit {
  private genericService = inject(GenericService);
  private activatedRoute = inject(ActivatedRoute);

  public genericId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public generic = signal<IGeneric | null>(null);

  ngOnInit(): void {
    this.loadGeneric();
  }

  private async loadGeneric() {
    const generic = await this.genericService.getGeneric(this.genericId);
    this.generic.set(generic);
  }
}
