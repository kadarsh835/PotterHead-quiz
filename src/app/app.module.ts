import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { BaseURL } from './shared/baseURL';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';

import { QuestionService } from './services/question.service';
import { AnswerService } from './services/answer.service';
import { SharedService } from './services/shared.service';
import { ProcessHttpMessageService } from './services/process-http-message.service';
import { QuestionComponent } from './question/question.component';
import { ResultComponent } from './result/result.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    QuestionComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatCardModule,
    MatSliderModule,
    MatListModule,
    MatGridListModule,
    MatProgressBarModule,

    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    QuestionService,
    AnswerService,
    SharedService,
    ProcessHttpMessageService,
    { provide: 'BaseURL', useValue: BaseURL }],
  bootstrap: [AppComponent]
})
export class AppModule { }
