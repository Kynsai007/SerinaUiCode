import { RegistrationComponent } from './registration/registration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'activationLink',
    component: RegistrationComponent,
  },
  {
    path: 'activationLink/:id',
    component: RegistrationComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationPageRoutingModule { }
