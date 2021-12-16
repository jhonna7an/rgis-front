import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentSummaryComponent } from './modules/main/pages/summary/equipment-summary.component';
import { HomeComponent } from './modules/main/pages/home/home.component';
import { EquipmentDetailComponent } from './modules/main/pages/detail/equipment-detail.component';
import { CreateEquipmentComponent } from './modules/main/pages/create/create-equipment.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'equipment/summary', component: EquipmentSummaryComponent },
  { path: 'equipment/detail', component: EquipmentDetailComponent },
  { path: 'equipment/create', component: CreateEquipmentComponent },
  {
    path: 'auth',
    loadChildren: '../app/modules/auth/auth.module#AuthModule'
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
