import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageAssetQuoteComponent } from './component/page-asset-quote/page-asset-quote.component';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { MaterialModule } from './material/material.module';
import { ChartService } from './service/chart.service';
import { GuardService } from './service/guard.service';
import { RestService } from './service/rest.service';
import { BullSpreadComponent } from './component/bull-spread/bull-spread.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLoginComponent,
    PageAssetQuoteComponent,
    BullSpreadComponent
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
  providers: [GuardService, RestService, ChartService, DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
