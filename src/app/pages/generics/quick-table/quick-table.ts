import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { PaginationBase, TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

export interface PColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-quick-table',
  imports: [CardModule, ButtonModule, SpeedDialModule, PaginatorModule, TableModule, RouterModule],
  templateUrl: './quick-table.html',
  styleUrl: './quick-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
// TODO: extends PaginationBase this handle filter, pagination, and url params ?page=1
export class QuickTableComponent extends PaginationBase implements OnInit {
  @Input() onlyView: boolean = false;
  @Input() columns: PColumn[] = [];
  @Input() tableData: any[] = [];
  @Output() onSelect = new EventEmitter<any>();

  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    router: Router,
    route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super(route, router);
  }

  async ngOnInit(): Promise<void> {
    this.tableData = this.tableData;
    this.cdr.detectChanges();
  }

  protected override loadData(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  public selectItem(item: any) {
    console.log('onSelect');
    this.onSelect.emit(item);
  }
}
