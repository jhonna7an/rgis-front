import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
    {
        path: '',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
