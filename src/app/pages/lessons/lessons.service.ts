import { Injectable, inject } from '@angular/core';
import { ILesson, ILessonTaken, LessonPrompts, DefaultLessonsService } from '@dataclouder/ngx-lessons';
import { HttpService } from '../../services/http.service';
import { UserService } from '../../dc-user-module/user.service';
import { Endpoints } from '../../core/enums';
import { FiltersConfig } from '@dataclouder/ngx-core';
import { getContentLessonGeneration, getDescriptionPrompt, getImageSuggestion } from './lesson-prompts';

type LessonPaginator = { rows: ILesson[]; count: number };

@Injectable({
  providedIn: 'root',
})
export class LessonsService extends DefaultLessonsService {
  private extractTextFromHTML(htmlString: any) {
    // Remove HTML tags
    let text = htmlString.replace(/<[^>]*>/g, ' ');

    // Remove style and script content
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');

    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  public getRecommendedLessons() {
    // TODO fix this:
    // return this.httpService.getDataFromService<Lesson[]>(LessonApi.Recommendations);
  }
}
