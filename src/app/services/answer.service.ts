import { Injectable } from '@angular/core';
import { Answers } from '../shared/answers';
import { BaseURL } from '../shared/baseURL';
import { HttpClient } from '@angular/common/http';

//RxJS
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from '../services/process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient,
    private processHttpMessageService: ProcessHttpMessageService) { }

  getAnswers():Observable<Array<Answers>>{
    return this.http.get<Array<Answers>>(BaseURL+'answers')
      .pipe(catchError(this.processHttpMessageService.handleError));
  }
  getAnswer(id:number): Observable<Answers>{
    // Using Observables RxJS
    return this.http.get<Answers>(BaseURL+'answers/'+id)
      .pipe(catchError(this.processHttpMessageService.handleError));
  }

}
