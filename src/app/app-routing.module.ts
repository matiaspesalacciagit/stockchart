import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLoginComponent } from './component/page-login/page-login.component';
import { GuardService } from './service/guard.service';
import { BullSpreadComponent } from './component/bull-spread/bull-spread.component';
import { FormOperationPairAssetComponent } from './component/form-operation-pair-asset/form-operation-pair-asset.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent},
  { path: 'bull', component: BullSpreadComponent, canActivate: [GuardService] },
  { path: 'operation', component: FormOperationPairAssetComponent, canActivate: [GuardService] },
  
  { path: '**', redirectTo: '/login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
