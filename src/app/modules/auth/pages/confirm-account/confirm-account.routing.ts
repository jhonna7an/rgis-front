import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';

const routes: Routes = [
    {
        path: '',
        component: ConfirmAccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmAccountRoutingModule { }
