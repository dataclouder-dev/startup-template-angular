import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GenericListComponent } from './generic-list.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DCFilterBarComponent, QuickTableComponent } from '@dataclouder/ngx-core';
import { SpeedDialModule } from 'primeng/speeddial';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { GenericService } from '../generics.service';
import { UserService } from '@dataclouder/ngx-users';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<GenericListComponent> = {
  title: 'Generics/GenericListComponent',
  component: GenericListComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
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
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: GenericService,
          useValue: {
            getWithQuery: () => of({ data: [], total: 0 }),
            get: () => of({}),
          },
        },
        {
          provide: UserService,
          useValue: {
            user$: of({}),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => null,
              },
            },
          },
        },
      ],
    }),
  ],
  argTypes: {
    // Define argTypes for your component inputs here
  },
};

export default meta;
type Story = StoryObj<GenericListComponent>;

export const Default: Story = {
  args: {
    // Define default args for your component inputs here
  },
};

export const WithItems: Story = {
  args: {},
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: GenericService,
          useValue: {
            getWithQuery: () =>
              of({
                data: [
                  { id: '1', name: 'Item 1', description: 'Description 1' },
                  { id: '2', name: 'Item 2', description: 'Description 2' },
                ],
                total: 2,
              }),
            get: (id: string) => of({ id, name: `Item ${id}` }),
          },
        },
      ],
    }),
  ],
};
