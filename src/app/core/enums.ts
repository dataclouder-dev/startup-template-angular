export enum RouteNames {
  Page = 'page',
  Home = 'home',
  Profile = 'profile',
  SubscriptionPlan = 'plan',
  Words = 'my-words',
  Phrases = 'my-phrases',
  Verbs = 'my-verbs',
  Chat = 'my-chat',
  Scenarios = 'escenarios',
  Topics = 'topics',
  Lessons = 'lecciones',
  Info = 'informacion',
  // TODO quiza debo quitar CreateLesson de aquí
  CreateLesson = 'create-lesson',
  Admin = 'admin',
  Teacher = 'teacher',
  VoiceDictation = 'dictado',
  Discovery = 'ejemplos',
  Signup = 'signup',
  Signin = 'signin',
  Terms = 'terms',
  Main = 'main',
  Auth = 'auth',
  Stack = 'stack',
  ConversationDetails = 'conversation-details',
}

export const Endpoints = {
  GetUser: 'api/user',
  PostUser: 'api/user',
  AdminUser: 'api/admin/user',
  Generics: {
    Generics: 'api/generic',
    GenericsFiltered: 'api/generic/query',
  },
  Whisper: {
    TranscribeBytes: 'api/whisper/transcribe-bytes',
  },
  Vertex: {
    tts: 'api/vertex/tts/synthesize',
  },
  Admin: {
    Claims: 'api/admin/claims', // :email
  },
  AgentCard: {
    TranslateConversation: 'api/conversation_card/translate',
    Card: 'api/agent-cards',
    ConversationQuery: 'api/agent-cards/query',
    Chat: 'api/agent-cards/chat',
    ListModels: 'api/agent-cards/list_models',
    Whisper: 'api/agent-cards/whisper',
    Random: 'api/agent-cards/random',
  },

  Lessons: {
    Save: 'api/lesson/lesson',
    Main: 'api/lesson',
    QueryLessons: 'api/lesson/query',
  },
  Notion: {
    ListDBs: 'api/notion/list-dbs',
    ListPages: 'api/notion/list-pages',
    CreatePage: 'api/notion/create-page',
    PageInSpecificFormat: 'api/notion/page-in-specific-format', // Get /{pageId}
  },
};

export enum AppHttpCode {
  GoodRefreshToken = 211,
  ErrorRefreshToken = 411,
}
