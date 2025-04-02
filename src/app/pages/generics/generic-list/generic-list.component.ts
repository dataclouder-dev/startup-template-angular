import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, input, inject, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DCFilterBarComponent, PaginationBase, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { GenericService } from '../generics.service';
import { IGeneric } from '../models/generics.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { QuickTableComponent } from '../quick-table/quick-table';

@Component({
  selector: 'app-generic-list',
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
  templateUrl: './generic-list.component.html',
  styleUrl: './generic-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO: extends PaginationBase this handle filter, pagination, and url params ?page=1
export class GenericListComponent extends PaginationBase implements OnInit {
  private toastService = inject<ToastAlertsAbstractService>(TOAST_ALERTS_TOKEN);
  private sourceService = inject(GenericService);
  private cdr = inject(ChangeDetectorRef);

  @Input() viewType: 'table' | 'card' = 'table';
  readonly onlyView = input<boolean>(true);
  readonly onSelect = output<IGeneric>();

  generics: IGeneric[] = [];
  columns: any[] = ['name', 'description', 'updatedAt', 'image'];

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        // command: () => this.doAction({ item, action: 'view' }),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        // command: () => this.doAction({ item, action: 'edit' }),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        // command: () => this.doAction({ item, action: 'delete' }),
      },
    ];
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const router = inject(Router);
    const route = inject(ActivatedRoute);

    super(route, router);
  }

  async ngOnInit(): Promise<void> {
    this.filterConfig.returnProps = { _id: 1, id: 1, name: 1, description: 1, updatedAt: 1, image: 1 };

    const response = await this.sourceService.getFilteredGenerics(this.filterConfig);
    this.generics = response.rows;
    this.cdr.detectChanges();
  }

  protected override loadData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  // public override async doAction({ item, action }: { item: any; action: MenuItem }) {
  //   switch (action.title) {
  //     case 'view':
  //       this.router.navigate(['./details', item.id], { relativeTo: this.route });
  //       break;
  //     case 'delete':
  //       const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
  //       if (areYouSure) {
  //         await this.sourceService.deleteGeneric(item.id);
  //         this.generics = this.generics.filter(generic => generic.id !== item.id);
  //         this.toastService.success({
  //           title: 'Origen eliminado',
  //           subtitle: 'El origen ha sido eliminado correctamente',
  //         });
  //         this.cdr.detectChanges();
  //       }
  //       break;
  //     case 'edit':
  //       this.router.navigate(['./edit', item.id], { relativeTo: this.route });
  //       break;
  //   }
  // }

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  public toggleView() {
    this.viewType = this.viewType === 'card' ? 'table' : 'card';
    this.cdr.detectChanges();
  }

  public selectItem(generic: IGeneric) {
    console.log('onSelect');
    this.onSelect.emit(generic);
  }
}
