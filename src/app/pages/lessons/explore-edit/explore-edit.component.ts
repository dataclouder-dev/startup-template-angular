import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DCLessonEditorComponent } from '@dataclouder/ngx-lessons';

// import { DCLessonEditorComponent } from '@dataclouder/ngx-lessons/src/lib/components/dc-lessons/editor/editor.component';

@Component({
  selector: 'app-explore-edit',
  standalone: true,
  imports: [DCLessonEditorComponent],
  templateUrl: './explore-edit.component.html',
  styleUrl: './explore-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreEditComponent {
  private route = inject(ActivatedRoute);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
}
