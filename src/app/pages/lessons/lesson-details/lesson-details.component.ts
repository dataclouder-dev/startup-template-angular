import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ChatRole, ConversationType, IConversationSettings, TextEngines } from '@dataclouder/ngx-agent-cards';
import { DCLessonRendererComponent, ILesson, LESSONS_TOKEN, ILessonsSettings, LessonConversationService } from '@dataclouder/ngx-lessons';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.scss'],
  standalone: true,
  imports: [DCLessonRendererComponent],
})
export class LessonDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private lessonService = inject(LESSONS_TOKEN);

  private lessonConversationService = inject(LessonConversationService);

  public lesson!: ILesson;
  public lessonId: string = this.activatedRoute.snapshot.paramMap.get('id')!;

  public settings: ILessonsSettings = {
    additionalPrompt:
      'Siempre, responde en español, e intenta ser conciso, tus respuestas deben ser entre 10 palabras y hasta un parrafo, dependiendo de la pregunta y contexto de la convesación ',
    instructionsPrompt: `Eres un asistente de IA para Instinto X, una app para el desarrollo personal y el coaching masculino, el usuario terminó de leer la lección, y ahora hablará contigo
    ayudalo a entender mejor la lección haciendole preguntas como si fuera una evaluación, se amable y hasle muchas preguntas para saber si entiende bien la lección, 
    `,
  };

  private conversationSettings: IConversationSettings = {
    conversationType: ConversationType.General,
    textEngine: TextEngines.SimpleText,
    autoStart: true,
    model: { provider: 'google' },
    messages: [
      {
        role: ChatRole.System,
        content: `Eres un asistente de IA para Dataclouder, una app para que se usa como plantilla para crear otras apps, tiene una sección donde se evaluan las lecciones, el usuario terminó de leer la lección, y ahora hablará contigo
    ayudalo a entender mejor la lección haciendole preguntas como si fuera una evaluación, se amable y hasle muchas preguntas para saber si entiende bien la lección, `,
      },
      {
        role: ChatRole.System,
        content: `Siempre, responde en español, e intenta ser conciso, tus respuestas deben ser entre 10 palabras y hasta un parrafo, dependiendo de la pregunta y contexto de la convesación`,
      },
    ],

    tts: {
      voice: 'es-US-Chirp3-HD-algenib',
    },
  };

  // Implementation will go here
  async ngOnInit(): Promise<void> {
    this.lesson = await this.lessonService.getLesson(this.lessonId);
    this.lessonConversationService.conversationSettings.set(this.conversationSettings);
  }
}
