import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DCLessonRendererComponent, ILesson, LESSONS_TOKEN, LessonsAbstractService } from '@dataclouder/lessons';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss'],
  standalone: true,
  imports: [CommonModule, DCLessonRendererComponent],
})
export class LessonDetailsComponent implements OnInit {
  public lesson: ILesson;
  public lessonId: string = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private activatedRoute: ActivatedRoute, @Inject(LESSONS_TOKEN) private lessonService: LessonsAbstractService) {}
  // Implementation will go here
  async ngOnInit(): Promise<void> {
    this.lesson = await this.lessonService.getLesson(this.lessonId);
  }
}
