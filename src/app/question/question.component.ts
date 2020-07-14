import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { Question } from '../shared/question';
import { Answers } from '../shared/answers';
import { QuestionService } from '../services/question.service';
import { AnswerService } from '../services/answer.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  
  question: Question;
  questions: Array<Question>;
  errMess: string;
  questionIDs: Array<number>;
  totalScore: number;

  prev: number;
  next: number;

  testVar=true;

  submittedAnswers: Array<Question>;
  answers: Array<Answers>;
  answer: Answers;
  score: number;

  constructor(private questionService: QuestionService,
    private answerService: AnswerService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL,) {
      this.submittedAnswers=[];
    }

  ngOnInit(): void {
    this.answers=null;
    this.score=0;
    this.questionIDs=[];

    this.questionService.getQuestionIds()
      .subscribe((questionIDs)=>{this.questionIDs=questionIDs});
    this.totalScore=this.questionIDs.length;
    console.log("Total Score: "+ this.totalScore)
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
    // Store answers of the questions visited; change options of previous questions
    var present= false;
    for(var que of this.submittedAnswers){
      if (que.id==this.question.id){
        present=true;
        que.option=this.question.option;
        break;
      }
    }
    if(present==false)
      this.submittedAnswers.push(this.question)
    
    // Get question from local if the question has been visited earlier
    present=false;
    for(var que of this.submittedAnswers){
      if (que.id==this.prev){
        present=true;
        this.question=que;
        this.setPrevNext(this.question.id);
        break;
      }
    }
    // Ask from server if the question has not been visited yet
    if(present==false){
      this.questionService.getQuestion(this.prev)
        .subscribe((question)=>{
          this.question=question;
          this.setPrevNext(this.question.id);
        })
    }
  }
  nextQuestion(){
    // Store answers of the questions visited; change options of previous questions
    var present= false;
    for(var que of this.submittedAnswers){
      if (que.id==this.question.id){
        present=true;
        que.option=this.question.option;
        break;
      }
    }
    if(present==false)
      this.submittedAnswers.push(this.question)

    // Get question from local if the question has been visited earlier
    present=false;
    for(var que of this.submittedAnswers){
      if (que.id==this.next){
        present=true;
        this.question=que;
        this.setPrevNext(this.question.id);
        break;
      }
    }
    // Ask from server if the question has not been visited yet
    if(present==false){
      this.questionService.getQuestion(this.next)
        .subscribe((question)=>{
          this.question=question;
          this.setPrevNext(this.question.id);
        })
    }
    // console.log(JSON.stringify(this.submittedAnswers))
  }

  toggleOptionValue(optID: number){
    this.question.option[optID-1].isChecked=!(this.question.option[optID-1].isChecked);
  }

  getStatus(optID:number){
    return this.question.option[optID-1].isChecked;
  }

  endQuiz(){
    var present= false;
    for(var que of this.submittedAnswers){
      if (que.id==this.question.id){
        present=true;
        que.option=this.question.option;
        break;
      }
    }
    if(present==false)
      this.submittedAnswers.push(this.question)

    this.answer.id=0;
    this.answer.options=[1,2];
    for(var que of this.submittedAnswers){
      this.answerService.getAnswer(que.id)
        .subscribe((answer)=> {answer=answer});
        
      console.log('Answer: '+ this.answer.id);
      var correct=true;
      for(var corr in this.answer.options){
        if(que.option[corr].isChecked!=true)
          correct=false;
      }
      if(correct)
        this.score++;
    }
    console.log('Your Score is '+ this.score+' out of '+ this.totalScore);
  }
}
