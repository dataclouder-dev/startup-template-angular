import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, input, inject, output, signal, WritableSignal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import {
  DCFilterBarComponent,
  ListFilterBarOptions,
  OnActionEvent,
  PaginationBase,
  QuickTableComponent,
  TOAST_ALERTS_TOKEN,
  ToastAlertsAbstractService,
} from '@dataclouder/ngx-core';
import { DeckCommanderService } from '../deck-commanders.service';
import { IDeckCommander } from '../models/deck-commanders.model';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-DeckCommander-list',
  imports: [
    CardModule,
    ButtonModule,
    DCFilterBarComponent,
    SpeedDialModule,
    DatePipe,
    SlicePipe,
    PaginatorModule,
    RouterModule,
    TableModule,
    QuickTableComponent,
  ],
  templateUrl: './deck-commander-list.component.html',
  styleUrl: './deck-commander-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeckCommanderListComponent extends PaginationBase implements OnInit {
  // Services
  private toastService = inject<ToastAlertsAbstractService>(TOAST_ALERTS_TOKEN);
  private sourceService = inject(DeckCommanderService);
  private cdr = inject(ChangeDetectorRef);

  // Inputs
  @Input() viewType: 'table' | 'card' = 'card';
  readonly onlyView = input<boolean>(true);
  readonly onSelect = output<IDeckCommander>();

  // States
  DeckCommanders: WritableSignal<IDeckCommander[]> = signal<IDeckCommander[]>([]);
  columns: any[] = ['name', 'description', 'updatedAt', 'image'];
  filterBarOptions: ListFilterBarOptions = { showActions: true, showCreateButton: true, showViewButton: true };

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction({ item, action: 'view' }),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.doAction({ item, action: 'edit' }),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.doAction({ item, action: 'delete' }),
      },
    ];
  }

  async ngOnInit(): Promise<void> {
    this.filterConfig.returnProps = { _id: 1, id: 1, name: 1, description: 1, updatedAt: 1, image: 1 };
    const response = await this.sourceService.getFilteredDeckCommanders(this.filterConfig);
    this.DeckCommanders.set(response.rows);
    this.cdr.detectChanges();
    console.log(this.DeckCommanders(), this.viewType);
    this.cdr.detectChanges();
  }

  protected override loadData(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  public toggleView() {
    this.viewType = this.viewType === 'card' ? 'table' : 'card';
    console.log(this.viewType, this.DeckCommanders());
    this.cdr.detectChanges();
  }

  public selectItem(DeckCommander: IDeckCommander) {
    console.log('onSelect');
    this.onSelect.emit(DeckCommander);
  }

  public override async doAction(actionEvent: OnActionEvent) {
    const { item, action } = actionEvent;

    if (action == 'changeView') {
      this.toggleView();
    }

    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.sourceService.deleteDeckCommander(item.id);
          this.DeckCommanders.set(this.DeckCommanders().filter(DeckCommander => DeckCommander.id !== item.id));
          this.toastService.success({
            title: 'Origen eliminado',
            subtitle: 'El origen ha sido eliminado correctamente',
          });
          this.cdr.detectChanges();
        }
        break;
      case 'edit':
        this.router.navigate(['./edit', item.id], { relativeTo: this.route });
        break;
    }
  }
}
