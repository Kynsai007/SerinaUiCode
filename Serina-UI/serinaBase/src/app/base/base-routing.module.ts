import { CreateGRNComponent } from './create-grn/create-grn.component';
import { CustomerSummaryComponent } from './customer-summary/customer-summary.component';
import { Comparision3WayComponent } from './exception-management/comparision3-way/comparision3-way.component';
import { ServiceInvoiceExceptionsComponent } from './exception-management/service-invoice-exceptions/service-invoice-exceptions.component';
import { AdminGaurdService } from './../services/auth/admin/admin-gaurd.service';
import { InvokeBatchComponent } from './exception-management/invoke-batch/invoke-batch.component';
import { BatchProcessComponent } from './exception-management/batch-process/batch-process.component';
import { ExceptionManagementComponent } from './exception-management/exception-management.component';
import { BulkUploadServiceComponent } from './non-po/bulk-upload-service/bulk-upload-service.component';
import { ServiceInvoicesHistoryComponent } from './non-po/service-invoices-history/service-invoices-history.component';
import { SummaryComponent } from './non-po/summary/summary.component';
import { InvoiceStatusComponent } from './invoice-status/invoice-status.component';
import { SpDetailsComponent } from './non-po/sp-details/sp-details.component';
import { PipComponent } from './invoice/pip/pip.component';
import { GrnComponent } from './invoice/grn/grn.component';
import { AllInvoicesComponent } from './invoice/all-invoices/all-invoices.component';
import { ViewInvoiceComponent } from './invoice/view-invoice/view-invoice.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ApproveComponent } from './approve/approve.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import {  NonPoComponent } from './non-po/non-po.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HomeComponent } from './home/home.component';
import { BaseTypeComponent } from './base-type/base-type.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from './can-deactivate/can-deactivate.guard';
import { UploadSectionComponent } from '../main-content/upload-section/upload-section.component';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { BusinessChartsComponent } from './home/business-charts/business-charts.component';
import { SalesOrderMappingComponent } from './exception-management/sales-order-mapping/sales-order-mapping.component';
import { UnsavedChangesGuard } from './exception-management/UnsavedChanges.guard';
import { ExceptionTableComponent } from './exception-management/exception-table/exception-table.component';
import { EditUserComponent } from './roles/edit-user/edit-user.component';

const routes: Routes = [
  { 
    path: '',
    component: BaseTypeComponent, children:[
      {
        path: 'home',
        component: HomeComponent,
        children:[
          { path:'vendorBasedReports',
            component: BusinessChartsComponent, 
            children:[
              { path:'processReports',component: BusinessChartsComponent },
              { path:'exceptionReports',component: BusinessChartsComponent },
              { path:'emailExceptionReports',component: BusinessChartsComponent },
              { path:'onboardedReports',component: BusinessChartsComponent },
              { path: '' , redirectTo:'processReports', pathMatch:'full'}
            ]},
          { path:'serviceBasedReports',component: BusinessChartsComponent },
          { path: '' , redirectTo:'vendorBasedReports', pathMatch:'full'}
        ]
      },
      {
        path: 'home/comparision-docs/:id',
        component: Comparision3WayComponent,
      },
          {
            path: 'uploadInvoices',
            component: UploadSectionComponent,
          },
          {
            path: 'documentSummary',
            component: CustomerSummaryComponent,
          },
          {
            path: 'invoice',
            component: InvoiceComponent,
            children:[
              { path:'allInvoices', component:ExceptionTableComponent },
              { path:'PO', component:ExceptionTableComponent },
              { path:'SO', component:ExceptionTableComponent },
              { path: 'GRN', component:ExceptionTableComponent },
              { path: 'archived' , component:ExceptionTableComponent },
              { path: 'rejected' , component:ExceptionTableComponent },
              { path: 'GRNExceptions' , component:ExceptionTableComponent },
              { path: 'ServiceInvoices' , component:ExceptionTableComponent },
              { path: '' , redirectTo:'allInvoices', pathMatch:'full'}
            ]
          },
          {
            path: 'invoice/InvoiceDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'invoice/PODetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'invoice/SODetails/:id',
            component: ViewInvoiceComponent,
          },
          {
            path: 'invoice/GRNDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'invoice/serviceDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'approvals/serviceDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'invoice/InvoiceDetails/CustomerUpload/:id',
            component: Comparision3WayComponent,canDeactivate: [UnsavedChangesGuard]
          },
          {
            path: 'invoice/serviceDetails/CustomerUpload/:id',
            component: Comparision3WayComponent,canDeactivate: [UnsavedChangesGuard]
          },
          {
            path: 'invoice/InvoiceStatus/:id',
            component: InvoiceStatusComponent,
          },
          {
            path: 'invoice/comparision-docs/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'approvals',
            component: ApproveComponent,
          },
          { path: 'approvals/ServiceInvoices',
            component: ApproveComponent
          },
          {
            path: 'Create_GRN_inv_list',
            component: CreateGRNComponent,
          }
          ,{
            path: 'GRN_approvals',
            component: CreateGRNComponent,
          },
          {
            path: 'Create_GRN_inv_list/Inv_vs_GRN_details/:id',
            component: Comparision3WayComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'GRN_approvals/approval_id/:id',
            component: Comparision3WayComponent,canDeactivate: [CanDeactivateGuard]
          },
          { path: 'payment-status', component:PipComponent},
          {
            path: 'approvals/InvoiceDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'ExceptionManagement',
            component: BatchProcessComponent,
          },
          {
            path: 'ExceptionManagement/approvalPending',
            component: BatchProcessComponent,
          },
          {
            path:"ExceptionManagement/Service_ExceptionManagement",
            component: BatchProcessComponent
          },
          {
            path: 'ExceptionManagement/batchProcess',
            component: BatchProcessComponent,
          },
          {
            path: 'ExceptionManagement/batchProcess/comparision-docs/:id',
            component: Comparision3WayComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'approvals/comparision-docs/:id',
            component: Comparision3WayComponent,canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'ExceptionManagement/batchProcess/SO_generate/:id',
            component: Comparision3WayComponent,canDeactivate: [CanDeactivateGuard]
          },
          
          {
            path: 'ExceptionManagement/InvoiceDetails/:id',
            component: Comparision3WayComponent,
          },
          {
            path: 'vendor',
            loadChildren:()=> import('./vendor/vendor.module').then(m=>m.VendorModule)
          },

          {
            path: 'serviceProvider',
            component: NonPoComponent,
            children:[
              { path: 'SpDetails/:id', component:SpDetailsComponent}
            ]
            
          },
          {
            path: "serviceProvider/summary",
            component: SummaryComponent
          },
          {
            path: 'service_batch_trigger',
            component: InvokeBatchComponent,
          },
          {
            path: "bulkUploadService",
            component: BulkUploadServiceComponent
          },
          {
            path: "serviceProvider/EtisalatCostAllocation",
            component: ServiceInvoicesHistoryComponent
          },
          // {
          //   path: 'serviceProvider/:id',
          //   component: NonPoComponent,
          //   children: [
          //     {
          //       path: '',
          //       redirectTo: 'invoice',
          //       pathMatch: 'full'
          //     },
          //     {
          //       matcher: matcherFunction,
          //       component: NonPoComponent
          //     }
          //     // { path: 'invoice', component: NonPoComponent },
          //     // { path: 'accountDetails', component: NonPoComponent },
          //     // { path: 'itemList', component: NonPoComponent },
          //     // { path: 'spDetails', component: NonPoComponent }
          //   ]
          // },
          {
            path: 'roles',
            component: RolesComponent,
          },
          {
            path: 'roles/:someParam',
            component: RolesComponent,
          },
          {
            path: 'ERP_approvals',
            component: EditUserComponent,
          },
          // {
          //   path: 'roles/create_Edit_Roles',
          //   component: CreateRolesComponent,
          // },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'notifications',
            component: NotificationsComponent,
          },
          {
            path: 'settings',
            loadChildren: () => import('./settings/settings.module').then(m =>m.SettingsModule),
            canActivate: [AdminGaurdService]
          },
          {
            path: '', redirectTo: 'invoice', pathMatch: 'full'
          },
          {
            path: '404',
            component: ErrorPageComponent
          },
          {
            path: '**', 
            redirectTo: '/404'
          }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
