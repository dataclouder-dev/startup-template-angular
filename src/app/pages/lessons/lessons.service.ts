import { Injectable, inject } from '@angular/core';
import { ILesson, ILessonTaken, LessonPrompts, LessonsAbstractService } from '@dataclouder/ngx-lessons';
import { HttpService } from '../../services/http.service';
import { UserService } from '../../dc-user-module/user.service';
import { Endpoints } from '../../core/enums';
import { FiltersConfig } from '@dataclouder/ngx-core';
import { getContentLessonGeneration, getDescriptionPrompt, getImageSuggestion } from './lesson-prompts';

type LessonPaginator = { rows: ILesson[]; count: number };

@Injectable({
  providedIn: 'root',
})
export class LessonsService implements LessonsAbstractService {
  private httpService = inject(HttpService);
  private userService = inject(UserService);

  postImproveMDWithAI(lessonId: string, markdownText: string): Promise<any> {
    // throw new Error('Method not implemented.');
    console.error('lessonId', lessonId);

    return Promise.resolve();
  }

  constructor() {}
  getPrompts(): LessonPrompts {
    return { description: getDescriptionPrompt, banner: getImageSuggestion, content: getContentLessonGeneration };
  }
  updateLesson(lesson: ILesson): Promise<any> {
    throw new Error('Method not implemented.');
  }
  generateLesson(lesson: ILesson): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async postLesson(lesson: ILesson) {
    // const langParams = this.userService.getUserLangOptions();
    const lessons = await this.httpService.postDataToService<ILesson>(`${Endpoints.Lessons.Save}`, lesson);

    return lessons;
  }

  public async getLesson(id: string) {
    return this.httpService.getDataFromService<ILesson>(`${Endpoints.Lessons.Main}/${id}`);
  }

  public async getLessons(filterConfig: FiltersConfig = {}, isPublished = true) {
    filterConfig.returnProps = {
      targetLang: 1,
      baseLang: 1,
      level: 1,
      title: 1,
      description: 1,
      createdDate: 1,
      tags: 1,
      media: 1,
      metadata: 1,
    };
    if (filterConfig) {
      filterConfig.filters = { ...filterConfig.filters };
      filterConfig.sort = { level: 1, ...filterConfig.sort };
      return this.httpService.postDataToService<LessonPaginator>(Endpoints.Lessons.QueryLessons, filterConfig);
    } else {
      return this.httpService.postDataToService<LessonPaginator>(Endpoints.Lessons.QueryLessons, null);
    }
  }

  public async getPublicLessons() {
    // return this.httpService.getDataFromService<Lesson[]>(LessonApi.GetPublicLessons);
  }

  public async deleteLesson(id: string) {
    return this.httpService.deleteDataFromService(`${Endpoints.Lessons.Main}/${id}`);
  }

  public async saveTakenLesson(lesson: ILessonTaken) {
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
