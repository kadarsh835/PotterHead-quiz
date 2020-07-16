import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';

import { Question } from '../shared/question';
import { Answers } from '../shared/answers';
import { QuestionService } from '../services/question.service';
import { AnswerService } from '../services/answer.service';
import { SharedService } from '../services/shared.service';
import { switchMap } from 'rxjs/operators';
import { BaseURL } from '../shared/baseURL';
import { Route } from '@angular/compiler/src/core';

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

  resultMode: boolean;

  // Timer
  timeLeft: number = 1800;
  interval;

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endQuiz();
      }
    },1000)
  }

  constructor(public questionService: QuestionService,
    private router: Router,
    private answerService: AnswerService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    @Inject('BaseURL') public BaseURL,) {
      this.submittedAnswers=[];
      this.resultMode=false;
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
        this.startTimer();
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

  async colorOptions(){
    for(let que of this.submittedAnswers){
      await fetch(BaseURL+'answers/'+ que.id)
      .then(response => response.json())
      .then((answer)=>{
        for(let opt of que.option){
          let index= -1;
          index= answer.options.indexOf(opt.id);
          if(index==-1 && que.option[opt.id-1].isChecked)
            opt.class="option-red"

          if(index>=0 && index<=this.totalScore)
            opt.class="option-green"
        }
      })
    }
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

      var correct:boolean=true;
      await fetch(BaseURL+'answers/'+que.id)
      .then(response => response.json())
      .then((answer)=>{
        this.answer=answer;
      })

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
    // Share values across Components
    this.sharedService.nextResultScore(this.score)
    this.sharedService.nextTotalScore(this.totalScore)
    this.sharedService.nextTotalTime(1800-this.timeLeft)

    this.resultMode=true;
    this.colorOptions();
  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
}
