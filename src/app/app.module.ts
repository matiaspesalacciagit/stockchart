import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE, } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { RestService } from './service/rest.service';
import { GuardService } from './service/guard.service';
import { PageDetailComponent } from './component/page-detail/page-detail.component';
import { PageAssetQuoteComponent } from './component/page-asset-quote/page-asset-quote.component';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { PageChartComponent } from './component/page-chart/page-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PageChartComponent,
    PageLoginComponent,
    PageAssetQuoteComponent,
    PageDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [GuardService, RestService, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
