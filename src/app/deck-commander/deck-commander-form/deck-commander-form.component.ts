import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DeckCommanderService } from '../deck-commanders.service';
import { CommandType, IDeckCommander } from '../models/deck-commanders.model';
import { ReactiveFormsModule } from '@angular/forms';
import { EntityBaseFormComponent } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-deck-commander-form',
  imports: [ReactiveFormsModule, CardModule, TextareaModule, ButtonModule, SelectModule, InputTextModule],
  templateUrl: './deck-commander-form.component.html',
  styleUrl: './deck-commander-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DeckCommanderFormComponent extends EntityBaseFormComponent<IDeckCommander> {
  protected entityCommunicationService = inject(DeckCommanderService);
  private fb = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    img: [''],
    type: [null, Validators.required],
    command: [''],
    action: [''],
    emoji: [''],
  });

  protected override patchForm(entity: IDeckCommander): void {
    this.form.patchValue(entity);
  }

  public deckCommanderId: string | null = null;

  public commandTypes = Object.values(CommandType).map(value => ({ label: value, value }));

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.deckCommanderId = this.route.snapshot.params['id'];
    if (this.deckCommanderId) {
      const deckCommander = await this.entityCommunicationService.getDeckCommander(this.deckCommanderId);
      if (deckCommander) {
        this.form.patchValue(deckCommander);
      }
    }
  }

  public override async save(): Promise<IDeckCommander | undefined> {
    if (this.form.valid) {
      const deckCommander: IDeckCommander = {
        ...this.form.value,
        _id: this.deckCommanderId || undefined,
      };
      const saved = await this.entityCommunicationService.saveDeckCommander(deckCommander);
      this.form.reset();
      return saved;
    }
    return undefined;
  }
}
