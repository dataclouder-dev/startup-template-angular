import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { DeckCommanderService } from '../deck-commanders.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { IDeckCommander } from '../models/deck-commanders.model';

@Component({
  selector: 'app-DeckCommander-detail',
  imports: [JsonPipe],
  templateUrl: './deck-commander-detail.component.html',
  styleUrl: './deck-commander-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckCommanderDetailComponent implements OnInit {
  private DeckCommanderService = inject(DeckCommanderService);
  private activatedRoute = inject(ActivatedRoute);

  public DeckCommanderId: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public DeckCommander = signal<IDeckCommander | null>(null);

  ngOnInit(): void {
    this.loadDeckCommander();
  }

  private async loadDeckCommander() {
    const DeckCommander = await this.DeckCommanderService.getDeckCommander(this.DeckCommanderId);
    this.DeckCommander.set(DeckCommander);
  }
}
