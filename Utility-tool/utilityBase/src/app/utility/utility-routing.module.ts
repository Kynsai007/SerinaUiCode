import { MobComponent } from './components/fr-update/mob/mob.component';
import { FrUpdateComponent } from './components/fr-update/fr-update.component';
import { GuideComponent } from './components/guide/guide.component';
import { UtilityHomeComponent } from './components/utility-home/utility-home.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobmainComponent } from './components/fr-update/mob/mobmain/mobmain.component';
import { ServiceProvidersComponent } from './components/service-providers/service-providers.component';
import { FrUpdateSpComponent } from './components/fr-update-sp/fr-update-sp.component';
import { CustomersComponent } from './components/customers/customers.component';
import { OpenaiComponent } from './components/settings/openai/openai.component';


const routes: Routes = [
  {
    path: '',
    component:HomeComponent , children :[
      // {
      //   path: 'home',
      //   component:UtilityHomeComponent
      // }
      {
        path: 'vendors',
        component:VendorsComponent
      },
      { path: 'service-providers',component:ServiceProvidersComponent},
      {path:'customers', component:CustomersComponent},
      { path:'vendors/Fr_update', component:FrUpdateComponent },
      {path:'service-providers/Fr_update',component:FrUpdateSpComponent},
      { path:'vendors/modal_on_board', component:MobComponent },
      { path:'vendors/open_ai_vendor/:id/:vendorName/:type',component:OpenaiComponent},
      { path:'service-providers/open_ai_service_provider/:id/:serviceProviderName/:type',component:OpenaiComponent},
      {
        path: 'guide',
        component:GuideComponent
      },
      {
        path: 'settings',
        loadChildren:()=>import('./components/settings/settings.module').then(m=>m.SettingsModule)
      },
      {
        path: 'training',
        component: MobmainComponent
      },
      {
        path: '',
        redirectTo:'vendors',
        pathMatch:'full'
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilityRoutingModule { }
