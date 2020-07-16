import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  // Shared Score Obtained
  private resultScore = new BehaviorSubject(0);
  sharedScore = this.resultScore.asObservable();
  nextResultScore(resultScore:number){
    this.resultScore.next(resultScore)
  }

  // Shared Total Score
  private totalScore = new BehaviorSubject(0);
  sharedTotalScore = this.totalScore.asObservable();
  nextTotalScore(totalScore:number){
    this.totalScore.next(totalScore)
  }

  // Time Taken for the quiz
  private totalTime = new BehaviorSubject(0);
  sharedTotalTime = this.totalTime.asObservable();
  nextTotalTime(totalTime:number){
    this.totalTime.next(totalTime)
  }
}
