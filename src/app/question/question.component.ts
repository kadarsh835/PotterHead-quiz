import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { Question } from '../shared/question';
import { Answers } from '../shared/answers';
import { QuestionService } from '../services/question.service';
import { AnswerService } from '../services/answer.service';
import { switchMap } from 'rxjs/operators';
import { BaseURL } from '../shared/baseURL';

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
    this.score=0;
    this.questionIDs=new Array<number>();
    
    this.answers==new Array<Answers>();
    this.answer=new Answers();

    this.questionService.getQuestions()
      .subscribe((questions)=>{this.questions=questions});
    
    this.getTotalScore()
    .then((ques)=>{
      this.questions=ques
      console.log(this.questions)
      this.totalScore=this.questions.length
      this.questions.forEach(que=>{
        this.questionIDs.push(que.id)
      })
      console.log('TotalScore: '+ this.totalScore)
    })
    .then(()=>{
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
    )
  } 

  async getTotalScore(): Promise<Array<Question>>{
    var questions:Array<Question>;
    await fetch(BaseURL+'questions')
    .then(response => response.json())
    .then((ques)=>{
      questions=ques;
    })
    return questions;
  }

  setPrevNext(questionID: number){
    var index= this.questionIDs.indexOf(questionID);
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

  async endQuiz(){
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

    for(let que of this.submittedAnswers){
      // this.answerService.getAnswer(que.id)
      //   .subscribe((answer)=> {this.answer=answer});
        
      // if(this.answer==undefined){
        var correct:boolean=true;
        await fetch(BaseURL+'answers/'+que.id)
        .then(response => response.json())
        .then((answer)=>{
          this.answer=answer;
        })
      // }
      .then(()=>{
        
        let answerSubmittted=que.option.filter((opt)=>{return opt.isChecked})
        let optionsSubmitted=answerSubmittted.map(submitted=>submitted.id)

        function arraysEqual(a1,a2) {
          return JSON.stringify(a1)==JSON.stringify(a2);
        }
        correct=arraysEqual(this.answer.options, optionsSubmitted)

        if(correct)
          this.score++;
      })
    }
    console.log('Your Score is '+ this.score+' out of '+ this.totalScore);
  }
}
