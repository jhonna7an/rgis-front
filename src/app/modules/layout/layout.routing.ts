import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from './pages/layout/layout.component';

import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children:
        [
          {
            path: 'home',
            loadChildren: () => import('../home/home.module').then(m => m.HomeModule),
            canActivate: [
              AuthGuard
            ]
          },
          {
            path: 'equipment',
            loadChildren: () => import('../main/equipment.module').then(m => m.EquipmentModule),
            canActivate: [
              AuthGuard
            ]
          },
          {
            path: 'user',
            loadChildren: () => import('../user/user.module').then(m => m.UserModule),
            canActivate: [
              AuthGuard
            ]
          }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
