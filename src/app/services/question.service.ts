import { Injectable } from '@angular/core';
import { Question } from '../shared/question';
import { BaseURL } from '../shared/baseURL';
import { HttpClient } from '@angular/common/http';

//RxJS
import { Observable } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from '../services/process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient,
    private processHttpMessageService: ProcessHttpMessageService) { }

  getQuestions(): Observable<Array<Question>>{
    // Using Observables RxJS
    return this.http.get<Array<Question>>(BaseURL+'questions')
      .pipe(catchError(this.processHttpMessageService.handleError));
  }
}
