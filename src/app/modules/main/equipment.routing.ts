import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { EquipmentSummaryComponent } from './pages/summary/equipment-summary.component';
import { EquipmentDetailComponent } from './pages/detail/equipment-detail.component';
import { CreateEquipmentComponent } from './pages/create/create-equipment.component';

const routes: Routes = [
  {
    path: 'summary',
    component: EquipmentSummaryComponent
  },
  {
    path: 'detail',
    component: EquipmentDetailComponent
  },
  {
    path: 'create',
    component: CreateEquipmentComponent
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EquipmentRoutingModule { }
