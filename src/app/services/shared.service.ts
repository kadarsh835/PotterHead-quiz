import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private resultScore = new BehaviorSubject(0);
  sharedScore = this.resultScore.asObservable();

  constructor() { }
  
  nextResultScore(resultScore:number){
    this.resultScore.next(resultScore)
  }
  // public get result():number{
  //   return this.resultScore
  // }
  
  // public set result(value:number){
  //   this.resultScore=value;
  // }
  
}