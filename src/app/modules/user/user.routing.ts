import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
    {
        path: 'profile',
        component: UserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
