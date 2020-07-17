import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  score: number;
  totalScore: number;
  percentageScore: number;
  pass_fail: boolean;
  timeTaken: number;
  timeTakenMinutes: number;
  timeTakenSeconds: number;

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.sharedScore.subscribe((res) => {this.score = res});
    this.sharedService.sharedTotalScore.subscribe((totalScore)=>{this.totalScore= totalScore});
    this.sharedService.sharedTotalTime.subscribe((timeTaken)=>{this.timeTaken=timeTaken})
    this.timeTakenMinutes=Math.floor(this.timeTaken/60);
    this.timeTakenSeconds=Math.floor(this.timeTaken%60);

    this.percentageScore=Number(parseFloat((this.score*(100.0)/this.totalScore).toString()).toFixed(2));
    this.pass_fail=(this.percentageScore>=70)?true:false;
  }
}
