import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { PageAssetQuoteComponent } from './component/page-asset-quote/page-asset-quote.component';
import { PageDetailComponent } from './component/page-detail/page-detail.component';
import { PageChartComponent } from './component/page-chart/page-chart.component';
import { GuardService } from './service/guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent},
  { path: 'quote', component: PageAssetQuoteComponent,
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' },
      { path: 'detail', component: PageDetailComponent, canActivate: [GuardService]  },
      { path: 'chart', component: PageChartComponent, canActivate: [GuardService] }
    ]
  },
  //{ path: 'chart', component: PageChartComponent, canActivate: [GuardService]},
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
