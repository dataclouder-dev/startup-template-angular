import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnActionEvent } from '@dataclouder/ngx-core';
import { DCLessonListComponent, ILesson } from '@dataclouder/ngx-lessons';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [DCLessonListComponent],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonListComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public onNewLesson() {
    console.log('onNewLesson');
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  public editLesson(lessonId: string) {
    console.log('onEditLesson', lessonId);
    this.router.navigate(['edit', lessonId], { relativeTo: this.route });
  }

  public removeLesson(lessonId: string) {
    console.log('onRemoveLesson', lessonId);
  }

  public takeLesson(lesson: ILesson) {
    console.log('onTakeLesson', lesson);
    this.router.navigate(['details', lesson._id], { relativeTo: this.route });
  }

  public handleAction(event: OnActionEvent) {
    switch (event.action) {
      case 'edit':
        this.editLesson(event.item);
        break;
      case 'select':
        this.takeLesson(event.item);
        break;
      case 'remove':
        this.removeLesson(event.item);
        break;
    }
  }
}
