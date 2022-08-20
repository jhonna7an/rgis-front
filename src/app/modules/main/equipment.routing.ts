import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { EquipmentDetailComponent } from './pages/detail/equipment-detail.component';

const routes: Routes = [
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule)
  },
  {
    path: 'detail',
    component: EquipmentDetailComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/create/create.module').then(m => m.CreateModule)
  },
  {
    path: 'fault',
    loadChildren: () => import('./pages/fault/fault.module').then(m => m.FaultModule)
  },
  {
    path: '**',
    redirectTo: '/not-found'
  },
  {
    path: '',
    redirectTo: '/home'
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EquipmentRoutingModule { }
