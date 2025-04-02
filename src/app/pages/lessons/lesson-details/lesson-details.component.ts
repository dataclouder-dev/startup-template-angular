import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DCLessonRendererComponent, ILesson, LESSONS_TOKEN, LessonsAbstractService } from '@dataclouder/ngx-lessons';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss'],
  standalone: true,
  imports: [DCLessonRendererComponent],
})
export class LessonDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private lessonService = inject<LessonsAbstractService>(LESSONS_TOKEN);

  public lesson!: ILesson;
  public lessonId: string = this.activatedRoute.snapshot.paramMap.get('id')!;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  // Implementation will go here
  async ngOnInit(): Promise<void> {
    this.lesson = await this.lessonService.getLesson(this.lessonId);
  }
}
