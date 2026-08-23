import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DeckCommanderService } from '../deck-commanders.service';
import { CommandType, emptyDeckCommander, IDeckCommander } from '../models/deck-commanders.model';
import { EntityBaseSignalFormComponent } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-deck-commander-form',
  imports: [FormField, FormsModule, CardModule, TextareaModule, ButtonModule, SelectModule, InputTextModule],
  templateUrl: './deck-commander-form.component.html',
  styleUrl: './deck-commander-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DeckCommanderFormComponent extends EntityBaseSignalFormComponent<IDeckCommander> {
  protected override entityCommunicationService = inject(DeckCommanderService);

  public entityForm = signal<IDeckCommander>(emptyDeckCommander());

  public form = form(this.entityForm, s => {
    required(s.name, { message: 'El nombre es obligatorio' });
    required(s.type, { message: 'El tipo es obligatorio' });
  });

  public commandTypes = Object.values(CommandType).map(value => ({ label: value, value }));
}

