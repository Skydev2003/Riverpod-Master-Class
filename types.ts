export interface Lesson {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  codeSnippet: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}