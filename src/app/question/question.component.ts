import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { Question } from '../shared/question';
import { QuestionService } from '../services/question.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  
  question: Question;
  errMess: string;
  questionIDs: Array<number>;

  prev: number;
  next: number;

  constructor(private questionService: QuestionService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL,) { }

  ngOnInit(): void {
    this.questionService.getDishIds()
      .subscribe((questionIDs)=>{this.questionIDs=questionIDs});
    this.route.params
      .pipe(switchMap((params: Params)=>{
        return this.questionService.getQuestion(params['id'])
      }))
      .subscribe((question)=>{
        this.question= question;
        this.setPrevNext(this.question.id);
      })
  }  
  setPrevNext(dishId: number){
    const index= this.questionIDs.indexOf(dishId);
    this.prev= this.questionIDs[(this.questionIDs.length + index-1)%this.questionIDs.length];
    this.next= this.questionIDs[(this.questionIDs.length + index+1)%this.questionIDs.length];
  }
  
  prevQuestion(){
    this.questionService.getQuestion(this.prev)
      .subscribe((question)=>{
        this.question=question;
        this.setPrevNext(this.question.id);
      })
  }
  nextQuestion(){
    this.questionService.getQuestion(this.next)
      .subscribe((question)=>{
        this.question=question;
        this.setPrevNext(this.question.id);
      })
  }
  
}
