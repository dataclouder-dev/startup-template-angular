import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { PaginationBase, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { GenericService } from '../generics.service';
import { IGeneric } from '../models/generics.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-quick-table',
  imports: [CardModule, ButtonModule, SpeedDialModule, PaginatorModule, TableModule, RouterModule],
  templateUrl: './quick-table.html',
  styleUrl: './quick-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO: extends PaginationBase this handle filter, pagination, and url params ?page=1
export class QuickTableComponent extends PaginationBase implements OnInit {
  @Input() onlyView: boolean = false;
  @Input() columns: string[] = [];
  @Input() tableData: any[] = [];
  @Output() onSelect = new EventEmitter<IGeneric>();

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction('view', item),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.doAction('edit', item),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.doAction('delete', item),
      },
    ];
  }

  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private sourceService: GenericService,
    router: Router,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super(route, router);
  }

  async ngOnInit(): Promise<void> {
    const response = await this.sourceService.getFilteredGenerics(this.filterConfig);
    this.tableData = response.rows;
    this.cdr.detectChanges();
  }

  protected override loadData(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async doAction(action: string, item: any) {
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.sourceService.deleteGeneric(item.id);
          this.tableData = this.tableData.filter(generic => generic.id !== item.id);
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

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  public selectItem(generic: IGeneric) {
    console.log('onSelect');
    this.onSelect.emit(generic);
  }
}
