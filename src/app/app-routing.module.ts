import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { PageAssetQuoteComponent } from './component/page-asset-quote/page-asset-quote.component';
import { GuardService } from './service/guard.service';
import { BullSpreadComponent } from './component/bull-spread/bull-spread.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent},
  { path: 'quote', component: PageAssetQuoteComponent, canActivate: [GuardService] },
  { path: 'bull', component: BullSpreadComponent, canActivate: [GuardService] },
  
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
