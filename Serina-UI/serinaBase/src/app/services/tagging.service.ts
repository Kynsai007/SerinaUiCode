import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaggingService {
  editable:boolean;
  displayInvoicePage: boolean = true;
  createInvoice: boolean = false;

  type:string = 'Invoice';
  editedTabValue = 'invoice';
  aprrovalPageTab = "vendorInvoice";

  activeMenuName: string='invoice';

  invoicePathBoolean:boolean = true;
  poPathBoolean:boolean;
  GRNPathBoolean:boolean;
  financeApprovePermission: boolean;
  submitBtnBoolean: boolean;
  approveBtnBoolean: boolean;
  headerName: string;
  batchProcessTab:string = "normal";
  InvokebatchProcessTab = "normal";
  isUploadScreen: boolean;
  approvalType: any;
  GRNTab: any="normal";
  approval_selection_boolean:boolean = false;
  LCM_boolean: boolean = false;
  documentType: any;
  

  constructor() { }
}
