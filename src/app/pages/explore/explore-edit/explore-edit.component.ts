import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DCLessonEditorComponent } from '@dataclouder/lessons';

// import { DCLessonEditorComponent } from '@dataclouder/lessons/src/lib/components/dc-lessons/editor/editor.component';

@Component({
  selector: 'app-explore-edit',
  standalone: true,
  imports: [DCLessonEditorComponent],
  template: `<p>explore-edit works!</p>
    <dc-lesson-editor></dc-lesson-editor> `,
  styleUrl: './explore-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreEditComponent {}
