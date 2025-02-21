import { Injectable } from '@angular/core';
import { ILesson, LessonsAbstractService } from '@dataclouder/lessons';
import { HttpService } from './http.service';
import { UserService } from '../dc-user-module/user.service';
import { Endpoints } from '../core/enums';

type LessonPaginator = { rows: ILesson[]; count: number };

@Injectable({
  providedIn: 'root',
})
export class LessonsService implements LessonsAbstractService {
  constructor(private httpService: HttpService, private userService: UserService) {}
  updateLesson(lesson: ILesson): Promise<any> {
    throw new Error('Method not implemented.');
  }
  generateLesson(lesson: ILesson): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async postLesson(lesson: ILesson) {
    // const langParams = this.userService.getUserLangOptions();
    const lessons = await this.httpService.postDataToService<ILesson>(`${Endpoints.Lessons.Lesson}`, lesson);

    return lessons;
  }

  public async getLesson(id: string) {
    return this.httpService.getDataFromService<ILesson>(`${Endpoints.Lessons.Lesson}/${id}`);
  }

  //   TODO: change to paginator
  public async getLessons(paginator: any = null, unpublished = false) {
    if (paginator) {
      if (unpublished) {
        // TODO: probably i can use the filter
        // return this.httpService.postDataToService<LessonPaginator>(Endpoints.Lessons.GetUnpublishedLessons, paginator);
        return null;
      } else {
        return this.httpService.postDataToService<LessonPaginator>(Endpoints.Lessons.QueryLessons, paginator);
      }
    } else {
      const lessons = await this.httpService.postDataToService<LessonPaginator>(Endpoints.Lessons.QueryLessons, null);
      return lessons;
    }
  }

  public async getPublicLessons() {
    // return this.httpService.getDataFromService<Lesson[]>(LessonApi.GetPublicLessons);
  }

  public async deleteLesson(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.Lessons.Lesson}/${id}`);
  }

  public saveTakenLesson(lesson: { lessonId: string; status: string; score: number }) {
    // return this.httpService.postDataToService(UserWebApi.LessonTaken, lesson);
  }

  public async generateAudiosForLesson(lessonId: string) {
    // TODO: fix this
    // return this.httpService.getDataFromService(`${Endpoints.GenerateMedia}/${lessonId}`, 'python');
  }

  public async postGenerateByAI(lessonId: string) {
    // TODO fix this:
    // return this.httpService.postDataToService(`${Endpoints.Lessons.GenerateLesson}`, { id: lessonId }, 'python');
  }

  public extractTextFromHtml(html: string) {
    const r1 = new RegExp('~(.+?)~', 'g');

    const lessonHtml = html.replace(r1, (_matching, jsonCoded) => {
      const data = JSON.parse(jsonCoded);
      return `<span>${data?.settings?.text}</span>`;
    });
    console.log('lessonHtml', lessonHtml);
    const onlyText = this.extractTextFromHTML(lessonHtml);
    return onlyText;
  }

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
