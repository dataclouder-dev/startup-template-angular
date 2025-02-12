import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DCLessonListComponent } from '@dataclouder/lessons';

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
}
