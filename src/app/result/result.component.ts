import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  score:number;

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.sharedScore.subscribe((res) => {this.score = res});
  }
}
