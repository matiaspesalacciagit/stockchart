import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { MaterialModule } from './material/material.module';
import { ChartService } from './service/chart.service';
import { GuardService } from './service/guard.service';
import { RestService } from './service/rest.service';
import { BullSpreadComponent } from './component/bull-spread/bull-spread.component';
import { ResultTableComponent } from './component/result-table/result-table.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SellAssetComponent } from './component/sell-asset/sell-asset.component';
import { BuyAssetComponent } from './component/buy-asset/buy-asset.component';
import { FormOperationPairAssetComponent } from './component/form-operation-pair-asset/form-operation-pair-asset.component';
import { OperateAssetComponent } from './component/operate-asset/operate-asset.component';
import { DetailAssetComponent } from './component/detail-asset/detail-asset.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLoginComponent,
    BullSpreadComponent,
    ResultTableComponent,
    SellAssetComponent,
    BuyAssetComponent,
    FormOperationPairAssetComponent,
    OperateAssetComponent,
    DetailAssetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    TableModule,
    TabViewModule,
    OverlayPanelModule
  ],
  providers: [GuardService, RestService, ChartService, DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
