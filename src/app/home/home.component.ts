import { Component, OnInit, Inject } from '@angular/core';
import { Question } from '../shared/question';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  questions: Array<Question>;
  questionErrorMessage: string;

  constructor(private questionService: QuestionService,
    @Inject('BaseURL') public BaseURL,) { }

  ngOnInit(): void {
    this.questionService.getQuestions()
      .subscribe((questions)=> this.questions=questions,
      errmess=> this.questionErrorMessage=<any>errmess);
  }

}
