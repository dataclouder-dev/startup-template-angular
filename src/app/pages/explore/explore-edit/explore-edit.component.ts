import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DCLessonEditorComponent } from '@dataclouder/lessons';

// import { DCLessonEditorComponent } from '@dataclouder/lessons/src/lib/components/dc-lessons/editor/editor.component';

@Component({
  selector: 'app-explore-edit',
  standalone: true,
  imports: [DCLessonEditorComponent],
  templateUrl: './explore-edit.component.html',
  styleUrl: './explore-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreEditComponent {
  constructor(private route: ActivatedRoute) {}
}
