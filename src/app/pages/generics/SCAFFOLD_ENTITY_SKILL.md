# AI Skill: Scaffold a New Entity Module

Use this document to scaffold a complete CRUD module for a new entity in this Angular project. Follow every step in order. Do not skip steps.

---

## Input Required from User

Before starting, confirm:
- `EntityName` — PascalCase singular noun (e.g., `Lesson`, `Product`, `Asset`)
- `entityName` — camelCase version (e.g., `lesson`, `product`, `asset`)
- `entity-name` — kebab-case version (e.g., `lesson`, `product`, `asset`)
- `ROUTE_PATH` — URL segment under `page/` (e.g., `lessons`, `products`, `assets`)
- `API_ENDPOINT` — backend REST endpoint string (e.g., `'lesson'`, `'product'`)
- Entity fields — list of fields with types (e.g., `title: string`, `price: number`)

**Example used throughout this guide:** `Lesson` / `lesson` / `lesson` / `lessons` / `'lesson'`

---

## File Structure to Create

```
src/app/pages/{entity-name}s/
├── models/
│   └── {entity-name}s.model.ts
├── {entity-name}-list/
│   ├── {entity-name}-list.component.ts
│   ├── {entity-name}-list.component.html
│   └── {entity-name}-list.component.css
├── {entity-name}-detail/
│   ├── {entity-name}-detail.component.ts
│   ├── {entity-name}-detail.component.html
│   └── {entity-name}-detail.component.css
├── {entity-name}-form/
│   ├── {entity-name}-form.component.ts
│   ├── {entity-name}-form.component.html
│   └── {entity-name}-form.component.css
├── {entity-name}.routes.ts
├── {entity-name}s.component.ts
├── {entity-name}s.component.html
├── {entity-name}s.component.css
└── {entity-name}s.service.ts
```

---

## Step 1 — Model File

**File:** `src/app/pages/{entity-name}s/models/{entity-name}s.model.ts`

Replace `{EntityName}` with PascalCase, add your entity-specific fields.

```typescript
import { FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { IAuditable } from '@dataclouder/ngx-core';

export enum {EntityName}Type {
  Type1 = 'type1',
  Type2 = 'type2',
}

export interface I{EntityName} {
  _id: string;
  id: string;
  name?: string;
  image?: FileStorageData;
  description?: string;
  type?: string;
  // TODO: add your entity-specific fields here
  auditable?: IAuditable;
}
```

**Customization:** Add all domain-specific fields inside the interface.

---

## Step 2 — Service File

**File:** `src/app/pages/{entity-name}s/{entity-name}s.service.ts`

```typescript
import { inject, Injectable } from '@angular/core';
import { I{EntityName} } from './models/{entity-name}s.model';
import { APP_CONFIG, EntityCommunicationService, IAppConfig } from '@dataclouder/ngx-core';

const Endpoints = '{API_ENDPOINT}';

@Injectable({
  providedIn: 'root',
})
export class {EntityName}Service extends EntityCommunicationService<I{EntityName}> {
  public config: IAppConfig = inject(APP_CONFIG);

  constructor() {
    super(Endpoints);
    // Uncomment to use a different backend host:
    // this.customHost = this.config.backendPythonUrl;
  }
}
```

**Customization:** Change `Endpoints` to match your backend REST route string.

---

## Step 3 — Root Component (Shell)

**File:** `src/app/pages/{entity-name}s/{entity-name}s.component.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { {EntityName_UPPER}S_ROUTES } from './{entity-name}.routes';

@Component({
  selector: 'app-{entity-name}s',
  imports: [RouterModule],
  templateUrl: './{entity-name}s.component.html',
  styleUrl: './{entity-name}s.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {EntityName}sComponent {
  public static routes = {EntityName_UPPER}S_ROUTES;
}
```

> Note: `{EntityName_UPPER}S_ROUTES` means the constant name in the routes file, e.g., `LESSONS_ROUTES`.

**File:** `src/app/pages/{entity-name}s/{entity-name}s.component.html`

```html
<router-outlet />
```

**File:** `src/app/pages/{entity-name}s/{entity-name}s.component.css`

```css
/* empty */
```

---

## Step 4 — Routes File

**File:** `src/app/pages/{entity-name}s/{entity-name}.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { {EntityName}sComponent } from './{entity-name}s.component';
import { {EntityName}ListComponent } from './{entity-name}-list/{entity-name}-list.component';
import { {EntityName}DetailComponent } from './{entity-name}-detail/{entity-name}-detail.component';
import { {EntityName}FormComponent } from './{entity-name}-form/{entity-name}-form.component';

export const {EntityName_UPPER}S_ROUTES: Routes = [
  {
    path: '',
    component: {EntityName}sComponent,
    children: [
      {
        path: '',
        component: {EntityName}ListComponent,
      },
      {
        path: 'details/:id',
        component: {EntityName}DetailComponent,
      },
      {
        path: 'edit',
        component: {EntityName}FormComponent,
      },
      {
        path: 'edit/:id',
        component: {EntityName}FormComponent,
      },
    ],
  },
];
```

---

## Step 5 — List Component

**File:** `src/app/pages/{entity-name}s/{entity-name}-list/{entity-name}-list.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DCFilterBarComponent, EntityBaseListV2Component, QuickTableComponent } from '@dataclouder/ngx-core';
import { {EntityName}Service } from '../{entity-name}s.service';
import { I{EntityName} } from '../models/{entity-name}s.model';
import { RouterModule } from '@angular/router';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { DatePipe, SlicePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '@dataclouder/ngx-users';

@Component({
  selector: 'app-{entity-name}-list',
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
    SkeletonModule,
  ],
  templateUrl: './{entity-name}-list.component.html',
  styleUrl: './{entity-name}-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {EntityName}ListComponent extends EntityBaseListV2Component<I{EntityName}> implements OnInit {
  protected override entityCommunicationService = inject({EntityName}Service);
  public userService = inject(UserService);

  getCustomButtons(item: any): MenuItem[] {
    return [
      {
        tooltipOptions: { tooltipLabel: 'View details', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction({ item, action: 'view' }),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.doAction({ item, action: 'edit' }),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.doAction({ item, action: 'delete' }),
      },
    ];
  }
}
```

**File:** `src/app/pages/{entity-name}s/{entity-name}-list/{entity-name}-list.component.html`

```html
@if (!onlyView()) {
<p-button [icon]="viewType() === 'card' ? 'pi pi-table' : 'pi pi-list'" label="Change View" [link]="true" (click)="toggleView()" />
}
<div class="{entity-name}-list-container">
  <dc-filter-bar [isAdmin]="userService.isAdmin()" [options]="filterBarOptions" (onNew)="onNew()" (onFilterAction)="doAction($event)"></dc-filter-bar>

  @if (viewType() === 'card') {
  <div class="{entity-name}-list-content">
    @if (!isLoading()) { @for (item of items(); track item.id) {
    <div class="card-item">
      <div style="position: absolute; top: 4px; right: 4px; z-index: 1000">
        <p-speeddial
          [model]="getCustomButtons(item)"
          [radius]="70"
          type="quarter-circle"
          direction="down-left"
          [buttonProps]="{ severity: 'primary', rounded: true, outlined: true }" />
      </div>
      <p-card [header]="item.name">
        <div style="display: flex; gap: 10px">
          <img width="120px" [src]="item.image?.url || 'defaults/images/face-3.jpg'" alt="item image" />
          <p class="m-0">{{ item.description | slice : 0 : 250 }}...</p>
        </div>
        <span>{{ item?.auditable?.updatedAt | date : 'dd/MM/yyyy HH:mm' }}</span>
      </p-card>
    </div>
    } @if (items().length === 0) {
    <p-card>
      <p>No {entity-name}s found</p>
    </p-card>
    } } @else { @for (i of [1,2,3,4,5,6]; track i) {
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-4">
          <p-skeleton width="80%" height="1.5rem" />
        </div>
      </ng-template>
      <div style="display: flex; gap: 10px">
        <p-skeleton width="120px" height="120px" />
        <div style="flex: 1">
          <p-skeleton width="100%" height="1rem" styleClass="mb-2" />
          <p-skeleton width="90%" height="1rem" styleClass="mb-2" />
          <p-skeleton width="60%" height="1rem" />
        </div>
      </div>
      <p-skeleton width="40%" height="1rem" styleClass="mt-2" />
    </p-card>
    } }
  </div>
  } @else if (viewType() === 'table') {
  <app-quick-table [tableData]="items()"></app-quick-table>
  }

  <div class="paginator-container">
    <p-paginator
      currentPageReportTemplate="{{ totalRecords() }} records"
      [showCurrentPageReport]="true"
      (onPageChange)="onPageChange($event)"
      [first]="first()"
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [rowsPerPageOptions]="[10, 20, 30]">
    </p-paginator>
  </div>
</div>
```

**File:** `src/app/pages/{entity-name}s/{entity-name}-list/{entity-name}-list.component.css`

```css
.{entity-name}-list-container {
  padding: 1rem;
}

.{entity-name}-list-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.card-item {
  position: relative;
}

.paginator-container {
  margin-top: 1rem;
}
```

---

## Step 6 — Detail Component

**File:** `src/app/pages/{entity-name}s/{entity-name}-detail/{entity-name}-detail.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { {EntityName}Service } from '../{entity-name}s.service';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { I{EntityName} } from '../models/{entity-name}s.model';

@Component({
  selector: 'app-{entity-name}-detail',
  imports: [JsonPipe],
  templateUrl: './{entity-name}-detail.component.html',
  styleUrl: './{entity-name}-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {EntityName}DetailComponent implements OnInit {
  private {entityName}Service = inject({EntityName}Service);
  private activatedRoute = inject(ActivatedRoute);

  public {entityName}Id: string = this.activatedRoute.snapshot.paramMap.get('id') as string;

  public {entityName} = signal<I{EntityName} | null>(null);

  ngOnInit(): void {
    this.load{EntityName}();
  }

  private async load{EntityName}() {
    const {entityName} = await this.{entityName}Service.findOne(this.{entityName}Id);
    this.{entityName}.set({entityName});
  }
}
```

**File:** `src/app/pages/{entity-name}s/{entity-name}-detail/{entity-name}-detail.component.html`

```html
<h3>{EntityName} Detail</h3>
<h5>Build this section to display the entity details</h5>

<br />
<pre>
  {{ {entityName}() | json }}
</pre>
```

**Customization:** Replace the `<pre>` debug output with your actual detail UI layout once verified working.

**File:** `src/app/pages/{entity-name}s/{entity-name}-detail/{entity-name}-detail.component.css`

```css
/* empty */
```

---

## Step 7 — Form Component

**File:** `src/app/pages/{entity-name}s/{entity-name}-form/{entity-name}-form.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I{EntityName} } from '../models/{entity-name}s.model';
import { {EntityName}Service } from '../{entity-name}s.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, FileStorageData } from '@dataclouder/ngx-cloud-storage';
import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { DialogModule } from 'primeng/dialog';
import { {EntityName}ListComponent } from '../{entity-name}-list/{entity-name}-list.component';

@Component({
  selector: 'app-{entity-name}-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TooltipModule,
    CropperComponentModal,
    DialogModule,
    {EntityName}ListComponent,
  ],
  templateUrl: './{entity-name}-form.component.html',
  styleUrl: './{entity-name}-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class {EntityName}FormComponent extends EntityBaseFormComponent<I{EntityName}> implements OnInit {
  protected entityCommunicationService = inject({EntityName}Service);
  private fb = inject(FormBuilder);

  // TODO: adjust FormGroup fields to match your entity interface
  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as FileStorageData],
    type: [''],
  });

  protected override patchForm(entity: I{EntityName}): void {
    this.form.patchValue(entity);
  }

  public storageImgSettings = {
    path: `{entity-name}s`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  // TODO: replace with real type options for your entity
  public {entityName}Types = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
  ];

  public isDialogVisible = false;

  async ngOnInit(): Promise<void> {}

  public handleImageUpload(event: FileStorageData) {
    this.form.patchValue({ image: event });
    this.save();
  }

  public handleRelationSelection(relation: I{EntityName}) {
    this.isDialogVisible = false;
    // TODO: handle the selected relation (e.g., patch form or push to a list)
  }
}
```

**File:** `src/app/pages/{entity-name}s/{entity-name}-form/{entity-name}-form.component.html`

```html
<h3>{EntityName} Form</h3>

<div class="{entity-name}-form-card">
  <p-card [header]="entityId() ? 'Edit {EntityName}' : 'New {EntityName}'">
    <form [formGroup]="form">
      <div style="display: flex; gap: 10px">
        <div class="form-field">
          <label class="block" pTooltip="Upload image after first save">Image</label>
          <img width="218px" [src]="form.get('image')?.value?.url || 'defaults/images/face-3.jpg'" alt="{entity-name} image" />
          <dc-cropper-modal [imgStorageSettings]="storageImgSettings" (imageUploaded)="handleImageUpload($event)"></dc-cropper-modal>
        </div>

        <div style="width: 100%">
          <div class="form-field">
            <label for="name" class="block">Name</label>
            <input pInputText id="name" type="text" formControlName="name" placeholder="Enter name" />
          </div>

          <div class="form-field">
            <label for="description" class="block">Description</label>
            <textarea id="description" pTextarea formControlName="description" rows="5" class="w-full" placeholder="Enter description"> </textarea>
          </div>
        </div>
      </div>

      <div class="form-field">
        <label for="type" class="block">Type</label>
        <p-select id="type" [options]="{entityName}Types" formControlName="type" optionLabel="label" optionValue="value" placeholder="Select a type" />
      </div>

      <!-- Optional: Search dialog to pick a related entity -->
      <div>
        <p-button (click)="isDialogVisible = true" label="Search relation" icon="pi pi-search" iconPos="right"></p-button>
      </div>
    </form>

    <div style="display: flex; justify-content: flex-end; margin-top: 1rem">
      <p-button (click)="save()" label="Save {EntityName}" [disabled]="!form.valid" icon="pi pi-check" iconPos="right"></p-button>
    </div>

    <p-dialog header="Search for relation" [(visible)]="isDialogVisible" [modal]="true" [style]="{ width: '50vw' }" draggable="false">
      <app-{entity-name}-list [onlyView]="true" (onSelect)="handleRelationSelection($event)"></app-{entity-name}-list>
    </p-dialog>
  </p-card>
</div>
```

**File:** `src/app/pages/{entity-name}s/{entity-name}-form/{entity-name}-form.component.css`

```css
.{entity-name}-form-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  margin-bottom: 0.25rem;
  display: block;
  font-weight: 500;
}

.form-field input,
.form-field textarea,
.form-field p-select {
  width: 100%;
}
```

---

## Step 8 — Register Route in app.routes.ts

Open `src/app/app.routes.ts` and add a new route entry inside the `page` children array.

**Pattern to add:**

```typescript
{
  path: '{ROUTE_PATH}',
  loadChildren: () => import('./pages/{entity-name}s/{entity-name}s.component').then(m => m.{EntityName}sComponent.routes),
},
```

**Example for Lesson:**

```typescript
{
  path: 'lessons',
  loadChildren: () => import('./pages/lessons/lessons.component').then(m => m.LessonsComponent.routes),
},
```

Place it alongside the other `page` children (after `generics`, before `deck`, etc.).

---

## Substitution Reference Table

Use this table to do all name replacements. The example column shows the `Lesson` entity.

| Placeholder          | What it is                    | Example       |
|----------------------|-------------------------------|---------------|
| `{EntityName}`       | PascalCase singular           | `Lesson`      |
| `{entityName}`       | camelCase singular            | `lesson`      |
| `{entity-name}`      | kebab-case singular           | `lesson`      |
| `{EntityName_UPPER}S_ROUTES` | SCREAMING_SNAKE constant | `LESSONS_ROUTES` |
| `{ROUTE_PATH}`       | URL segment under `page/`     | `lessons`     |
| `{API_ENDPOINT}`     | Backend REST route string     | `'lesson'`    |

---

## Checklist

After generating all files, verify:

- [ ] All `{placeholder}` tokens have been replaced — zero remaining in any file
- [ ] The model interface has the correct domain fields
- [ ] `FormGroup` fields in the form component match the model interface
- [ ] `storageImgSettings.path` uses the plural kebab-case entity name
- [ ] The route is registered in `app.routes.ts`
- [ ] The `selector` in each `@Component` uses `app-{entity-name}-*`
- [ ] Import paths are consistent with the folder structure created

---

## Notes for the AI

- The base classes (`EntityBaseListV2Component`, `EntityBaseFormComponent`, `EntityCommunicationService`) come from `@dataclouder/ngx-core` — do not reimplement their logic.
- `EntityBaseFormComponent` provides `save()`, `entityId()`, and `patchForm()` lifecycle. Override `patchForm()` if the entity has nested arrays or custom patch logic.
- `EntityBaseListV2Component` provides `items()`, `isLoading()`, `totalRecords()`, `first()`, `rows()`, `viewType()`, `toggleView()`, `onNew()`, `onPageChange()`, `doAction()`, and `filterBarOptions`. Do not redeclare these.
- The `doAction()` method in the list handles navigation to `edit/:id`, `details/:id`, and delete — this is wired in the base class automatically.
- The `onlyView` input and `onSelect` output on the list component are used when embedding the list inside a dialog (the relation picker pattern in the form).
- After scaffolding, run `ng build` or `ng serve` to verify no TypeScript errors before customizing the UI.
