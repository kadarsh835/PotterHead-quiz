import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'quiz-app';
  ngAfterViewInit(){
    document.body.style.backgroundImage = "url('https://wallpaperplay.com/walls/full/b/5/8/64772.jpg')";
 }
}
