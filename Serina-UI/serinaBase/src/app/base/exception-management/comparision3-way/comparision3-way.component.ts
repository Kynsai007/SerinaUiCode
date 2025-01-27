import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { AuthenticationService } from './../../../services/auth/auth-service.service';
import { DataService } from './../../../services/dataStore/data.service';
import { Subscription, throwError } from 'rxjs';
import { PermissionService } from './../../../services/permission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from './../../../services/tagging.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
// import { fabric } from 'fabric';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { FormCanDeactivate } from '../../can-deactivate/form-can-deactivate';
import { SettingsService } from 'src/app/services/settings/settings.service';
import IdleTimer from '../../idleTimer/idleTimer';
import * as fileSaver from 'file-saver';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, take, filter } from 'rxjs/operators';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CanUploadComponentDeactivate } from '../UnsavedChanges.guard';
import { Calendar } from 'primeng/calendar';
import { HttpEventType } from '@angular/common/http';
import { SupportpdfViewerComponent } from '../supportpdf-viewer/supportpdf-viewer.component';
export interface getApproverData {
  EntityID: number,
  EntityBodyID?: number,
  DepartmentID?: number,
  categoryID?: number,
  approver?: any[],
  description?: string
}
@Component({
  selector: 'app-comparision3-way',
  templateUrl: './comparision3-way.component.html',
  styleUrls: [
    './comparision3-way.component.scss',
    '../../invoice/view-invoice/view-invoice.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Comparision3WayComponent
  extends FormCanDeactivate
  implements OnInit, CanUploadComponentDeactivate {
  // @ViewChild('canvas') canvas;
  zoomX = 1;
  // @ViewChild(PdfViewerComponent, { static: false })
  // private pdfViewer: PdfViewerComponent;

  // @ViewChild('pdfviewer') pdfviewer;
  @ViewChild('form')
  form: NgForm;
  editable: boolean;
  inputData = [];

  mergedArray: any;
  inputDisplayArray = [];
  vendorData = [];
  lineDisplayData: any;
  Itype: string;
  updateInvoiceData:any;
  headerName: string;
  editPermissionBoolean: boolean;
  changeApproveBoolean: boolean;
  financeApproveBoolean: boolean;
  fin_boolean: boolean = false;
  submitBtn_boolean: boolean;
  approveBtn_boolean: boolean;
  innerHeight: number;
  InvoiceHeight: number = 560;
  zoomdata: number = 1;
  showInvoice: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  invoiceID: any;
  routeIdCapture: Subscription;
  byteArray: Uint8Array;
  displayRuleDialog: boolean;
  displayErrorDialog: boolean;
  SelectErrorOption;
  givenErrors = [];
  rejectionComments: string = '';
  rejectReason: any;

  grnCreateBoolean: boolean = false;
  GRNObject = [];
  GRNObjectDuplicate = [];

  isPdfAvailable: boolean = true;
  userDetails: any;
  showPdf: boolean = true;
  btnText = 'Close';
  selectedPONumber;
  poList = [];
  filteredPO: any[];

  lineCount = [];
  currentTab = 'header';
  lineItems: any;
  vendorAcId: any;
  mappedData: any;
  zoomVal: number = 0.8;

  isImgBoolean: boolean;
  financeapproveDisplayBoolean: boolean;
  displayrejectDialog: boolean;
  // lineDescription ="Select Line items";
  timer: any;
  callSession: any;
  invoiceNumber = '';
  invoiceDescription:string;
  vendorName: any;
  isGRNDataLoaded: boolean;
  content_type: any;
  lineTabBoolean: boolean;
  grnLineCount: any;

  rotation = 0;
  addrejectcmtBool: boolean;
  ap_boolean: boolean;
  // poLineData = [];
  isAdmin: boolean;
  GRN_PO_Bool: boolean;
  GRN_PO_Data = [];
  GRN_PO_tags = [];
  po_grn_list = [];
  po_grn_line_list = [];
  filteredPO_GRN = [];
  GRNData: any;
  PO_GRN_Number_line = [];
  grnEditData = [];
  summaryColumn = [
    { field: 'PackingSlip', header: 'GRN Number' },
    { field: 'GRNField', header: 'GRN Field' },

  ];
  ColumnLengthVendor: number;
  validatePOInvUnit = [];
  validateUnitpriceBool: boolean;
  grnList = [];
  selectedGRNList = [];
  selectedGRNLines = [];
  currentlyOpenedItemIndex = -1;
  GRNTabData: any;
  grnTabDatalength: number;
  batchData: any;
  progressDailogBool: boolean;
  portalName: string;
  GRNDialogBool: boolean;
  headerpop: string;
  descrptonBool = false;
  polineTableData = [
    { TagName: 'LineNumber', linedata: [] },
    { TagName: 'ItemId', linedata: [] },
    { TagName: 'Name', linedata: [] },
    { TagName: 'ProcurementCategory', linedata: [] },
    { TagName: 'PurchQty', linedata: [] },
    { TagName: 'UnitPrice', linedata: [] },
    { TagName: 'DiscAmount', linedata: [] },
    { TagName: 'DiscPercent', linedata: [] }
  ];
  POlineBool: boolean;
  poDocId: any;
  po_num: any;
  subStatusId: any;
  statusId: number;
  isAmtStr: boolean;
  flipEnabled: boolean;
  partytype: string;
  lineTxt1: string;
  lineTxt2: string;
  docType: any;
  documentType: string;
  poLinedata = [];
  soLinedata = [];
  lineTable = [
    { header: 'S.No', field: '' },
    { header: 'Description', field: 'PODescription' },
    { header: 'PO quantity', field: 'PurchQty'},
    { header: 'Inv - Quantity', field: 'Quantity' },
    { header: 'GRN - Quantity', field: 'GRNQuantity' },
    { header: 'AmountExcTax', field: 'GRNAmountExcTax' },
    { header: 'PO balance quantity', field: 'RemainPurchPhysical'},
    { header: 'Comments', field: '' }
  ];
  documentViewBool: boolean;
  isDesktop: boolean;
  APIResponse: any;
  so_id: any;
  isEmpty: boolean;
  filteredPOLine = [];
  isBatchFailed: boolean;
  batch_count = 0;

  sampleLineData = [];
  p_width: string;
  poNumbersList: any;
  vendorId: any;
  activePOId: string;
  poDate: any;
  displayYear;
  minDate: Date;
  maxDate: Date;
  lastYear: number;
  months: string[];
  selectedMonth: string;
  rangeDates: Date;
  filterDataPO: any;
  searchPOArr: any;
  status_arr: any[];
  status_change_op: any;
  rejectModalHeader: string;
  GRNUploadID: any;
  reuploadBoolean: boolean;
  isServiceData: boolean;
  uploadtime: string = "00:00";
  doc_status: string;
  vendorUploadBoolean: boolean;
  pageType: string;
  item_code: any;
  GRN_line_total: number = 0;
  invoice_subTotal: any;
  po_total: any;
  enable_create_grn: boolean;
  uploadCompleted: boolean = true;
  activeGRNId: string;
  filterGRNlist: any[];
  linedata_mobile: any;
  @ViewChild('datePicker') datePicker: Calendar;
  progress: number;
  uploadFileList = [];
  support_doc_list = [];
  approval_selection_boolean: boolean;
  documentTypeId: number;
  documentInvType: any;
  isLCMInvoice: boolean;
  multiPOBool: boolean;
  isLinenonEditable: boolean;
  supportTabBoolean: boolean;
  isLCMTab: boolean;
  selectionTabBoolean: boolean;
  isLCMCompleted: boolean;
  costAllocation = [];
  allocationFileds = [];
  ERP: string;
  isRejectCommentBoolean: boolean;
  isApproveCommentBoolean: boolean;
  isLCMSubmitBoolean: boolean;
  BtnpopText: string;
  preApproveBoolean = false;
  approval_setting_boolean: boolean;
  DepartmentList: any;
  approversSendData: getApproverData[] = [];
  selectedDepartment: string;

  LCMTable = [
    { name: "Entity", id: 'drp', field: 'EntityName', data: [''] },
    { name: "PO Number", id: 'drp', field: 'PoDocumentId', data: [''] },
    { name: "PO Line Descrption", id: 'drp', field: 'PoLineDescription', data: [''] },
    { name: "Voyage Number", id: 'drp', field: 'VoyageNumber', data: [''] },
    { name: "Charges code", id: 'drp', field: 'CostCategory', data: [''] },
    { name: "Vessel Number", id: 'drp', field: 'AGIVesselNumber', data: [''] },
    { name: "Estimated value", id: 'text', field: 'EstimatedValue', data: [''] },
    { name: "Actualized value", id: 'text', field: 'ActualizedValue', data: [''] },
    { name: "Allocate", id: 'text', field: 'Allocate', data: [''] },
  ]
  LCMDataTable = [];
  approverList: any;
  categoryList: any;
  LCMObj = {
    EntityName: '',
    PoDocumentId: '',
    PoLineDescription: '',
    PoLineNumber: '',
    VoyageNumber: '',
    CostCategory: '',
    EstimatedValue: '',
    ActualizedValue: '',
    AGIVesselNumber: '',
    Allocate: '',
    ContextTableId: '',
    ContextRecId: '',
    MarkupTransRecId: ''
  }

  @ViewChild('LCMLineForm') LCMLineForm: NgForm;
  POlist_LCM = [];
  filteredEnt: any[];
  filteredLCMLines: any[];
  filteredVoyage: any[];
  filteredCost: any[];
  LCMItems = [];
  voyageList: any;
  selectedLCMLine: any;
  selectedVoyage: any;
  selectedEntity: any;
  max_allocation: number;
  est_val: number;
  act_val: number;
  AGIVesselNumber: string;
  selectedCost: any;
  chargeList: any;
  EntityName: any;
  itemId: any;
  lineNumber: any;
  ContextTableId: any;
  ContextRecId: any;
  uploadExcelValue: any;
  MarkupTransRecId: any;
  commentslabelBool = true;
  allocateTotal: number;
  balanceAmount: any;
  invoiceTotal: any;
  inv_line_total: number;
  entityList: any;
  entityName: any;
  commentsBool: boolean = true;
  selected_GRN_total: number;
  tagNameArr: any;

  userList_approved = [];
  rejectionUserId: number = 0;
  approvalRejectRecord = [];
  message: any;

  serviceProvidercode: any;
  reqServiceprovider: boolean = false;
  // companyName: string = '';
  // driverName: string = '';
  isFormValid: boolean = true;
  dynamicdata = [];
  normalCostAllocation: boolean;
  costTabBoolean: boolean = false;
  isEditMode = false;
  dynamicAllocationFileds = [
    // 
    { header: 'Project Category', field: 'bu_code' },
    // { header: 'Company Code', field: 'company_code' },
    // { header: 'Created On', field: 'created_on' },
    // { header: 'Document ID', field: 'documentID' },
    // { header: 'Driver Name', field: 'driver_name' },
    { header: 'Employee Code', field: 'emp_code' },
    { header: 'Employee Name', field: 'emp_name' },
    // { header: 'Entity Name', field: 'entity_name' },
    { header: 'Project ID', field: 'gl_code' },
    // { header: 'Allocation ID', field: 'iddynamiccostallocation' },
    { header: 'Service ID', field: 'item_number' },
    { header: 'VAT Group', field: 'segment' },
    { header: 'Amount', field: 'amount' },
    { header: 'Tax amount', field: 'calculatedtax' },
    // { header: 'Sub Ledger', field: 'subledger' },
  ]
  // editedValues: { [key: string]: any } = {};
  // editedValues: { [iddynamiccostallocation: string]: { [key: string]: any } } = {};
  // editedValues: { [idAndKey: string]: any } = {};
  editedValues: { [key: string]: any } = {};

  editedData: any = {};
  rows: any[] = [this.getNewRow()];
  lineData: any;
  priceData: any;
  totalPoCost: any;
  totalInvCost: any;
  invTypeList: any[];
  isBoxOpen: boolean = false;
  activeTab: string = 'percentage';
  percentageData: string = '';
  amountData: string = '';
  isButtonDisabled: boolean = true;
  resultAmount: any;
  // prePayBox: boolean = false;
  // ciTab: boolean = false;
  // invoiceType: string = '';
  // disableButton: boolean = false;
  advanceAPIbody: any;
  grnAttachmentArray: any;
  isAprUser: boolean;
  totalTaxDynamic = 0;
  totalAmountDynamic = 0;
  ap_enabled_exc: boolean;
  projectIdArr: any;
  projectCArr: any;
  filteredProject: any[];
  temp_header_data: any[];
  temp_line_data: any[];
  batch_id: number;
  bulk_bool: boolean = false;
  client_name: string;
  isMoreRequired: boolean;
  moreInfoBool: boolean;
  grnNumber_enova: string;
  d_type: any;
  ent_code: string;
  filteredPreData: any[];
  invNumbersList: any;
  mappingForCredit = false;
  rectData: any;
  isManpower: boolean;
  manpower_metadata = [];
  manpowerTableHeaders: { header: string; field: string; }[];
  isManpowerTags: boolean;
  manPowerGRNData: any;
  manPowerAPI_request: any;
  manpowerHeaderId: any;
  po_qty_array: any;
  po_balance_qty_array: any;
  disable_save_btn: boolean = false;
  saveDisabled: boolean;
  grnTooltip: string;
  headerData = [];
  lineTableHeaders: string[];
  isDraft: boolean;
  serverError: boolean;
  fieldName: any;
  decimal_count:number;
  lineTooltip: string = 'Shows the total amount, calculated as Quantity × Unit Price - Discount(value/percentage), for the line item.';
  configData: any;

  constructor(
    fb: FormBuilder,
    public tagService: TaggingService,
    public router: Router,
    private authService: AuthenticationService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private exceptionService: ExceptionsService,
    private AlertService: AlertService,
    private SpinnerService: NgxSpinnerService,
    private permissionService: PermissionService,
    private dataService: DataService,
    private settingService: SettingsService,
    private SharedService: SharedService,
    private mat_dlg: MatDialog,
    private datePipe: DatePipe
  ) {
    super();
    this.exceptionService.getMsg().pipe(take(2)).subscribe((msg) => {
      if (msg == 'mapping') {
        this.getInvoiceFulldata('');
      }
    })
  }

  ngOnInit(): void {
    this.configData = this.dataService?.configData;
    this.ERP = this.configData?.erpname;
    this.client_name = this.configData?.client_name;
    this.decimal_count = this.configData?.miscellaneous?.No_of_Decimals;
    if(!this.decimal_count){
      this.decimal_count = 2;
     }
    if (this.client_name == 'SRG') {
      this.mappingForCredit = true;
    } 
    const commonTags = [
      { header: 'S.No', field: '' },
      { header: 'Description', field: 'Name' },
      { header: 'PO quantity', field: 'PurchQty'},
      { header: 'GRN - Quantity', field: 'GRNQty' },
      { header: 'AmountExcTax', field: 'GRNAmountExcTax' },
      { header: 'PO balance quantity', field: 'RemainPurchPhysical'},
      { header: 'Actions', field:''}
    ];


    if (this.client_name == 'Cenomi') {
      commonTags.splice(6, 0, { header: 'PO Remaining %', field: 'percentage_po'});
    }
    this.GRN_PO_tags = [...commonTags];

    this.rejectReason = this.dataService.rejectReason;
    this.ap_boolean = this.dataService.ap_boolean;
    this.GRN_PO_Bool = this.dataService.grnWithPOBoolean;
    this.ent_code = this.dataService.ent_code;
    this.flipEnabled = true;
    // this.flipEnabled = this.dataService.configData.flipBool;
    this.userDetails = this.authService.currentUserValue;
    this.isDesktop = this.dataService.isDesktop;
    this.documentViewBool = this.isDesktop;
    this.enable_create_grn = this.permissionService.enable_create_grn;
    this.doc_status = this.dataService?.editableInvoiceData?.status;
    this.batch_id = this.dataService?.editableInvoiceData?.batch_id;
    this.activatedRoute.queryParams.subscribe(params => {
      this.uploadtime = params.uploadtime;
    })
    // this.sampleLineData = this.exceptionService.lineDataSample;
    if (this.userDetails.user_type == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer'
    }
    this.getEntity();
    this.initialData();
    this.ERPCostAllocation();
    this.AddPermission();
    if(this.GRN_PO_Bool){
      this.lineTable = commonTags;
    } 
    else {
      if(this.Itype == 'Invoice'){
        this.readFilePath();
      } 
    }
    this.isAdmin = this.dataService.isAdmin;

  }
  getPdfBool(event) {
    this.isPdfAvailable = event;
  }
  doc_view() {
    this.showPdf = true;
    this.documentViewBool = !this.documentViewBool
  }

  idleTimer(time, str) {
    this.timer = new IdleTimer({
      timeout: time, //expired after 180 secs
      clean: str,
      onTimeout: () => {
        if (this.router.url.includes('comparision-docs')) {
          this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          this.error("Session expired for editing invoice");
        }
      },
    });
  }

  updateSessionTime() {
    let sessionData = {
      session_status: true,
      "client_address": JSON.parse(sessionStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(sessionData)
      .subscribe((data: any) => { });
  }

  initialData() {
    this.routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.SharedService.invoiceID = params['id'];
      this.exceptionService.invoiceID = params['id'];
      this.invoiceID = params['id'];
    });
    this.editable = this.tagService.editable;
    // this.fin_boolean = this.permissionService.financeApproveBoolean;
    if (this.router.url.includes('approvals') && this.permissionService.financeApproveBoolean) {
      this.fin_boolean = true;
    }

    this.submitBtn_boolean = this.tagService.submitBtnBoolean;
    this.approveBtn_boolean = this.tagService.approveBtnBoolean;
    this.approval_selection_boolean =
      this.tagService.approval_selection_boolean;
    this.isLCMInvoice = this.tagService.LCM_boolean;
    this.documentType = this.dataService.documentType;
    this.documentInvType = this.tagService.documentType;
    this.documentTypeId = this.dataService.idDocumentType;
    this.userDetails = this.authService.currentUserValue;
    // this.approvalType = this.tagService.approvalType;
    this.financeapproveDisplayBoolean =
      this.settingService.finaceApproveBoolean;
    this.subStatusId = this.dataService.subStatusId;
    this.statusId = this.dataService.statusId;


    if (
      this.router.url.includes('invoice/InvoiceDetails/vendorUpload') ||
      this.router.url.includes('invoice/InvoiceDetails/CustomerUpload')
    ) {
      this.vendorUploadBoolean = true;
      this.uploadCompleted = false;
    } else {
      this.vendorUploadBoolean = false;
    }
    if (this.router.url.includes('InvoiceDetails') || this.router.url.includes('comparision-docs')) {
      this.Itype = 'Invoice';
      if (this.editable && !['advance invoice', 'non-po', 'credit note'].includes(this.documentType) || this.mappingForCredit) {
        this.readLineItems();
      }
    } else if (this.router.url.includes('PODetails')) {
      this.Itype = 'PO';
    } else if (this.router.url.includes('GRNDetails')) {
      this.Itype = 'GRN';
    } else if (this.router.url.includes('serviceDetails')) {
      this.Itype = 'Service';
    }

    if (this.router.url.includes('Create_GRN_inv_list') || this.router.url.includes('GRN_approvals') || this.GRN_PO_Bool) {
      if (this.permissionService.GRNPageAccess == true) {
        this.grnCreateBoolean = true;
        this.showPdf = false;
        this.btnText = 'View invoice';
        this.currentTab = 'line';
        if (this.GRN_PO_Bool) {
          if(this.dataService.isEditGRN){
            this.tagService.headerName = 'Update GRN';
            this.Itype = 'GRN';
          } else {
            this.tagService.headerName = 'Create GRN with PO';
            this.Itype = 'PO';
          }
          
          this.getInvoiceFulldata_po();
        } else {
          if (this.router.url.includes('GRN_approvals')) {
            this.tagService.headerName = 'GRN Approval';
          } else {
            this.tagService.headerName = 'Create GRN with invoice';
          }
          this.readGRNInvData();
          this.Itype = 'Invoice';
        }
        // this.readPOLines();
        // if (this.grnCreateBoolean) {

        // }
      } else {
        alert('Sorry!, you do not have access');
        this.router.navigate(['customer/invoice/allInvoices']);
      }
    } else {
      this.getInvoiceFulldata('');
      // this.getRulesData();
      // this.readPOLines();
      // this.readErrorTypes();
      // this.readMappingData();
      if (!['advance invoice'].includes(this.documentType) && this.Itype == 'invoice') {
        this.getGRNtabData();
        if(this.client_name != 'SRG'){
          this.getGrnAttachment();
        }
      }


      if (this.tagService.editable == true && this.grnCreateBoolean == false) {
        this.updateSessionTime();
        this.idleTimer(180, 'Start');
        this.callSession = setTimeout(() => {
          this.updateSessionTime();
        }, 250000);
      }
    }
    // this.onResize();
    // this.Itype = this.tagService.type;

    this.routeOptions();
    if (this.fin_boolean) {
      this.getRejectionComments();
    }
    this.headerName = this.tagService.headerName;

    // this.showInvoice = "/assets/New folder/MEHTAB 9497.pdf"
  }
  manpowerMetadataFunction() {
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun("Please confirm whether you want to add manpower data in GRN?", "confirmation", "Confirmation")
    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        this.open_dialog_comp("manpower_metadata");
        
      }
    })
  }

  routeOptions() {
    if (this.documentInvType == 'lcm' || this.documentInvType == 'multipo') {
      if (this.documentInvType == 'multipo') {
        this.multiPOBool = true;
        this.currentTab = "line";
      }
      this.isLinenonEditable = true;
    }

    if (this.approval_selection_boolean == true && this.isLCMInvoice == true) {
      this.supportTabBoolean = false;
      this.isLCMTab = true;
      this.readPONumbersLCM(this.dataService.entityID);
      this.showPdf = false;
      this.btnText = 'View invoice';
      this.currentTab = "LCM";

      // this.selectionTabBoolean = true;
      // this.supportTabBoolean = true;
    } else if (this.approval_selection_boolean == true && this.isLCMInvoice == false) {
      this.readDepartment();
      this.readCategoryData();
      this.showPdf = false;
      this.btnText = 'View invoice';
      this.currentTab = "approver_selection";
      this.selectionTabBoolean = true;
      this.supportTabBoolean = true;
      this.isLCMCompleted = true;

    } else {
      // this.showPdf = true;
      // this.btnText = 'Close';
      this.selectionTabBoolean = false;
    }
  }
  // cost allocation selection based on ERP
  ERPCostAllocation() {
    if (this.ERP == 'JD') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Business Unit', field: 'costCenter' },
        { header: 'Company Code', field: 'interco' },
        { header: 'Non Vat ItemCodes', field: 'fixedAssetDepartment' },
        { header: 'Vat ItemCode', field: 'fixedAssetGroup' },
        { header: 'Object Code', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    } else if (this.ERP == 'Dynamics' || this.ERP == 'Oracle') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Cost Center', field: 'costCenter' },
        { header: 'Product', field: 'product' },
        { header: 'Project', field: 'project' },
        { header: 'Interco', field: 'interco' },
        { header: 'Segments', field: 'segments' },
        { header: 'BSMovements', field: 'bsMovements' },
        { header: 'fixedAssetDepartment', field: 'fixedAssetDepartment' },
        { header: 'fixedAssetGroup', field: 'fixedAssetGroup' },
        { header: 'Main Account', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    } else if (this.ERP == 'SAP') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Cost Center', field: 'costCenter' },
        { header: 'Product', field: 'product' },
        { header: 'Project', field: 'project' },
        { header: 'Interco', field: 'interco' },
        { header: 'Segments', field: 'segments' },
        { header: 'BSMovements', field: 'bsMovements' },
        { header: 'fixedAssetDepartment', field: 'fixedAssetDepartment' },
        { header: 'fixedAssetGroup', field: 'fixedAssetGroup' },
        { header: 'Main Account', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    }
  }
  AddPermission() {
    if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == false &&
      this.permissionService.financeApproveBoolean == false
    ) {
      this.editPermissionBoolean = true;
    } else if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == true &&
      this.permissionService.financeApproveBoolean == false
    ) {
      this.changeApproveBoolean = true;
    } else if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == true &&
      this.permissionService.financeApproveBoolean == true
    ) {
      this.financeApproveBoolean = true;
    }
  }

  changeTab(val) {
    this.currentTab = val;
    if (val == 'header' || val == 'cost' || val == 'fixed') {
      this.showPdf = true;
      this.btnText = 'Close';

    } else {
      this.showPdf = false;
      this.btnText = 'View invoice';
    }
    if (this.currentTab === 'support') {
      this.supportTabBoolean = true;

    } else if (this.currentTab === 'approver_selection') {

      this.selectionTabBoolean = true;
      this.supportTabBoolean = true;
    } else {
      this.supportTabBoolean = false;
      this.selectionTabBoolean = false;
    }

    if (this.currentTab == 'LCM') {
      this.isLCMTab = true;
    }
    if (val == 'cost' || val == 'dynamic') {
      this.costTabBoolean = true;
    } else {
      this.costTabBoolean = false;
    }
    // if (val == 'line') {
    //   this.lineTabBoolean = true;
    // } else {
    //   this.lineTabBoolean = false;
    // }
  }

  get_PO_GRN_Lines() {
    this.GRNObject = [];
    this.descrptonBool = true;
    let linesData = []
    this.dataService.GRN_PO_Data.forEach((ele,i)=>{
      linesData.push({})
      for(const line in ele){
        linesData[i][line] = {Value: ele[line]}
      }
      if (this.client_name === 'Cenomi' && !this.dataService.isEditGRN) {
        linesData[i]['GRNQty'] = { Value: '' };
      } else if(this.client_name === 'Cenomi' && this.dataService.isEditGRN) {
        linesData[i]['GRNQty'] = { Value: ele['GRNQty'] };
      } else {
        linesData[i]['GRNQty'] = { Value: ele['RemainPurchPhysical'] };
      }
      const unitPrice = parseFloat(ele?.UnitPrice?.replace(/,/g, ''));
      let amount;
      if(this.dataService.isEditGRN){
        amount = (unitPrice * ele.GRNQty).toFixed(2);
      } else {
        amount = (unitPrice * ele.PurchQty).toFixed(2);
      }
      this.GRN_line_total += Number(amount);
      if(this.client_name === 'Cenomi' && !this.dataService.isEditGRN){  
        linesData[i]['GRNAmountExcTax'] = {Value: ''}
      } else {
        linesData[i]['GRNAmountExcTax'] = {Value: amount}
      }

      if(this.client_name === 'Cenomi' && this.GRN_PO_Bool){
        const POQty = ele?.PurchQty ? parseFloat(ele.PurchQty.replace(/,/g, '')) : 0;
        const POBalanceQty = ele?.RemainPurchPhysical ? parseFloat(ele.RemainPurchPhysical.replace(/,/g, '')) : 0;
        let percentage = '0.00';
        if (POQty !== 0) {
          // const PORemaining =  (POQty - POBalanceQty) * 100;
          percentage = ((POBalanceQty / POQty) * 100).toFixed(2);
        }
        linesData[i]['percentage_po'] = {Value: percentage}
      }
      
    })
    // this.dataService.GRN_PO_Data.forEach((ele, i) => {
    //   const tagMappings = {
    //     'Description': { value: 'Name', oldValue: 'Name', isMapped: '', tagName: 'Description' },
    //     'PO Qty': { value: 'PurchQty', isMapped: '', tagName: 'PO Qty' },
    //     'PO Balance Qty': { value: 'RemainPurchPhysical', isMapped: '', tagName: 'PO Balance Qty' },
    //     'GRN - Quantity': { value: this.dataService.isEditGRN ?'GRNQty':'', isMapped: '', tagName: 'Quantity' },
    //     'UnitPrice': { value: 'UnitPrice', isMapped: 'Price', tagName: 'UnitPrice' },
    //     'AmountExcTax': {
    //       value: (ele) => {
    //         const unitPrice = parseFloat(ele.UnitPrice.replace(/,/g, ''));
    //         let amount;
    //         if(this.dataService.isEditGRN){
    //           amount = (unitPrice * ele.GRNQty).toFixed(2);
    //         } else {
    //           amount = (unitPrice * ele.PurchQty).toFixed(2);
    //         }
    //         this.GRN_line_total += Number(amount);
    //         return Number(amount);
    //       },
    //       isMapped: '',
    //       tagName: 'AmountExcTax'
    //     },
    //     'Actions': { value: '', isMapped: '', tagName: 'Actions' }
    //   };

    //   if (this.client_name == 'Cenomi' && this.isManpowerTags) {
    //     tagMappings['Duration in months'] = { value: 'durationMonth', isMapped: '', tagName: 'Duration in months' }
    //     tagMappings['Monthly quantity'] = {
    //       value: (ele) => {
    //         let monthlyQuantity = 0;
    //         if (ele.durationMonth) {
    //           monthlyQuantity = ele.PurchQty / ele.durationMonth;
    //         }
    //         return monthlyQuantity.toFixed(2);
    //       }, isMapped: '', tagName: 'Monthly quantity'
    //     }
    //     tagMappings['Is Timesheets'] = { value: 'isTimesheets', isMapped: '', tagName: 'Is Timesheets' }
    //     tagMappings['Number of Shifts'] = { value: 'shifts', isMapped: '', tagName: 'Number of Shifts' }
    //   }

    //   this.GRN_PO_tags.forEach((tag, index) => {
    //     console.log(tag)
    //     if (tagMappings[tag.TagName]) {
    //       const mapping = tagMappings[tag.TagName];
    //       const value = typeof mapping.value === 'function' ? mapping.value(ele) : ele[mapping.value];
    //       tag.linedata.push({
    //         Value: value,
    //         old_value: mapping.oldValue ? ele[mapping.oldValue] : undefined,
    //         ErrorDesc: '',
    //         idDocumentLineItems: ele.LineNumber,
    //         is_mapped: mapping.isMapped,
    //         LineNumber: ele.LineNumber || ele.itemCode,
    //         tagName_u: `${mapping.tagName}-${ele.LineNumber || ele.itemCode}-${i}`,
    //         tagName: mapping.tagName
    //       });
    //     }
    //   });
    // })
    const timeSheetTag = this.GRN_PO_tags?.find(item => item.TagName === 'Is Timesheets');
    if (timeSheetTag) {
      this.GRN_PO_tags.forEach(item => {
        if (item.TagName == 'GRN - Quantity') {
          item.linedata.forEach(el => {
            timeSheetTag.linedata.forEach(item => {
              if (el.LineNumber == item.LineNumber && item.Value == true || item.Value == 'Yes') {
                el.is_timesheets = true;
              }
            });

          });
        }
      });
    }
    this.po_qty_array = this.GRN_PO_tags.find(item => item.TagName === 'PO Qty');
    this.po_balance_qty_array = this.GRN_PO_tags.find(item => item.TagName === 'PO Balance Qty');
    this.lineDisplayData = linesData;
    let arr = linesData;
    setTimeout(() => {
      // arr.forEach((ele1) => {
      //   if (ele1.TagName == 'GRN - Quantity' || ele1.TagName == 'Description' || ele1.TagName == 'UnitPrice') {
      //     this.GRNObject.push(ele1.linedata);
      //   }
      //   if (ele1.TagName == 'GRN - Quantity') {
      //     ele1.linedata?.forEach((el) => {
      //       el.is_quantity = true;
      //     });
      //   }
      //   this.GRNObject = [].concat(...this.GRNObject);
      // });
      // this.GRNObject.forEach((val) => {
      //   if (!val.old_value) {
      //     val.old_value = val.Value;
      //   }
      // });
    }, 100);
    this.grnLineCount = this.lineDisplayData[0]?.linedata;
    this.isGRNDataLoaded = true;
  }

  getInvoiceFulldata_po() {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    let doc_type = 'po';
    if(this.Itype == 'GRN'){
      doc_type = 'grn'
    }
    this.SharedService.getInvoiceInfo(false,doc_type).subscribe(
      (data: any) => {
        const pushedArrayHeader = [];
        // data.ok.headerdata.forEach((element) => {
        //   this.mergedArray = {
        //     ...element.DocumentData,
        //     ...element.DocumentTagDef,
        //   };
        //   this.mergedArray.DocumentUpdates = element.DocumentUpdates;
        //   pushedArrayHeader.push(this.mergedArray);
        // });
        this.inputData = data?.ok?.headerdata;
        let GRN_linedata = data?.ok?.linedata;
       if(this.dataService.isEditGRN){
        let po_lines = this.dataService.po_lines;
        this.dataService.GRN_PO_Data = this.exceptionService.convertData(GRN_linedata, this.exceptionService.po_num);
        this.getPODocId(this.exceptionService.po_num)
        po_lines?.forEach(line=>{
          this.dataService.GRN_PO_Data.forEach(grn_line=>{
            if(line.LineNumber == grn_line.LineNumber){
              grn_line.PurchQty = line.PurchQty;
              grn_line.RemainPurchPhysical = line.RemainPurchPhysical;
              
            }
          })
        })
       } 
      //  else {
      //   this.getPODocId(this.po_num);
      //  }
        this.manpower_metadata = this.dataService?.grn_manpower_metadata?.headerFields;
        if (this.client_name == 'Cenomi' && this.router.url.includes('Create_GRN_inv_list')) {
          if (this.manpower_metadata?.length < 1 && !this.dataService.isEditGRN) {
            this.manpowerMetadataFunction();
          } else {
            this.createTimeSheetDisplayData('old');
          }
        }
        this.SpinnerService.hide();
        this.get_PO_GRN_Lines();
        // let inv_num_data: any = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
        // });
        // this.invoiceNumber = inv_num_data[0]?.Value;
        // let po_num_data = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'PurchaseOrder' || val.TagLabel ==  'PurchId');
        // });
        this.headerDataOrder();
        // this.po_num = po_num_data[0]?.Value;
        if (data?.ok?.vendordata) {
          this.vendorData = {
            ...data?.ok?.vendordata[0].Vendor,
            ...data?.ok?.vendordata[0].VendorAccount,
            ...data?.ok?.vendordata[0].VendorUser,
          };
          this.vendorName = this.vendorData['VendorName'];
          this.vendorId = this.vendorData['idVendor'];
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  getInvoiceFulldata(str) {
    this.SpinnerService.show();
    this.lineDisplayData = [];
    this.inputDisplayArray = [];
    this.vendorData = [];
    this.inputData = [];
    // this.lineData = [];
    let bool = false;

    if (this.Itype == 'PO' || this.Itype == 'GRN' || this.Itype == 'Service' || this.dataService.documentType == 'advance invoice' || this.dataService.documentType == 'non-po' || this.dataService.documentType == 'credit note' && !this.mappingForCredit) {
      this.pageType = "normal";
    } else {
      this.pageType = "mapping";
      bool = true;
    }
    let doc_type = 'invoice';
    doc_type = this.Itype;
    if(this.Itype == 'Service'){
      doc_type = 'invoice'
    }
    this.SharedService?.getInvoiceInfo(bool,doc_type.toLowerCase()).subscribe(
      (data: any) => {
        let response = data.ok;
        this.lineData = data?.ok?.linedata;
        
        if (response?.uploadtime) {
          this.uploadtime = response?.uploadtime;
        }
        if (response.doc_type) {
          this.docType = response?.doc_type?.toLowerCase();
          this.documentType = response?.doc_type?.toLowerCase();
        }

        this.getInvTypes();
        if (this.pageType == "mapping") {
          this.calculateCost();
        }
        this.po_total = response.po_total;
        response?.cost_alloc?.forEach(cost => {
          let merge = { ...cost.AccountCostAllocation }
          this.costAllocation.push(merge);
        })
        this.normalCostAllocation = false;
        response?.dynamic_cost_alloc?.forEach(dynamic => {
          this.dynamicdata.push(dynamic);
          this.totalTaxDynamic = this.totalTaxDynamic + Number(dynamic?.calculatedtax);
          this.totalAmountDynamic = this.totalAmountDynamic + Number(dynamic?.amount);
        })
        this.inputData = response?.headerdata;
        // this.temp_header_data = response?.headerdata?.slice();
        this.isMoreRequired = response?.approverData?.more_info_required;

        if (response?.approverData?.to_approve_by) {
          let ap_id = response?.approverData?.to_approve_by[0];
          if (ap_id == this.SharedService.userId) {
            this.isAprUser = true;
          }
        }
        this.invoiceNumber = this.dataService.invoiceNumber;
        // let inv_num_data: any = this.inputData.filter(val => {
        //   return val.TagLabel == 'InvoiceId';
        // })
        // this.invoiceNumber = inv_num_data[0]?.Value;
        // let po_num_data = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'PurchaseOrder');
        // });
        // this.po_num = po_num_data[0]?.Value;
        if (response?.servicedata) {
          this.isServiceData = true;
          this.vendorData = {
            ...response.servicedata[0].ServiceAccount,
            ...response.servicedata[0].ServiceProvider,
          };
          this.vendorName = this.vendorData['ServiceProviderName'];
          this.serviceProvidercode = this.vendorData['ServiceProviderCode'];
          if (this.vendorName == 'SANAM') {
            this.isFormValid = false;
            this.reqServiceprovider = true;
            // this.costTabBoolean = false;
            // this.reqDataValidation();
          }
          else {
            this.reqServiceprovider = false;
          }
        }
        this.headerDataOrder();
        let poNum = this.po_num;
        if(!this.po_num){
          poNum = this.exceptionService.po_num;
        }
        if (this.po_num) {
          this.getPODocId(this.po_num);
          this.getGRNnumbers(this.po_num);
        }
        if (this.documentType == 'credit note') {
          this.getProjectData();
          this.getProjectCatData();
          this.getPOs();
          this.getVendorInvoices(this.po_num)
          this.projectCArr = this.dataService.projectCArr;
          this.projectIdArr = this.dataService.projectIdArr;
        }
        this.lineDisplayData = response.linedata;
        let fieldOrder;
        if(this.Itype == 'PO'){
          fieldOrder = {
            "LineNumber": 1,
            "ItemId": 2,
            "Name": 3,
            "ProcurementCategory": 4,
            "PurchQty": 5,
            "UnitPrice": 6,
            "DiscAmount": 7,
            "DiscPercent": 8
          };
        } else {
          fieldOrder = {
            "Description": 1,
            "Quantity": 2,
            "UnitPrice": 3,
            "AmountExcTax": 4,
            "Discount": 5,
            "Tax": 6,
            "VAT%": 7,
            "Amount": 8
          };
        }

        if (this.lineDisplayData.length > 0) {
            this.lineDisplayData.forEach((element) => {
            if(this.client_name == 'Cenomi'){
                this.lineItems?.forEach(item=>{
                  if(item?.itemCode == element?.invoice_itemcode){
                    element.lines.Description.po_line.Value = `${item?.itemCode}-${item?.Name}-${item?.UnitPrice}-${item?.SHIP_TO_ORG}-${item?.Qty}`
                  }
                })
            }
          })

          this.lineTableHeaders = Object.keys(this.lineDisplayData[0].lines)
            .sort((a, b) => (fieldOrder[a] || 100) - (fieldOrder[b] || 100));
        }
        this.temp_line_data = JSON.parse(JSON.stringify(response.linedata));

        // if (this.pageType == 'normal') {
        //   if (this.Itype == 'PO') {
        //     let count = 0;
        //     let array = response?.linedata;
        //     array.forEach((val) => {
        //       if (val.TagName == 'LineNumber') {
        //         val.id = 1;
        //       } else if (val.TagName == 'ItemId') {
        //         val.id = 2;
        //       } else if (val.TagName == 'Name') {
        //         val.id = 3;
        //       } else if (val.TagName == 'ProcurementCategory') {
        //         val.id = 4;
        //       } else if (val.TagName == 'PurchQty') {
        //         val.id = 5;
        //       } else if (val.TagName == 'UnitPrice') {
        //         val.id = 6;
        //       } else if (val.TagName == 'DiscAmount') {
        //         val.id = 7;
        //       } else if (val.TagName == 'DiscPercent') {
        //         val.id = 8;
        //       } else {
        //         count = count + 9;
        //         val.id = count;
        //       }
        //     });
        //     this.lineDisplayData = array.sort((a, b) => a.id - b.id);
        //   } else {
        //     this.lineDisplayData = response.linedata;
        //     if (this.isDesktop) {
        //       // this.lineDisplayData.unshift({
        //       //   TagName: 'S.No',
        //       //   idDocumentLineItemTags: 1,
        //       // });

        //     } else {
        //       // Get the maximum number of linedata entries across all tags
        //       const maxLinedataEntries = Math.max(...this.lineDisplayData.map(tag => tag.linedata.length));

        //       // Iterate through the index of linedata entries
        //       for (let dataIndex = 0; dataIndex < maxLinedataEntries; dataIndex++) {
        //         const transformedData: any = [];
        //         let hasError = false;
        //         let hasUpdated = false;

        //         // Iterate through the received data
        //         this.lineDisplayData.forEach(tag => {
        //           const tagName = tag.TagName;
        //           const linedata = tag.linedata[dataIndex];
        //           const itemData = linedata.DocumentLineItems;

        //           // Check if any isError is 1
        //           if (itemData.isError === 1) {
        //             hasError = true;
        //           }
        //           if (itemData.IsUpdated === 1) {
        //             hasUpdated = true;
        //           }

        //           // Create an object with the TagName and linedata for the current index
        //           const tagObject = {
        //             TagName: tagName,
        //             linedata: linedata
        //           };

        //           // Add the tagObject to the transformedData array
        //           transformedData.push(tagObject);
        //         });
        //         transformedData.hasError = hasError;
        //         transformedData.hasUpdated = hasUpdated;
        //         // Add the transformedData array for the current index to the main array
        //         this.linedata_mobile.push(transformedData);
        //       }
        //     }
        //     if (this.editable && !this.fin_boolean) {
        //       this.lineDisplayData.push({
        //         TagName: 'Actions',
        //         idDocumentLineItemTags: 1,
        //       });
        //     }
        //     this.inv_line_total = 0;
        //     this.lineDisplayData.forEach((ele) => {
        //       if (ele.TagName == 'S.No') {
        //         ele.linedata = this.lineDisplayData[2]?.linedata;
        //       } else if (ele.TagName == 'Actions') {
        //         ele.linedata = this.lineDisplayData[2]?.linedata;
        //       }
        //       if (ele.TagName == 'AmountExcTax') {
        //         ele.linedata.forEach(ele => {
        //           this.inv_line_total = this.inv_line_total + parseFloat(ele.DocumentLineItems.Value);
        //         })
        //       }
        //     });
        //   }
        // } else {
        //   this.lineDisplayData.forEach((element, index, arr) => {
        //     this.lineCount = arr[0].items
        //     if (element.tagname == 'Description') {
        //       element.order = 1;
        //     } else if (element.tagname == 'Quantity') {
        //       element.order = 2;
        //     } else if (element.tagname == 'UnitPrice') {
        //       element.order = 3;
        //     } else if (element.tagname == 'Unit') {
        //       element.order = 4;
        //     } else if (element.tagname == 'Discount') {
        //       element.order = 5;
        //     } else if (element.tagname == 'AmountExcTax') {
        //       element.order = 6;
        //     }
        //   });
        //   this.lineDisplayData = this.lineDisplayData.sort((a, b) => a.order - b.order);
        // }
        let vendorData = response?.vendordata;
        if (vendorData) {
          this.isServiceData = false;
          this.vendorData = {
            ...vendorData[0].Vendor,
            ...vendorData[0].VendorAccount,
            ...vendorData[0].VendorUser,
          };
          this.vendorAcId = this.vendorData['idVendorAccount'];
          this.vendorName = this.vendorData['VendorName'];
          this.vendorId = this.vendorData['idVendor'];
        }

        this.support_doc_list = response?.support_doc?.files;
        if (this.support_doc_list == null) {
          this.support_doc_list = []
        }
        if (str != 'batch') {
          setTimeout(() => {
            this.SpinnerService.hide();
          }, 2000);
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
        this.serverError = true;
      }
    );
  }
  lineDataConversion() {
    const originalData = this.lineDisplayData;


    // Function to convert the original data
    function convertData(originalData: any[]): any[] {
      const result: any[] = [];

      originalData.forEach((tag) => {
        const tagItems = tag.items;

        tagItems?.forEach((item) => {
          const itemCode = item?.itemcode;
          const description = item?.linedetails[0]?.invline[0]?.DocumentLineItems.Value;
          const quantity = item.linedetails[0].invline[0].DocumentLineItems.Value;
          const unitPrice = item.linedetails[0].poline[0].Value;

          const invlineRecord = {
            tagName: tag.tagname,
            itemCode,
            invline: [
              {
                DocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems,
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const quantityRecord = {
            tagName: 'Quantity',
            itemCode,
            invline: [
              {
                DocumentLineItems: {
                  idDocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems.idDocumentLineItems,
                  ErrorDesc: item.linedetails[0].invline[0].DocumentLineItems.ErrorDesc,
                  Value: quantity,
                  isError: item.linedetails[0].invline[0].DocumentLineItems.isError,
                  itemCode,
                },
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const unitPriceRecord = {
            tagName: 'UnitPrice',
            itemCode,
            invline: [
              {
                DocumentLineItems: {
                  idDocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems.idDocumentLineItems,
                  ErrorDesc: item.linedetails[0].invline[0].DocumentLineItems.ErrorDesc,
                  Value: unitPrice,
                  isError: item.linedetails[0].invline[0].DocumentLineItems.isError,
                  itemCode,
                },
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const polineRecord = {
            tagName: tag.tagname,
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: description,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          const quantityPolineRecord = {
            tagName: 'Quantity',
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: quantity,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          const unitPricePolineRecord = {
            tagName: 'UnitPrice',
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: unitPrice,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          result.push([invlineRecord, quantityRecord, unitPriceRecord]);
          result.push([polineRecord, quantityPolineRecord, unitPricePolineRecord]);
        });
      });

      return result;
    }

    // Calling the function with the original data
    const convertedData = convertData(originalData);


    this.sampleLineData = convertedData;
  }
  getPOs() {
    this.poList = [];
    this.exceptionService.getInvoicePOs().subscribe(((data: any) => {
      data.forEach(ele => {
        this.poList.push(ele.PODocumentID);
      })
    }))
  }
  getVendorInvoices(po_num) {
    this.invNumbersList = []
    this.SharedService.readVenInvoices(po_num).subscribe((data: any) => {
      data.forEach(ele => {
        this.invNumbersList.push(ele.docheaderID);
      })
    })
  }

  headerDataOrder() {
    this.headerData = [];
    if(!this.isServiceData){
      const orderMap = {
        'VendorName': 1,
        'VendorAddress': 2,
        'PurchaseOrder': 3,
        'PurchId': 3,
        'POHeaderId': 3,
        'InvoiceId': 4,
        'bill_number': 4,
        'InvoiceTotal': 5,
        'InvoiceDate': 6,
        'TotalTax': 7,
        'SubTotal': 8,
        'PaymentTerm': 9,
        'TRN': 10,
        'DueDate': 11,
      };

      Object.keys(this.inputData).forEach(label => {

        const order = orderMap[label];
        label = label.toString();
        if (order) {
          this.inputData[label].order = order;
          if (label === 'PurchaseOrder' || label === 'PurchId' || label === 'POHeaderId') {
            this.po_num = this.inputData[label]?.Value;
          } else if (label === 'InvoiceId' || label === 'bill_number') {
            this.invoiceNumber = this.inputData[label]?.Value;
          } else if (label === 'SubTotal') {
            this.invoice_subTotal = this.inputData[label]?.Value;
          }
          this.headerData.push({TagLabel: label, ...this.inputData[label]})
        }
      });
      
    } else {
      const orderMap = {
        'company name': 1,
        'customer po box': 2,
        'bill number': 3,
        'customer trn': 4,
        'bill issue date': 5,
        'account number': 6,
        'bill period': 7
      };

      Object.keys(this.inputData).forEach(label => {
        const order = orderMap[label];
        if (order) {
          this.inputData[label].order = order;
          if (label === 'InvoiceId' || label === 'bill_number') {
            this.invoiceNumber = this.inputData[label]?.Value;
          } else if (label === 'SubTotal') {
            this.invoice_subTotal = this.inputData[label]?.Value;
          }
        }
        this.headerData.push({TagLabel: label, ...this.inputData[label]})

      });
    }
    // Separate items with and without the 'order' key
    const withOrder = this.headerData.filter(item => item.hasOwnProperty('order'));
    const withoutOrder = this.headerData.filter(item => !item.hasOwnProperty('order'));

    // Sort the items with 'order' by their 'order' value
    withOrder.sort((a, b) => a.order - b.order);

    // Concatenate the sorted items with 'order' and those without 'order'
    this.headerData = withOrder.concat(withoutOrder);
  }

  readGRNInvData() {
    this.SpinnerService.show();
    this.SharedService.readReadyGRNInvData().subscribe(
      (data: any) => {
        this.lineDisplayData = [];
       const lineData = data.ok?.linedata;
        this.grnLineCount = lineData.length;
        let dummyLineArray = lineData;
        this.lineDisplayData = lineData;
        lineData.forEach(item=>{
          Object.keys(item).forEach(label=>{
            if(label === 'GRNAmountExcTax'){
              this.GRN_line_total = this.GRN_line_total + Number(item[label]?.Value)
            } else if(label === 'PODescription' && item[label]?.Value){
              this.descrptonBool = true;
            }
          })
        })
        // console.log(this.lineDisplayData)
        // dummyLineArray.forEach((ele, i, array) => {
        //   if (ele.TagName == 'Quantity') {
        //     ele.TagName = 'Inv - Quantity';
        //     ele.linedata?.forEach((ele2, index) => {
        //       this.validatePOInvUnit.push({ invoice_itemcode: ele2?.invoice_itemcode })
        //       if (ele.linedata?.length <= ele.grndata?.length) {
        //         ele.grndata?.forEach((ele3) => {
        //           ele.grndata[index].old_value = ele2?.Value;
        //         });
        //       }
        //     });
        //   } else if (ele.TagName == 'UnitPrice') {
        //     ele.TagName = 'Inv - UnitPrice';
        //   } else if (ele.TagName == 'Description' || ele.TagName == 'Name') {
        //     if (ele.linedata?.length > 0) {
        //       this.descrptonBool = true;
        //     }
        //   }
        //   if (ele.TagName == 'AmountExcTax') {
        //     ele.TagName = 'Inv - AmountExcTax';
        //     ele.linedata.forEach(v => {
        //       this.GRN_line_total = this.GRN_line_total + Number(v.Value)
        //     })
        //   }

        //   setTimeout(() => {
        //     if (
        //       ele.TagName == 'Inv - Quantity' &&
        //       (ele.grndata == null || ele.grndata.length == 0)
        //     ) {
        //       array.splice(2, 0, {
        //         TagName: 'GRN - Quantity',
        //         linedata: ele.linedata,
        //       });
        //       array.splice(7, 0, {
        //         TagName: 'Comments',
        //         linedata: ele.linedata,
        //       });
        //     } else if (
        //       ele.TagName == 'Inv - Quantity' &&
        //       ele.grndata != null &&
        //       ele.grndata &&
        //       ele.grndata.length != 0
        //     ) {
        //       array.splice(2, 0, {
        //         TagName: 'GRN - Quantity',
        //         linedata: ele.grndata,
        //       });
        //       array.splice(7, 0, {
        //         TagName: 'Comments',
        //         linedata: ele.grndata,
        //       });
        //       let poQty = [];
        //       let poBalQty = [];
        //       ele.podata.forEach((v) => {
        //         if (v.TagName == 'PurchQty') {
        //           poQty.push(v);
        //         } else if (v.TagName == 'RemainPurchPhysical') {
        //           poBalQty.push(v);
        //         }
        //       });
        //       if (poQty.length > 0) {
        //         array.splice(8, 0, { TagName: 'PO quantity', linedata: poQty });
        //         // array.splice(9, 0, {
        //         //   TagName: 'PO balance quantity',
        //         //   linedata: poBalQty,
        //         // });
        //       }
        //     } else if (
        //       ele.TagName == 'Inv - UnitPrice' &&
        //       (ele.grndata == null || ele.grndata.length == 0)
        //     ) {
        //       array.splice(4, 0, {
        //         TagName: 'GRN - UnitPrice',
        //         linedata: ele.linedata,
        //       });
        //     } else if (
        //       ele.TagName == 'Inv - UnitPrice' &&
        //       ele.grndata != null &&
        //       ele.grndata &&
        //       ele.grndata.length != 0
        //     ) {
        //       array.splice(4, 0, {
        //         TagName: 'GRN - UnitPrice',
        //         linedata: ele.grndata,
        //       });
        //     } else if (
        //       ele.TagName == 'Inv - AmountExcTax' &&
        //       (ele.grndata == null || ele.grndata.length == 0)
        //     ) {
        //       array.splice(6, 0, {
        //         TagName: 'GRN - AmountExcTax',
        //         linedata: ele.linedata,
        //       });
        //     } else if (
        //       ele.TagName == 'Inv - AmountExcTax' &&
        //       ele.grndata != null &&
        //       ele.grndata &&
        //       ele.grndata.length != 0
        //     ) {
        //       array.splice(6, 0, {
        //         TagName: 'GRN - AmountExcTax',
        //         linedata: ele.grndata,
        //       });
        //     }
        //   }, 10);
        // });
        // this.lineDisplayData = dummyLineArray;
        this.getInvTypes();
        // setTimeout(() => {
        //   this.lineDisplayData = this.lineDisplayData.filter((v) => {
        //     return !(
        //       v.TagName == 'Inv - AmountExcTax'
        //     );
        //   });
        // }, 100);
        // let arr = dummyLineArray;
        // setTimeout(() => {
        //   arr.forEach((ele1) => {
        //     if (ele1.TagName.includes('GRN') || ele1.TagName == 'Description') {
        //       this.GRNObject.push(ele1.linedata);
        //     }
        //     if (ele1.TagName == 'GRN - Quantity') {
        //       ele1.linedata?.forEach((el) => {
        //         el.is_quantity = true;
        //       });
        //     }
        //     this.GRNObject = [].concat(...this.GRNObject);
        //   });
        //   this.GRNObject.forEach((val) => {
        //     if (!val.old_value) {
        //       val.old_value = val.Value;
        //     }
        //   });
        // }, 100);

        // const pushedArrayHeader = [];
        // data.ok.headerdata.forEach((element) => {
        //   this.mergedArray = {
        //     ...element.DocumentData,
        //     ...element.DocumentTagDef,
        //   };
        //   this.mergedArray.DocumentUpdates = element.DocumentUpdates;
        //   pushedArrayHeader.push(this.mergedArray);
        // });
        this.inputData = data?.ok?.headerdata?.headerData;
        // let inv_num_data: any = this.inputData.filter(val => {
        //   return val.TagLabel == 'InvoiceId';
        // })
        // this.invoiceNumber = inv_num_data[0]?.Value;
        // let po_num_data = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'PurchaseOrder');
        // });
        this.headerDataOrder();
        // this.po_num = po_num_data[0]?.Value;
        let poNum = this.po_num
        if(!this.po_num){
          poNum = this.exceptionService.po_num;
        }
        this.getPODocId(poNum);
        this.getGRNnumbers(poNum);
        this.vendorData = {
          ...data.ok.vendordata[0].Vendor,
          ...data.ok.vendordata[0].VendorAccount,
        };
        this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.vendorData['VendorName'];
        this.vendorId = this.vendorData['idVendor'];
        // this.selectedRule = data.ok.ruledata[0].Name;
        // this.poList = data.all_pos;
        // if (this.router.url.includes('GRN_approvals')) {
        //   let index = this.lineDisplayData.findIndex(tag => tag.TagName == 'Inv - Quantity');
        //   this.lineDisplayData.splice(index, 1)
        // }
        this.isGRNDataLoaded = true;
        // console.log(this.lineDisplayData)
        setTimeout(() => {
          // document.getElementById('grnTable').style.display = 'block';
          this.SpinnerService.hide();
        }, 2000);

      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
        this.serverError = true;
      }
    );
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

  hasPoLine(item: any): boolean {
    return Object.values(item.lines).some((line: any) => line.Value?.po_line);
  }
  readFilePath() {
    this.showInvoice = '';
    this.isPdfAvailable = true;
    // this.SpinnerService.show();
    this.SharedService.getInvoiceFilePath().subscribe(
      (data: any) => {
        this.content_type = data?.result?.content_type;
        if (data?.result?.filepath && data?.result?.content_type == 'application/pdf') {
          this.isPdfAvailable = false;
          this.isImgBoolean = false;
          this.byteArray = new Uint8Array(
            atob(data?.result?.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: 'application/pdf' })
          );
        } else if (['image/jpg', 'image/png', 'image/jpeg'].includes(data?.result?.content_type?.toLowerCase())) {
          this.isPdfAvailable = false;
          this.isImgBoolean = true;
          this.byteArray = new Uint8Array(
            atob(data.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: data.content_type })
          );
          // this.loadImage();
        } 
        // this.SpinnerService.hide();
      },
      (error) => {
        // this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  DownloadPDF() {
    let extension;
    if (this.content_type == 'application/pdf') {
      extension = '.pdf';
    } else if (this.content_type == 'image/jpg') {
      extension = '.jpg';
    } else if (this.content_type == 'image/png') {
      extension = '.png';
    }
    fileSaver.saveAs(this.showInvoice, `${this.vendorName}_${this.invoiceNumber}${extension}`);
  }

  loadImage() {
    if (this.isImgBoolean == true) {
      setTimeout(() => {
        this.zoomVal = 1;
        (<HTMLDivElement>document.getElementById('parentDiv')).style.transform =
          'scale(' + this.zoomVal + ')';

        const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        const ctx = canvas.getContext('2d');
        let image = new Image();
        image.src = this.showInvoice;
        image.onload = function () {
          // Calculate the aspect ratio of the image
          const imageAspectRatio = image.width / image.height;
          // Calculate the aspect ratio of the canvas
          const canvasAspectRatio = canvas.width / canvas.height;

          // Set the dimensions of the image to fit the canvas while maintaining the aspect ratio
          let imageWidth, imageHeight;
          if (imageAspectRatio > canvasAspectRatio) {
            // The image is wider than the canvas, so set the width of the image to the width of the canvas
            // and scale the height accordingly
            imageWidth = canvas.width;
            imageHeight = imageWidth / imageAspectRatio;
          } else {
            // The image is taller than the canvas, so set the height of the image to the height of the canvas
            // and scale the width accordingly
            imageHeight = canvas.height;
            imageWidth = imageHeight * imageAspectRatio;
          }

          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
        };


      }, 50);
    }
  }

  onChangeValue(key, value, fieldName) {
    if (key == 'InvoiceTotal' || key == 'SubTotal') {
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true;
      } else {
        this.isAmtStr = false;
      }
    }

    let updateValue = {
      "header": {}
    };
    updateValue.header[key] = value;
    this.updateInvoiceData = updateValue;
  }
  onChangeLineValue(key, value, fieldData) {
    if (key == 'Quantity' || key == 'UnitPrice' || key == 'AmountExcTax') {
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true;
      } else {
        this.isAmtStr = false;
      }
    } else if (key == 'Description') {
      if (value == '') {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    }
    let updateValue = {
      "line": [
        {
          "itemcode": 0,
          "data": {}
        }
      ]
    };
    updateValue.line[0].itemcode = fieldData?.ItemCode || fieldData?.itemCode?.Value;
    updateValue.line[0].data[key] =  value;
    this.updateInvoiceData = updateValue;
  }

  saveChanges() {
    if (!this.isAmtStr && !this.isEmpty) {
      if (this.updateInvoiceData) {
        this.SharedService.updateInvoiceDetails(this.updateInvoiceData
        ).subscribe(
          (data: any) => {
            this.success('Changes saved successfully')
            delete this.updateInvoiceData;
          },
          (err) => {
            delete this.updateInvoiceData;
            this.error("Server error or Please check the data");
          }
        );
      }
    } else {
      delete this.updateInvoiceData;
      let err = ''
      if (this.isAmtStr) {
        err = 'Alphabets not allowed in the Quantity and Amount Fields.';
      } else if (this.isEmpty) {
        err = "'Description' field cannot be empty";
      }
      this.error(err)
      // this.errorTriger('Strings are not allowed in the amount and quantity fields.');
    }
  }


  zoomin() {
    this.zoomVal = this.zoomVal + 0.2;
    this.zoomX = this.zoomX + 0.05;
    if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
      this.zoomVal = 1;
      this.zoomX = 1;
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  }

  zoomout(index) {
    this.zoomVal = this.zoomVal - 0.2;
    this.zoomX = this.zoomX - 0.05;
    if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
      this.zoomVal = 1;
      this.zoomX = 1;
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  }

  proceedToBatch(bool) {
    this.getInvoiceFulldata('batch');
    this.GRNUploadID = this.dataService.reUploadData?.grnreuploadID;
    if (this.GRNUploadID != undefined && this.GRNUploadID != null) {
      this.reuploadBoolean = true;
    } else {
      this.reuploadBoolean = false;
    }
    setTimeout(() => {
      let count = 0;
      let errorType: string;
      let errorTypeHead: string;
      let errorTypeLine: string;
      Object.keys(this.inputData).forEach(tag=>{
        if (tag == 'InvoiceTotal' || tag == 'SubTotal') {
          if (this.inputData[tag].Value == '' || isNaN(+this.inputData[tag].Value)) {
            count++;
            errorTypeHead = 'AmountHeader';
          }
        } else if (['PurchaseOrder', 'InvoiceDate', 'InvoiceId'].includes(tag)) {
          if (this.inputData[tag].Value == '') {
            count++;
            errorType = 'emptyHeader';
          }
        }
      })

      this.lineDisplayData.forEach((element) => {
        Object.keys(element.lines).forEach(tag=>{
          if (['Quantity', 'UnitPrice', 'AmountExcTax', 'Amount'].includes(tag)) {
            if (element.lines[tag]?.Value == '' ||isNaN(+element.lines[tag]?.Value)) {
              count++;
              errorTypeLine = 'AmountLine';
            }
            if (tag == 'Quantity') {
              if (element.lines[tag]?.Value == 0) {
                count++;
                errorTypeLine = 'quantity';
              }
            }
          }
        })
      });
      // const errors = {
      //   header: new Set<string>(),
      //   line: new Set<string>(),
      // };
      // const errorMessages = {
      //   InvoiceTotal: "Please review the 'Invoice Details' tab. 'Invoice Total' is empty or invalid.",
      //   SubTotal: "Please review the 'Invoice Details' tab. 'Sub Total' is empty or invalid.",
      //   PurchaseOrder: "Please review the 'Invoice Details' tab. 'Purchase Order' field is empty.",
      //   InvoiceDate: "Please review the 'Invoice Details' tab. 'Invoice Date' is empty. Please specify a valid date.",
      //   InvoiceId: "Please review the 'Invoice Details' tab. 'Invoice ID' is empty.",
      //   Quantity: "Please review the 'Line Details' tab. 'Quantity' in the Line details is empty or zero. ",
      //   UnitPrice: "Please review the 'Line Details' tab. 'Unit Price' in the Line details is empty or invalid.",
      //   AmountExcTax: "Please review the 'Line Details' tab. 'Amount Excluding Tax' in the Line details is empty or invalid.",
      //   Amount: "Please review the 'Line Details' tab. 'Amount' in the Line details is empty or invalid.",
      // };
      
      
      // // Helper function to check if a value is invalid
      // const isInvalidValue = (value: any) => value === '' || isNaN(+value);
      
      // // Validate input data
      // this.inputData.forEach((data: any) => {
      //   if (['InvoiceTotal', 'SubTotal'].includes(data.TagLabel)) {
      //     if (isInvalidValue(data.Value)) {
      //       count++;
      //       errors.header.add(data.TagLabel);
      //     }
      //   } else if (['PurchaseOrder', 'InvoiceDate', 'InvoiceId'].includes(data.TagLabel)) {
      //     if (data.Value === '') {
      //       count++;
      //       errors.header.add(data.TagLabel);
      //     }
      //   }
      // });
      
      // // Validate line display data
      // this.lineDisplayData.forEach((element) => {
      //   if (['Quantity', 'UnitPrice', 'AmountExcTax', 'Amount'].includes(element.tagname)) {
      //     element.items.forEach((item) => {
      //       item.linedetails.forEach((lineDetail) => {
      //         const value = lineDetail.invline[0]?.DocumentLineItems?.Value;
      
      //         if (isInvalidValue(value)) {
      //           count++;
      //           errors.line.add(element.tagname);
      //         }
      
      //         if (element.tagname === 'Quantity' && +value === 0) {
      //           count++;
      //           errors.line.add('Quantity');
      //         }
      //       });
      //     });
      //   }
      // });
      if (count == 0) {
        this.uploadCompleted = true;
        // this.sendToBatch();
        if (!this.isServiceData) {
          this.vendorSubmit();
        } else {
          this.serviceSubmit(bool);
        }
      } else {
        this.SpinnerService.hide();
        /* Error response starts*/
        if (errorTypeHead == 'AmountHeader') {
          setTimeout(() => {
            this.error("Please verify the 'Sub-Total' and 'Invoice-Total' on the Header")
          }, 50);
        }
        if (errorType == 'emptyHeader') {
          this.error("Please Check the PO Number, Invoice Date, and Invoice-Id fields on the header");
        }
        if (errorTypeLine == 'AmountLine') {
          setTimeout(() => {
            this.error("Please verify the Amount, Quantity, Unit price and Amount-Excluding-Tax on the Line details")
          }, 10);
        } else if (errorTypeLine == 'quantity') {
          setTimeout(() => {
            this.error("Please check the 'Quantity' in the Line details")
          }, 10);
        }
        /* Error response end*/
      }
    }, 2000);
  }

  sendToBatch() {
    this.exceptionService.send_batch_approval().subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        this.success("Sent to Batch Successfully!");
        this.syncBatch();

      },
      (error) => {
        this.error("Server error");
      }
    );
  }
  vendorSubmit() {
    this.SharedService.vendorSubmit(this.reuploadBoolean, this.uploadtime).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        if (this.router.url.includes('ExceptionManagement')) {
          this.success("Sent to Batch Successfully!")
        } else {
          if (!this.GRNUploadID) {
            this.success("Uploaded to Serina Successfully!")
          }
        }
        this.syncBatch();

      },
      (error) => {
        this.error("Server error");
      }
    );
  }
  serviceSubmit(bool) {
    // if(!this.normalCostAllocation){
    //   if(this.reqServiceprovider){
    //     this.exceptionService.submitAllocationDetails(this.rows)
    //     .subscribe((data: any) => {
    //       this.success("submitted successfully.")
    //       setTimeout(() => {
    //         this._location.back();
    //       }, 1000);
    //     }, err => {
    //       this.error("Server error");
    //     })
    //   } else {
    //     const group: { iddynamiccostallocation: string, [key: string]: string }[] = [];
    //     const groupedValues: { [key: string]: { [key: string]: string; iddynamiccostallocation: string } } = {};
    //       for (const key in this.editedValues) {
    //         const [iddynamiccostallocation, property] = key.split(',');

    //         if (!groupedValues[iddynamiccostallocation]) {
    //           groupedValues[iddynamiccostallocation] = {
    //             iddynamiccostallocation: iddynamiccostallocation,
    //           };
    //         }
    //         groupedValues[iddynamiccostallocation][property] = this.editedValues[key];
    //       }

    //       this.exceptionService.editedDynamicAllocationDetails(groupedValues)
    //       .subscribe((data: any) => {
    //         this.success("submitted successfully")
    //         setTimeout(() => {
    //           this._location.back();
    //         }, 1000);
    //       }, err => {
    //         this.error("Server error");
    //       })
    //     }
    //   }
    // else{
    this.SpinnerService.show();
    this.SharedService.serviceSubmit(`&skip_rule=${bool}`).subscribe((data: any) => {
      this.success("Sent to Batch Successfully!");
      this.dataService.serviceinvoiceLoadedData = [];
      setTimeout(() => {
        this.SpinnerService.hide();
        if (this.router.url.includes('CustomerUpload')) {
          this.router.navigate([`${this.portalName}/invoice/ServiceInvoices`]);
        } else {
          this._location.back();
        }
      }, 1000);
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
    // }
  }
  syncBatch() {
    this.SpinnerService.show();
    this.SharedService.syncBatchTrigger(`?re_upload=false`).subscribe((data: any) => {
      if(data){
        this.headerpop = 'Batch Progress'
        this.p_width = '350px';
        this.progressDailogBool = true;
        this.GRNDialogBool = false;
        this.batchData = data[this.invoiceID]?.complete_status;
        let last_msg = this.batchData[this.batchData.length - 1].msg;
        let sub_status = this.batchData[this.batchData.length - 1]?.sub_status;
        this.subStatusId = sub_status;
        this.isBatchFailed = false;
        this.batchData.forEach(el => {
          if (el.msg.includes('Tax')) {
            this.getInvoiceFulldata('');
          }
        })
        if (last_msg == 'Batch ran to an Exception!' || last_msg == 'Matching Failed - Batch Failed' && this.batch_count <= 2) {
          this.batch_count++;
          this.isBatchFailed = true;
        }
        if (!(this.batch_count <= 2)) {
          this.error("Dear User, Kindly check with Serina's support team regarding this invoice.")
          // setTimeout(() => {
          //   this.router.navigate([`${this.portalName}/ExceptionManagement`])
          // }, 2000);
        }
        this.SpinnerService.hide();
      } else {
        this.error("Issue with the batch");
        this.SpinnerService.hide();
      }
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    });
  }

  routeToMapping() {
    this.exceptionService.invoiceID = this.invoiceID;
    this.tagService.editable = true;
    this.tagService.submitBtnBoolean = true;
    this.tagService.headerName = 'Edit Invoice';
    let sub_status = null;
    let last_status = null;
    for (const el of this.batchData) {
      if (el.status == 0) {
        sub_status = el.sub_status;
      }
    };
    if (!sub_status) {
      sub_status = this.batchData[this.batchData.length - 1].sub_status;
      last_status = this.batchData[this.batchData.length - 1].status;
    }
    this.ap_enabled_exc = last_status;

    this.subStatusId = sub_status;
    this.dataService.subStatusId = sub_status;
    if (this.portalName == 'vendorPortal') {
      if ([8, 16, 18, 19, 33, 21, 27, 29].includes(sub_status)) {
        this.processAlert(sub_status);
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    } else {
      if ([8, 16, 17, 18, 19, 33, 21, 27, 29, 51, 54, 70, 75, 101, 102, 104].includes(sub_status)) {
        this.processAlert(sub_status);
      } else if (sub_status == 34) {
        this.update("Please compare the PO lines with the invoices. We generally recommend the 'PO flip' method to resolve issues of this type.")
      } else if (sub_status == 7 || sub_status == 23 || sub_status == 10 || sub_status == 35 || sub_status == 23) {
        this.router.navigate([`${this.portalName}/ExceptionManagement`]);
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    }
    this.progressDailogBool = false;
  }

  processAlert(subStatus: number): void {
    if (subStatus == 18) {
      this.update("Invoice Total and 'Sub-Total+Tax' Mismatch Identified. Kindly check Entry");
    } else if (subStatus == 19) {
      this.update("Dear User, Sub total is not matching with the invoice lines total.");
    } else if (subStatus == 29) {
      this.update("Dear User, OCR error found. please check");
    } else if (subStatus == 51) {
      this.update("Dear User, Invoice type is LCM, Please add the lines for the LCM invoice.");
      this.currentTab = 'LCM';
    } else if (subStatus == 54) {
      this.update("Dear User, Invoice type is MultiPO,Please Check the invoice total is not matching with the lines.")
      this.currentTab = 'line';
    } else if (subStatus == 70) {
      if (this.portalName == 'customer' && this.userDetails['permissioninfo'].set_approval_enabled) {
        this.readDepartment();
        this.readCategoryData();
        this.approval_selection_boolean = true;
        this.isLCMCompleted = true;
        this.update('Please add the approvers')
        this.changeTab('approver_selection')
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    } else {
      this.getInvoiceFulldata('');
      this.update("Please check the values in invoice.");
      this.getGRNtabData();
    }

  }

  financeApprove() {
    this.SpinnerService.show();
    // this.rejectModalHeader = 'Add Approval Comments';
    // this.displayrejectDialog = true;
    // Document approved by ${this.userDetails['userdetails'].firstName} \n comments: 
    let desc = this.ap_api_body();
    this.SharedService.financeApprovalPermission(desc).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.success(data.result);
        this.displayrejectDialog = false;
        this.closeDialog();
        setTimeout(() => {
          this.SpinnerService.hide();
          this._location.back();
        }, 1000);
      },
      (error) => {
        this.error(error.statusText);
        this.SpinnerService.hide();
        this.displayrejectDialog = false;
      }
    );
  }
  backToInvoice() {
    if (
      !this.router.url.includes('vendorUpload') ||
      !this.router.url.includes('CustomerUpload')
    ) {
      this._location.back();
    } else if (
      this.router.url.includes('vendorUpload') &&
      this.router.url.includes('CustomerUpload') &&
      this.submitBtn_boolean == true
    ) {
      if (
        confirm(
          ` Are you sure you want cancel process ? \n if you click OK you will lost your invoice meta data.`
        )
      ) {
        this._location.back();
      }
    } else {
      this._location.back();
    }
  }
  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.innerHeight = window.innerHeight;
  //   if (this.innerHeight > 550 && this.innerHeight < 649) {
  //     this.InvoiceHeight = 500;
  //   } else if (this.innerHeight > 650 && this.innerHeight < 700) {
  //     this.InvoiceHeight = 560;
  //   } else if (this.innerHeight > 750) {
  //     this.InvoiceHeight = 660;
  //   }
  // }
  zoomIn() {
    this.zoomdata = this.zoomdata + 0.1;
  }
  zoomOut() {
    this.zoomdata = this.zoomdata - 0.1;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }
  textLayerRendered(e: CustomEvent) { }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
  selectedText(): void { }

  // search(stringToSearch: string) {
  //   this.pdfViewer.pdfFindController.executeCommand('find', {
  //     caseSensitive: false,
  //     findPrevious: undefined,
  //     highlightAll: true,
  //     phraseSearch: true,
  //     query: stringToSearch,
  //   });
  // }
  // hightlight(val) {
  //   var pageno = parseInt('1');
  //   var pageView = this.pdfViewer.pdfViewer._pages[pageno - 1];
  //   //datas - array returning from server contains synctex output values
  //   var left = parseInt('530px');
  //   var top = parseInt('660px');
  //   var width = parseInt('50px');
  //   var height = parseInt('20px');
  //   //recalculating top value
  //   top = pageView.viewport.viewBox[3] - top;
  //   var valueArray = [left, top, left + width, top + height];
  //   let rect = pageView.viewport.convertToViewportRectangle(valueArray);
  //   // rect       = PDFJS.disableTextLayer.normalizeRect(rect);
  //   var x = Math.min(rect[0], rect[2]),
  //     width = Math.abs(rect[0] - rect[2]);
  //   var y = Math.min(rect[1], rect[3]),
  //     height = Math.abs(rect[1] - rect[3]);
  //   const element = document.createElement('div');
  //   element.setAttribute('class', 'overlay-div-synctex');
  //   element.style.left = x + 'px';
  //   element.style.top = y + 'px';
  //   element.style.width = width + 'px';
  //   element.style.height = height + 'px';
  //   element.style.position = 'absolute';
  //   element.style.backgroundColor = 'rgba(200,0,0,0.5)';
  //   $('*[data-page-number="' + pageno + '"]').append(element);
  //   this.pdfviewer.pdfViewer._scrollIntoView({
  //     pageDiv: pageView.div,
  //   });
  // }

  // onClick(e) {
  //   const textLayer = document.getElementsByClassName('TextLayer');
  //   const x =
  //     window.getSelection().getRangeAt(0).getClientRects()[0].left -
  //     textLayer[0].getBoundingClientRect().left;
  //   const y =
  //     window.getSelection().getRangeAt(0).getClientRects()[0].top -
  //     textLayer[0].getBoundingClientRect().top;
  // }

  viewPdf() {
    this.showPdf = !this.showPdf;
    if (this.showPdf != true) {
      this.btnText = 'View invoice';
    } else {
      this.btnText = 'Close';
    }
    if (this.isImgBoolean == true) {
      this.loadImage();
    }
  }
  rotate(angle: number) {
    this.rotation += angle;
  }

  filterPO(event) {
    this.filteredPO = this.dataService.uni_filter(this.poList,'PODocumentID',event);
  }

  onSelectPO(value) {
    if (confirm(`Are you sure you want to change PO Number?`)) {
      this.exceptionService.updatePONumber(value.PODocumentID).subscribe(
        (data: any) => {
          this.success("PO Number updated successfully")
          this.getInvoiceFulldata('');
        },
        (error) => {
          this.error("Server error");
        }
      );
    }
  }

  readLineItems() {
    this.exceptionService.readLineItems().subscribe((data: any) => {
      this.lineItems = data.description;
      data?.description?.forEach(el=>{
        if(el.itemCode && el.Name){
          el.Value = `${el.itemCode}-${el.Name}-${el.UnitPrice}-${el.SHIP_TO_ORG}-${el.Qty}`
        }
      })
    });
  }
  filterPOLine(event) {
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < this.lineItems.length; i++) {
    //   let item = this.lineItems[i];
    //   if (
    //     item.Value.toLowerCase().includes(query.toLowerCase())
    //   ) {
    //     filtered.push(item);
    //   }
    // }
    this.filteredPOLine = this.dataService.uni_filter(this.lineItems,'Value',event);
  }
  readErrorTypes() {
    this.exceptionService.readErrorTypes().subscribe((data: any) => {
      this.givenErrors = data.description;
    });
  }

  lineMapping(inv_code, po_code) {
    this.updateLine(inv_code,po_code);
  }

  cancelSelectErrorRule() {
    this.displayErrorDialog = false;
  }

  updateLine(inv_code,po_code) {
    this.exceptionService
      .updateLineItems(inv_code,po_code,1,this.vendorAcId)
      .subscribe(
        (data: any) => {
          this.displayErrorDialog = false;
          this.success("Line item updated successfully");
          this.getInvoiceFulldata('');
          this.readMappingData();
        },
        (error) => {
          this.error("Server error");
          this.displayErrorDialog = false;
        }
      );
  }

  readMappingData() {
    this.exceptionService.readMappedData().subscribe((data: any) => {
      this.mappedData = data?.description;
    });
  }
  selectReason(reasn) {
    if (reasn == 'Others') {
      this.addrejectcmtBool = true;
    } else {
      this.addrejectcmtBool = false;
    }
  }

  rejectKepup(val) {
    this.rejectionComments = val;
  }

  Reject() {
    if (!this.router.url.includes('GRN_approvals')) {
      let rejectionData = {
        documentdescription: this.rejectionComments,
        userAmount: 0,
      };
      this.uploadCompleted = true;
      this.SpinnerService.show();
      if (this.fin_boolean && this.rejectionUserId != 0) {
        this.exceptionService.rejectApprove(rejectionData, this.rejectionUserId).subscribe((data: any) => {
          this.dataService.invoiceLoadedData = [];
          this.success(data.result);
          this.displayrejectDialog = false;
          setTimeout(() => {
            this.SpinnerService.hide();
            this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          }, 1000);
        }, err => {
          this.error("Server error");
          this.SpinnerService.hide();
        })
      } else {
        this.SharedService.vendorRejectInvoice(rejectionData
        ).subscribe(
          (data: any) => {
            this.dataService.invoiceLoadedData = [];
            this.success("Rejection Notification sent to Vendor")
            this.displayrejectDialog = false;
            setTimeout(() => {
              this.SpinnerService.hide();
              this.router.navigate([`${this.portalName}/ExceptionManagement`]);
            }, 1000);
          },
          (error) => {
            this.error("Server error");
            this.SpinnerService.hide();
          }
        );
      }

    } else {
      this.SharedService.rejectGRN().subscribe((data: any) => {
        if (data?.status == 'success') {
          this.success(data.message)
        } else {
          this.error(data.message);
        }
        this.displayrejectDialog = false;
        setTimeout(() => {
          this.router.navigate([`${this.portalName}/GRN_approvals`]);
        }, 1000);
      })
    }
  }

  getApprovedUserList() {
    this.userList_approved = [];
    this.SpinnerService.show();
    this.exceptionService.getApprovedUsers().subscribe((data: any) => {

      if (typeof (data?.result) != "string") {
        data?.result?.forEach(el => {
          this.userList_approved.push(el);
        });
      } else {
        this.userList_approved.push({ firstName: "Vendor", idUser: 0, lastName: "" });

      }
      this.SpinnerService.hide();
    })
  }
  selectUserForReject(event) {
    this.rejectionUserId = event;
  }
  onChangeGrn(fieldName, val,linedata) {
    // const po_qty_value = this.po_qty_array?.linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems)?.Value;
    // const po_balance_qty_value = this.po_balance_qty_array?.linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems)?.Value;
    const po_qty_value = linedata?.PurchQty?.Value;
    const po_balance_qty_value = linedata?.RemainPurchPhysical?.Value;

    let checking_value;
    let error_msg;
    if(po_balance_qty_value){
      checking_value = po_balance_qty_value;
      error_msg = 'PO Balance Quantity';
    } else {
      checking_value = po_qty_value;
      error_msg = 'PO Quantity';
    }
    this.disable_save_btn = false;
    if(Number(checking_value) < Number(val)){

      // this.dataService.added_manpower_data.forEach(el=>{
      //   if(el.idDocumentLineItems == lineItem.idDocumentLineItems){
      //     el.Value = lineItem.old_value;
      //   }
      // })
      // this.lineDisplayData.find(data => data.TagName == 'GRN - Quantity').linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems).Value = lineItem.old_value;
      this.error(`GRN Quantity cannot be greater than ${error_msg}`);
      this.grnTooltip = `GRN Quantity cannot be greater than ${error_msg}`;
      this.disable_save_btn = true;
      return;
    }
    if (this.GRN_PO_Bool) {
      this.updateAmountExcTax(fieldName, val, linedata);
    } else {
      // this.onChangeLineValue('Quantity', val, linedata);
      this.updateAmountExcTax(fieldName, val, linedata);
      this.update("Please add comments as well")
    }
  }
  onChangeGrnAmount(lineItem, val) {
    // const grnUnitPrice = this.lineDisplayData.find(item => item.TagName == 'UnitPrice')
    // .linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems);
    const grnQty = (Number(val) / Number(lineItem?.UnitPrice?.Value)).toFixed(this.decimal_count);
    const po_balance_qty_value = lineItem?.RemainPurchPhysical?.Value;

    let checking_value;
    let error_msg;
    if(po_balance_qty_value){
      checking_value = po_balance_qty_value;
      error_msg = 'PO Balance Quantity';
    } 
    this.disable_save_btn = false;
    if(Number(checking_value) < Number(grnQty)){
      // this
      // this.lineDisplayData.find(data => data.TagName == 'GRN - Quantity').linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems).Value = lineItem.old_value;
      this.error(`GRN Quantity cannot be greater than ${error_msg}`);
      this.grnTooltip = `GRN Quantity cannot be greater than ${error_msg}`;
      this.disable_save_btn = true;
      return;
    }

    // const grnQuantityItem = this.lineDisplayData.find(item => item.TagName == 'GRN - Quantity')
    //   .linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems);
    
    // if (grnQuantityItem) {
    //   grnQuantityItem.Value = grnQty;
    //   grnQuantityItem.ErrorDesc = "Quantity changed";
    // }
    this.GRN_line_total = 0;
    this.lineDisplayData.forEach(ele => {
      Object.keys(ele).forEach((label:any)=> {
        if (label === 'GRNAmountExcTax') {
            if(ele?.LineNumber?.Value == lineItem.LineNumber?.Value){
              ele[label].Value = val;
            }
            this.GRN_line_total = this.GRN_line_total + Number(ele[label].Value);
        } else if(label === 'GRNQty'){
          if(ele?.LineNumber?.Value == lineItem.LineNumber?.Value){
            ele[label].Value = grnQty;
            ele[label].ErrorDesc = "Quantity changed";
          }
        }
      })
    })
  }
  updateAmountExcTax(fieldName, newQuantity: number, linedata) {
    if (fieldName) {
      const unitPrice = linedata.GRNUnitPrice || linedata.UnitPrice;
      const amountExcTax = (Number(unitPrice.Value) * newQuantity).toFixed(2);
      // const amountExcTaxItem = this.lineDisplayData.find(item => item.TagName == TagName_a)
      //   .linedata.find(data => data[field] === lineItem[field]);

      // if (amountExcTaxItem) {
      //   amountExcTaxItem.Value = amountExcTax;
      //   amountExcTaxItem.ErrorDesc = "Quantity changed";
      // }
      this.GRN_line_total = 0;
      // this.lineDisplayData.forEach(ele => {

      //   if (ele.TagName == TagName_a) {
      //     ele.linedata.forEach(v => this.GRN_line_total = this.GRN_line_total + Number(v.Value))
      //   }
      // })
      this.lineDisplayData.forEach(item=>{
        Object.keys(item).forEach(label=>{
          if(label === 'GRNAmountExcTax'){
            this.GRN_line_total = this.GRN_line_total + Number(item[label].Value);
          }
          if(linedata?.LineNumber?.Value == item?.LineNumber?.Value){
            
            item['GRNAmountExcTax'].Value = amountExcTax;
          }
        })
      })
    }
  }

  deleteGrnLine(id) {
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to delete this line?', 'confirmation', 'Confirmation')
    drf.afterClosed().subscribe((bool:boolean) => {
      if (bool) {
        this.SpinnerService.show();
        this.lineDisplayData = this.lineDisplayData.filter(record => {
          return record?.LineNumber?.Value !== id?.LineNumber?.Value;
        });
        this.GRN_line_total = 0;
        this.lineDisplayData.forEach(ele => {
          Object.keys(ele).forEach(label=>{
            if(label === 'GRNAmountExcTax'){
              this.GRN_line_total = this.GRN_line_total + Number(ele[label].Value);
            }
          })
        })
        // this.GRNObject = this.GRNObject.filter(val => {
        //   return val?.idDocumentLineItems != id
        // })
        // this.grnLineCount = this.lineDisplayData[0]?.linedata;
        this.SpinnerService.hide();
      }
    })
  }
  confirmFun(body, type, head) {
    return this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: body, type: type, heading: head, icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })
  }
  bulk_confirm() {
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('We found more invoices for the same batch, do you want to approve all the invoices for the batch?', 'confirmation', 'Confirmation')
    drf.afterClosed().subscribe((bool) => {
      const dialog = document.querySelector('dialog');
      if (dialog) {
        dialog.showModal();
        this.bulk_bool = bool;
        if (bool) {
          document.getElementById("cmt").style.display = "block";
        } else {
          document.getElementById("cmt").style.display = "none";
        }
      }

    })

  }
  closeDialog() {
    const dialog = document.querySelector('dialog');
    if (dialog) {
      dialog.close();
    }
  }
  delete_confirmation(id) {
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to delete this line?', 'confirmation', 'Confirmation')

    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        this.removeLine(id)
      }
    })
  }

  confirm_pop(grnQ, boolean, txt) {
    this.isDraft = false ;
    if(txt.includes('saved')){
      this.isDraft = true ;
    }
    // const GRNQtyArr = this.lineDisplayData.find(item=> item.GRNQty === 'GRN - Quantity');
    let label = 'GRNQuantity';
    if(this.GRN_PO_Bool){
      label = 'GRNQty'
    }
    let validationBool = this.lineDisplayData?.some(el=> el[label]?.Value == '' ||  el[label]?.Value == undefined);
    if (validationBool && !this.isDraft) {
      this.error('Please add a valid GRN Quantity');
      return;
    }
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Kindly confirm the number of GRN lines.', 'confirmation', 'Confirmation')
    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        if (this.isManpowerTags && this.manPowerAPI_request) {
          this.createTimesheetAPI();
        }
        this.onSave_submit(grnQ, boolean, txt);
      }
    })
  }

  onSave_submit(grnQ, boolean, txt) {
    if (this.descrptonBool) {
      this.GRNObjectDuplicate = this.GRNObject;
      if (this.GRN_PO_Bool || this.router.url.includes("GRN_approvals")) {
        this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
        this.GRNObjectDuplicate.forEach((val, i) => {
          if (val.is_mapped == 'Price' && grnQ[val?.idDocumentLineItems] != 0) {
            let obj = {
              Value: grnQ[val?.idDocumentLineItems] * val?.Value, ErrorDesc: '', idDocumentLineItems: val?.idDocumentLineItems, is_mapped: '', tagName: 'AmountExcTax'
            }
            this.GRNObjectDuplicate.splice(this.GRNObjectDuplicate.length + 1, 0, obj)
          }

        })
        // this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter((val, ind, arr) => ind == arr.findIndex(v => v.idDocumentLineItems == val.idDocumentLineItems && v.tagName == val.tagName));

      } else {
        if(!this.GRN_PO_Bool){
          this.validateInvPOUnitPrice();
        }
      }
      let emptyBoolean: boolean = false;
      let commentBoolean = false;
      let errorMsg: string;
      this.GRNObjectDuplicate.forEach((ele, ind) => {
        if (ele.Value === '') {
          emptyBoolean = true;
          errorMsg = 'Please fill in all the given fields.';
        } else if (ele.Value != ele.old_value && !this.GRN_PO_Bool) {
          if (
            ele.ErrorDesc == null ||
            ele.ErrorDesc == '' ||
            ele.ErrorDesc == 'None' ||
            ele.ErrorDesc == 'none'
          ) {
            commentBoolean = true;
            errorMsg =
              'Kindly add Comments for lines that are Adjusted.';
          }
        } else if (ele.Value == 0) {
          if (this.GRN_PO_Bool) {
            if (ele.tagName == 'Quantity') {
              this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val?.idDocumentLineItems != ele?.idDocumentLineItems);
            }
            // this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val=> val.tagName != 'AmountExcTax');
          } else {
            commentBoolean = true;
            errorMsg =
              'Field Value cannot be Null!';
          }

        }
      });
      if (emptyBoolean == false && commentBoolean == false) {

        if (
          boolean == true
        ) {
          if (this.GRN_PO_Bool) {
            if(this.configData?.miscellaneous?.grn_match_with_invoice_no){
              if (this.invoiceNumber) {
                this.grnDuplicateCheck(boolean);
                } else {
                  // if(this.invoiceNumber){
                  //   this.error("Dear user, please add the invoice description.");
                  // } else {
                    this.error("Dear user, please add the invoice number.");
                  // }
                }
            } else {
              this.grnDuplicateCheck(boolean);
            }
          } else {
            setTimeout(() => {
              if (this.router.url.includes('GRN_approvals')) {
                this.grnDuplicateCheck(boolean);
              } else {
                this.CreateGRNAPI(boolean, txt);
              }
            }, 1000);
          }
        } else {
          if (!this.GRN_PO_Bool) {
            setTimeout(() => {
              this.CreateGRNAPI(false, 'GRN data saved successfully');
            }, 1000);
          } else {
            this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
          }
        }
      } else {
        this.error(errorMsg);
      }
    } else {
      this.error("Description Unavailable. Kindly Contact the Technical Team.");
    }
  }

  createGRNWithPO(bool,payLoad) {
    // bool = bool ? 'false' : 'true';
    this.SpinnerService.show();
    let inv_param = '';
    if (this.invoiceNumber) {
      const encodedInvoiceNumber = encodeURIComponent(this.invoiceNumber);
      inv_param += `&inv_num=${encodedInvoiceNumber}`;
    }
    if (this.invoiceDescription) {
      inv_param += `&inv_desc=${encodeURIComponent(this.invoiceDescription)}`;
    }
    let manPower = '';
    if (this.manpowerHeaderId && this.dataService.isEditGRN) {
      manPower = `&ManPowerHeaderId=${this.manpowerHeaderId}&isdraft=${this.isDraft}&grn_doc_id=${this.invoiceID}`;
    } else if(this.manpowerHeaderId && !this.dataService.isEditGRN){
      manPower = `&ManPowerHeaderId=${this.manpowerHeaderId}&isdraft=${this.isDraft}`;
    } else if(!this.manpowerHeaderId && this.dataService.isEditGRN){
      manPower = `&isdraft=${this.isDraft}&grn_doc_id=${this.invoiceID}`;
    } else if(!this.manpowerHeaderId && this.isDraft){
      manPower = `&isdraft=${this.isDraft}`;
    }
    if(this.isManpowerTags && !this.manpowerHeaderId && this.manPowerAPI_request){
      this.SpinnerService.hide();
      return;
    }
    this.SharedService.createGRNWithPO(inv_param, manPower,payLoad).subscribe((data: any) => {
      this.SpinnerService.hide();
      if (data.status == 'Posted') {
        this.success(data.message);
        setTimeout(() => {
          this.router.navigate(['/customer/Create_GRN_inv_list']);
        }, 2000);
      }  else if(data.status == 'Draft') {
        this.update(data.message);
        setTimeout(() => {
          this.router.navigate(['/customer/Create_GRN_inv_list']);
        }, 2000);
      } else {
        this.progressDailogBool = true;
        this.p_width = '350px';
        this.headerpop = 'GRN Creation Status';
        this.APIResponse = data.message;
      }
      if(data.grn_doc_id && this.uploadFileList.length >0){
        this.uploadSupport(data.grn_doc_id);
      }

    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })

  }

  grnDuplicateCheck(boolean) {
    if (this.lineDisplayData.length > 0) {
    this.SpinnerService.show();
      let arr = [];
      let grnWithPOPayload = [];
      this.lineDisplayData.forEach((objV) => {
        Object.keys(objV).forEach(ele=>{
            if (this.router.url.includes("GRN_approvals")) {
              if (ele == 'Quantity') {
                let obj = {
                  line_id: objV?.ItemCode,
                  quantity: objV[ele]?.Value,
                }
                arr.push(obj)
              }
            } else {

              if (ele == 'GRNQty') {
                let obj = {
                  line_id: objV?.LineNumber?.Value,
                  quantity: objV[ele]?.Value,
                }
                arr.push(obj)
              }
            }
        })
        let objData = {
          itemCode : objV?.LineNumber?.Value,
          lineData: {
            'Quantity' : { Value : objV?.GRNQty?.Value },
            'UnitPrice' : { Value: objV?.UnitPrice?.Value}
          }
        }
        grnWithPOPayload.push(objData)

      })
      // const uniqarr = arr.filter((val,ind,arr)=> ind == arr.findIndex(v=>v.line_id == val.line_id && v.quantity == val.quantity));
      let duplicateAPI_response: string;
      let extra_param = '';
      if (this.router.url.includes('GRN_approvals')) {
        extra_param = `&grn_id=${this.invoiceID}`
      }
      this.SharedService.duplicateGRNCheck(arr, extra_param).subscribe((data: any) => {
        duplicateAPI_response = data.result;
        this.SharedService.checkGRN_PO_balance(false).subscribe((data: any) => {
          let negativeData = [];
          let negKey = {};
          let bool: boolean;
          for (let key in data?.result) {
            let valuee = data.result[key];
            this.GRNObjectDuplicate.forEach((ele) => {
              if (ele.tagName == 'Quantity' && ele.idDocumentLineItems == key && (+valuee < +ele.Value)) {
                negKey[key] = valuee;
                negativeData.push(valuee);
              }
            })
          }
          if (negativeData.length <= 0) {
            if (duplicateAPI_response == 'successful') {
              if (this.router.url.includes("GRN_approvals")) {
                this.Approve_grn();
              } else {
                this.createGRNWithPO(boolean,grnWithPOPayload);
              }

            } else {
              this.AlertService.errorObject.detail = duplicateAPI_response;
              this.error(duplicateAPI_response);
            }
          } else {
            let str: string = JSON.stringify(negKey);
            this.error(`Please check available quantity in the line numbers (${str})`);
          }
        }, err => {
          this.error('Server error')
        })
      }, err => {
        this.error('Server error')
      })
      this.SpinnerService.hide();
    } else {
      alert('There are no lines to create GRN, if you are able to see the lines then please check the quantity');
      this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
    }
  }
  CreateGRNAPI(boolean, txt) {
    // if (this.client_name !== 'SRG' || this.invoiceDescription) {
      if (this.validateUnitpriceBool && !confirm("Invoice 'unit-price' is not matching with PO. Do you want to proceed?")) {
        return;
      }
      this.grnAPICall(boolean, txt);
    // } else {
    //   this.error('Please add the invoice description');
    // }
      
  }

  grnAPICall(boolean, txt) {
    let inv_des = '';
    if(this.invoiceDescription !== ''){
      inv_des = `&document_description=${this.invoiceDescription}`;
    }
    // let arr = [];
    let grnWithInvPayload = [];
    this.lineDisplayData.forEach((objV) => {
      // Object.keys(objV).forEach(ele=>{
      //     if (this.router.url.includes("GRN_approvals")) {
      //       if (ele == 'GRNQuantity') {
      //         let obj = {
      //           line_id: objV?.invoice_itemcode?.Value,
      //           quantity: objV[ele]?.Value,
      //         }
      //         arr.push(obj)
      //       }
      //     } else {

      //       if (ele == 'GRNQuantity') {
      //         let obj = {
      //           line_id: objV?.LineNumber?.Value,
      //           quantity: objV[ele]?.Value,
      //         }
      //         arr.push(obj)
      //       }
      //     }
      // })
      let objData = {
        itemCode : objV?.LineNumber?.Value,
        lineData: {
          'Quantity' : { Value : objV?.GRNQuantity?.Value },
          'UnitPrice' : { Value: objV?.GRNUnitPrice?.Value}
        }
      }
      grnWithInvPayload.push(objData)

    })
    this.SpinnerService.show();
    this.SharedService.saveGRNData(
      boolean, grnWithInvPayload,inv_des
    ).subscribe(
      (data: any) => {
        this.SpinnerService.hide();
        if (data.status == 'Posted') {
          this.success(data.message);
          setTimeout(() => {
            this.router.navigate(['/customer/Create_GRN_inv_list']);
          }, 2000);
        } else if(data.status == 'Draft') {
          this.update(data.message);
          setTimeout(() => {
            this.router.navigate(['/customer/Create_GRN_inv_list']);
          }, 2000);
        } else {
          this.progressDailogBool = true;
          this.p_width = '350px';
          this.headerpop = 'GRN Creation Status';
          this.APIResponse = data.message;
        }

      },
      (error) => {
        this.SpinnerService.hide();
        if (error.status == 403) {
          this.progressDailogBool = true;
          this.headerpop = 'GRN Creation Status';
          this.APIResponse = error.error.Error;
          this.error("Invoice quantity beyond threshold");
        } else {
          this.error("Server error");
        }
      }
    );
  }

  validateInvPOUnitPrice() {
    let arr = []
    this.lineDisplayData.forEach(el=>{
      arr.push({"invoice_itemcode": el.ItemCode});
    })
    this.SharedService.validateUnitprice(arr).subscribe((data: any) => {
      if (data.result.length > 0) {
        this.validateUnitpriceBool = true;
      } else {
        this.validateUnitpriceBool = false;
      }
    })
  }

  async open_dialog_comp(str) {
    // let rejObj = {
    //   sendor: '',
    //   rejectTxt: this.rejectionComments
    // }
    let w = '70%';
    let h = '92vh';
    let response;
    if (str == 'Amend') {
      this.displayrejectDialog = false;
      w = '40%';
      h = '40vh';
    } else if (str == 'flip line') {
      try {
        // let query = `/${this.invoiceID}`;
        const data: any = await this.exceptionService.getPOLines('').toPromise();
        response = { podata: data.Po_line_details, sub_total: this.invoice_subTotal };
      } catch (error) {
        console.error('Error fetching PO lines:', error);
        return;
      }
    } else if (str == 'manpower') {
      w = '80%';
      h = '82vh';
      response = { "grnData_po": this.lineDisplayData }
    } else if (str == 'manpower_metadata') {
      w = '60%';
      h = '65vh';
      response = { "manpower_metadata": this.manpower_metadata }
    }
    this.SpinnerService.show();
    const matdrf: MatDialogRef<PopupComponent> = this.mat_dlg.open(PopupComponent, {
      width: w,
      height: h,
      hasBackdrop: false,
      data: { type: str, resp: response, rejectTxt: this.rejectionComments }
    });
    this.SpinnerService.hide();
    if (str == 'Amend') {
      matdrf.afterClosed().subscribe((resp: any) => {
        this.rejectionComments = resp;
        if (resp) {
          this.Reject();
        }
      })
    } else if (str == 'manpower_metadata') {
      this.SpinnerService.show();
      matdrf.afterClosed().subscribe((resp: any) => {
        if(resp) {
          this.manpower_metadata = resp;
          this.createTimeSheetDisplayData("new");
        }
        this.SpinnerService.hide();
      })
    } else if (str == 'manpower') {
      this.SpinnerService.show();
      matdrf.afterClosed().subscribe((resp: any) => {
        if (resp) {
          this.manPowerAPI_request = {
            "startdate": resp?.dates?.startdate,
            "enddate": resp?.dates?.enddate,
            "data": []
          }
          if(this.dataService.isEditGRN){
            this.manPowerAPI_request.grnDocumentId = this.invoiceID;
          }
          const response = this.prepare_manpower_payload(resp.data);
          this.manPowerAPI_request.data = response;
          this.manPowerGRNData = resp.data;
          
          // Replacing the GRN Qty with timesheet qty
          this.lineDisplayData = this.lineDisplayData.map(el => {
            for(const tag in el){
              if(tag == 'GRNQty'){
                this.manPowerGRNData.forEach(x=>{
                  if(x.LineNumber.Value == el.LineNumber.Value){
                    this.onChangeGrn('GRNQty', x.GRNQty.Value, x);
                    el.GRNQty.Value = x.GRNQty.Value;
                  }
                })
              }
            }
            return el;
          })
          this.SpinnerService.hide();
        }
        this.SpinnerService.hide();
      })
    }
  }

  prepare_manpower_payload(inputData){
    this.saveDisabled = false;
    let shiftData = [];
    inputData.forEach(el=>{
      let quantity = [];
      for(const tag in el){
        if(!['GRNAmountExcTax','GRNQty','LineNumber','Name','PurchId','PurchQty','RemainPurchPhysical','UnitPrice','durationMonth','isTimesheets','monthlyQuantity','shiftName','shifts'].includes(tag)){
          if(el[tag].Value){
            quantity.push({date:tag, quantity: el[tag].Value})
          } else {
            this.saveDisabled = true;
          }
        }
      }
      shiftData.push({
        itemCode: el.LineNumber.Value,
        shift: el.shiftName.Value,
        quantity: JSON.stringify(quantity),
        durationmonth: el.durationMonth.Value
      });
    })
    return shiftData
  }

  createTimeSheetDisplayData(str) {
    this.dataService.GRN_PO_Data.forEach(ele => {
      this.manpower_metadata.forEach(meta => {
        if (ele.LineNumber == meta.itemCode) {
          ele.durationMonth = meta.durationMonth || "NA";
          ele.isTimesheets = str == "new" ? meta.isTimesheets : true;
          ele.shifts = meta.shifts || "NA";
          let monthlyQuantity = 0;
          if (ele.durationMonth) {
              monthlyQuantity = ele.PurchQty / ele.durationMonth;
            }
          ele.monthlyQuantity = monthlyQuantity.toFixed(2)
          if(ele.isTimesheets){
            this.isManpower = true;
          }
        }
      })
    })
    this.isManpowerTags = true;
    this.create_GRN_PO_tags();
    if (str == 'new') {
      this.get_PO_GRN_Lines();
    }
    this.SpinnerService.hide();
  }
  createTimesheetAPI() {
    
    this.exceptionService.createTimesheet(this.SharedService.po_doc_id,this.manPowerAPI_request, 'PO').subscribe((data: any) => {
      if (data.status.toLowerCase() == 'success') {
        this.success(data.message);
        this.manpowerHeaderId = data.ManPowerHeaderId;
      } else {
        this.error(data.message);
      }
      // this.success(data.message);
    },err=>{
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }
  create_GRN_PO_tags() {
    this.lineTable.splice(7, 0, { header: 'Duration in months', field: 'durationMonth' }, { header: 'Monthly quantity', field: 'monthlyQuantity' }, { header: 'Is Timesheets', field: 'isTimesheets' }, { header: 'Number of Shifts', field: 'shifts' })
  }
  open_dialog(str) {
    if (str == 'reject') {
      this.rejectModalHeader = 'ADD Rejection Comments';
      // this.getApprovedUserList();
    } else if (str == 'approve') {
      this.rejectModalHeader = 'Add Pre-approval Comments';
      if (this.preApproveBoolean == false) {
        this.rejectModalHeader = 'Please Add Comments';
        this.isRejectCommentBoolean = false;
        this.isApproveCommentBoolean = true;
        this.isLCMSubmitBoolean = false;
      }
    } else if (str == 'more') {
      this.rejectModalHeader = 'Please Add Comments';
      this.moreInfoBool = true;
    } else {
      this.rejectModalHeader = "Check Item Code Availability";
    }
    this.displayrejectDialog = true;

  }
  addComments(val) {
    this.rejectionComments = val;
    if (this.rejectionComments.length > 1) {
      this.commentsBool = false;
    } else {
      this.commentsBool = true;
    }
  }
  removeLine(itemCode) {
    this.exceptionService.removeLineData(itemCode).subscribe((data: any) => {
      if (data.status == "deleted") {
        this.success("Line item deleted")

        this.displayrejectDialog = false;
        this.getInvoiceFulldata('');
      }
    }, err => {
      this.error("Server error");
      this.displayrejectDialog = false;
    })
  };

  CheckItemStatus(item) {
    // this.exceptionService.checkItemCode(item).subscribe((data: any) => {
    //   if (data.status == "not exists") {
        let addLineData = {
          "documentID": this.invoiceID,
          "itemCode": item
        };
        this.exceptionService.addLineItem(addLineData).subscribe((data: any) => {
          if (data.status == "added"){
            this.success("Line item Added")
            this.getInvoiceFulldata('');
          } else {
            this.error(data.message)
          }

        });
        this.displayrejectDialog = false;
      // } else {
      //   this.error("Item code already exists, Please try with another item code.");
      // }
    // }, err => {
    //   this.error("Server error");
    //   this.displayrejectDialog = false;
    // })
  }
  // getPO_lines(str) {
  //   this.exceptionService.getPOLines().subscribe((data: any) => {
  //     this.poLineData = data.Po_line_details;
  //     this.SpinnerService.hide();
  //   }, err => {
  //     this.AlertService.errorObject.detail = "Server error";
  //     this.messageService.add(this.AlertService.errorObject);
  //     this.SpinnerService.hide();
  //   })
  // }

  getGRNnumbers(po_num) {
    this.SharedService.checkGRN_PO_duplicates(po_num).subscribe((data: any) => {
      this.grnList = data?.result;
      this.filterGRNlist = this.grnList;
    })
  }
  ChangeGRNData() {
    if (this.selectedGRNList.length > 0) {
      this.progressDailogBool = false;
      this.SharedService.updateGRNnumber(this.selectedGRNList).subscribe(data => {
        this.getGRNtabData();
        this.success("GRN Data Updated. Kindly click 'Next' button to send the invoice to the batch");
        if(this.router.url.includes('Inv_vs_GRN_details')){
          this.syncBatch();
        }

      }, err => {
        this.error("Server error");
      })
    }
  }

  getGRNtabData() {
    this.SharedService.getGRNTabData().subscribe((data: any) => {
      this.GRNTabData = data?.result;
      this.grnTabDatalength = Object.keys(this.GRNTabData).length;
    })
  }

  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }

  opengrnDailog() {
    this.GRNDialogBool = true;
    this.progressDailogBool = true;
    this.headerpop = 'Select GRN';
    this.p_width = '70vw';
  }

  getPODocId(po_num) {
    this.SharedService.get_poDoc_id(po_num).subscribe((data: any) => {
      this.poDocId = data.result;
      this.SharedService.po_doc_id = data.result;
    })
  }
  selectedGRN(event, grn_num) {
    delete this.updateInvoiceData;
    let bool: boolean = event.target.checked;
    this.readGRNLines(grn_num, bool);
  }
  readGRNLines(grn_num, bool) {
    this.SpinnerService.show();
    this.SharedService.getGRN_Lines(grn_num).subscribe((data: any) => {
      this.PO_GRN_Number_line = data.result;
      this.SpinnerService.hide();
      if (bool) {
        let data = [...this.PO_GRN_Number_line]
        this.selectedGRNList.push(grn_num);
        this.selectedGRNLines.push({ grnNumber: grn_num, linesData: data });
      } else {
        if (this.selectedGRNList.length > 0) {
          this.selectedGRNList = this.selectedGRNList.filter(grn => grn != grn_num);
          this.selectedGRNLines = this.selectedGRNLines.filter(grn => grn.grnNumber != grn_num);
        }
      }
      let total_arr = []
      this.selectedGRNLines.forEach(el => {
        total_arr.push(el.linesData)
      })
      this.selected_GRN_total = total_arr.reduce((acc, arr) => {
        return acc + arr.reduce((subAcc, obj) => subAcc + parseFloat(obj.AmountExcTax), 0);
      }, 0);
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }
  // readPOLines() {
  //   this.exceptionService.getPOLines('').subscribe((data: any) => {
  //     this.poLineData = data.Po_line_details;
  //   }, err => {
  //     this.alertFun('Server error');
  //     this.SpinnerService.hide();
  //   })
  // }
  // refreshPO() {
  //   this.SpinnerService.show();
  //   this.SharedService.updatePO(this.poDocId).subscribe((data: any) => {
  //     this.readPOLines();
  //     this.SpinnerService.hide();
  //     this.successAlert('PO data updated.');
  //   }, err => {
  //     this.SpinnerService.hide();
  //     this.alertFun('Server error');
  //   })
  // }
  getPO_numbers(idVen) {
    this.SpinnerService.show();
    this.SharedService.getPo_numbers(idVen).subscribe((data: any) => {
      this.poNumbersList = data.result;
      this.filteredPO = data.result;
      this.SpinnerService.hide();
    })
  }

  poDailog(data) {
    this.progressDailogBool = true;
    this.headerpop = "Confirm PO number";
    this.p_width = '70vw';
    this.getPO_numbers(this.vendorId);
    this.searchPOArr = data
    this.getDate();
  }
  filterPOnumber(event) {
    if (this.poNumbersList?.length > 0) {
      this.filteredPO = this.dataService.uni_filter(this.poNumbersList,'PODocumentID',event);
    }
  }
  POsearch(val) {
    if (this.headerpop == 'Confirm PO number') {
      this.poNumbersList = this.filteredPO;
      if (this.poNumbersList?.length > 0) {
        this.poNumbersList = this.poNumbersList.filter(el => {
          return el.Document.PODocumentID.toLowerCase().includes(val.toLowerCase())
        });
      }
    } else {
      this.grnList = this.filterGRNlist;
      if (this.grnList?.length > 0) {
        this.grnList = this.grnList.filter(el => {
          return el.GRNNumber.toLowerCase().includes(val.toLowerCase())
        });
      }
    }
  }
  selectedPO(id, event) {
    delete this.updateInvoiceData;
    let po_num_text = document.getElementById(id).innerHTML;
    let po_num = po_num_text.trim();
    this.poDate = this.poNumbersList.filter((val) => {
      return val.PODocumentID == po_num
    });
    this.activePOId = po_num;
    this.SharedService.po_doc_id = po_num;
    this.SharedService.po_num = po_num;
    this.readPOLines(po_num)
  }

  readPOLines(po_num) {
    this.SpinnerService.show();
    this.SharedService.getPO_Lines(po_num).subscribe((data: any) => {
      this.SpinnerService.hide();
      this.PO_GRN_Number_line = data?.result;
      return data?.result;
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }

  confirmPO() {
    let updateValue = {
      "header": {}
    };
    updateValue.header['PurchaseOrder'] = this.SharedService.po_num;
    this.updateInvoiceData = updateValue;
    this.saveChanges();
    this.progressDailogBool = false;
    setTimeout(() => {
      this.readLineItems();
      this.getInvoiceFulldata('');
    }, 1000);
  }
  getDate() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = today.getMonth();
    this.selectedMonth = this.months[month];
    let year = today.getFullYear();
    this.lastYear = year - 2;
    this.displayYear = `${this.lastYear}:${year}`;
    let prevYear = year - 2;

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
  }


  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      if (frmDate && toDate) {
        if (this.datePicker.overlayVisible) {
          this.datePicker.hideOverlay();
        }
        this.poNumbersList = this.filteredPO;
        this.poNumbersList = this.poNumbersList.filter((element) => {
          const dateF = this.datePipe.transform(element.DocumentData.Value, 'yyyy-MM-dd')
          return dateF >= frmDate && dateF <= toDate;
        });
      }
    } else {
      this.poNumbersList = this.filteredPO;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  status_dialog() {
    this.progressDailogBool = true;
    this.headerpop = "Please select the status";
    this.p_width = '350px';
    this.status_arr = [
      { name: 'Sent to ERP', st_obj: { status: '7', subStatus: '77' } },
      { name: 'Posted', st_obj: { status: '14', subStatus: '77' } }
    ];
  }
  status_change() {
    this.SpinnerService.show();
    let obj = {
      "documentStatusID": this.status_change_op.status,
      "documentsubstatusID": this.status_change_op.subStatus
    }
    this.SharedService.changeStatus(obj).subscribe((data: any) => {
      this.success(data.result);

      this.progressDailogBool = false;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }

  onOptionDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sampleLineData, event.previousIndex, event.currentIndex);
  }
  Approve_grn() {
    this.SpinnerService.show();
    this.exceptionService.approve_grn().subscribe((data: any) => {
      this.SpinnerService.hide();
      if (data.status?.toLowerCase() == 'posted') {
        this.success(data.message);

        setTimeout(() => {
          this._location.back();
        }, 1000);
      } else {
        this.error(data.message);
      }
    }, err => {
      this.SpinnerService.hide();
      if (err.status == 403) {
        this.error(err.error.Error);
      } else {
        this.error('Server error');
      }
    })
  }
  canDeactivate(): boolean {
    if (!this.uploadCompleted) {
      return window.confirm(
        'Please click the "Next" button to process the document otherwise upload processs will terminate. Do you really want to leave?'
      );
    }
    return true;
  }
  onSelectFileApprove(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadFileList.push(event.target.files[i]);
    }
    this.uploadSupport(this.invoiceID);
  }
  onSelectFile(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadFileList.push(event.target.files[i]);

    }
  }
  removeUploadQueue(index) {
    this.uploadFileList.splice(index, 1);
  }

  uploadSupport(id) {
    this.progress = 1;
    const formData: any = new FormData();
    for (const file of this.uploadFileList) {
      const cleanedFileName = file.name.replace(/\.(?=.*\.)/g, '');
      formData.append('files', file, cleanedFileName);
    }
    this.SpinnerService.show()
    this.SharedService.uploadSupportDoc(id,formData)
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
            this.success("Supporting Documents uploaded Successfully");
            this.uploadFileList = [];
            this.support_doc_list = [];
            event.body?.result?.forEach(ele => {
              this.support_doc_list.push(ele);
            })
            //  setTimeout(() => {
            //  this.getInvoiceFulldata();
            this.SpinnerService.hide()
          }
        }),
        catchError((err: any) => {
          this.progress = null;
          this.error("Server error");
          this.SpinnerService.hide()
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  downloadDoc(doc_name, type) {
    let encodeString = encodeURIComponent(doc_name);
    this.SharedService.downloadSupportDoc(encodeString).subscribe(
      (response: any) => {
        let blob: any = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        if (type == 'view') {
          const dailogRef: MatDialogRef<SupportpdfViewerComponent> = this.mat_dlg.open(SupportpdfViewerComponent, {
            width: '90vw',
            height: '95svh',
            hasBackdrop: true,
            data: { file: url }
          })
        } else {
          fileSaver.saveAs(blob, doc_name);
          this.success("Document downloaded successfully.");
        }

      },
      (err) => {
        this.error("Server error");
      }
    );
  }

  deleteSupport(file){
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to delete this line?', 'confirmation', 'Confirmation');
    drf.afterClosed().subscribe((bool:boolean)=>{
      if(bool){
        this.support_doc_list = [];
        this.SpinnerService.show();
        this.SharedService.deleteSupport(file).subscribe((data:any)=>{
          if(data.status == 'success'){
            this.support_doc_list = data.files;
            this.success("Deleted successfully.");
            this.SpinnerService.hide();
          }
        },err=>{
          this.error("Server error");
          this.SpinnerService.hide();
        })
      }
    })
  }

  grnAttachmentDoc(base64, type) {
    let blob: any = this.base64ToBlob(base64);
    const url = window.URL.createObjectURL(blob);
    if (type == 'view') {
      const dailogRef: MatDialogRef<SupportpdfViewerComponent> = this.mat_dlg.open(SupportpdfViewerComponent, {
        width: '90vw',
        height: '95svh',
        hasBackdrop: true,
        data: { file: url }
      })
    } else {
      fileSaver.saveAs(blob, `GRN attachment_invoice_number_${this.invoiceNumber}.pdf`);
      this.success("Document downloaded successfully.");
    }
  }

  getGrnAttachment() {
    this.SharedService.getGRNAttachment().subscribe((data: any) => {
      this.grnAttachmentArray = data;
    }, err => {
      this.error("Server error");
    })
  }

  base64ToBlob(base64) {
    // Extract the MIME type from the Base64 string if present
    const base64Pattern = /^data:(.*);base64,(.*)$/;
    const matches = base64?.match(base64Pattern);

    let mimeType;
    let data;

    if (matches) {
      mimeType = matches[1]; // Extracted MIME type
      data = matches[2]; // Base64 data
    } else {
      // Fallback MIME type if not specified in the Base64 string
      mimeType = 'application/octet-stream';
      data = base64;
    }

    // Decode the Base64 string
    const byteCharacters = atob(data);

    // Create an array for the byte characters
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Convert the byte numbers array into a Uint8Array
    const byteArray = new Uint8Array(byteNumbers);
    // Create a Blob from the Uint8Array
    return new Blob([byteArray], { type: mimeType });
  }

  getEntity() {
    this.dataService.getEntity().subscribe((data: any) => {
      this.entityList = data;
      this.SharedService.selectedEntityId = this.dataService.entityID;
      this.entityList.forEach(val => {
        if (this.dataService.entityID == val.idEntity) {
          this.entityName = val.EntityName;
          this.EntityName = val.EntityName;
        }
      })
    });

  }

  readDepartment() {
    this.SharedService.getDepartment().subscribe((data: any) => {
      this.DepartmentList = data.department;
      let deparmrnt_id;
      if (this.tagService.batchProcessTab == 'editApproveBatch') {
        deparmrnt_id = this.dataService.editableInvoiceData.approverData.hierarchy_details.DepartmentID;
        this.DepartmentList.forEach(ele => {
          if (ele.idDepartment == deparmrnt_id) {
            this.selectedDepartment = ele?.DepartmentName;
          }
        })
      } else {
        deparmrnt_id = this.DepartmentList[0]?.idDepartment
        this.selectedDepartment = this.DepartmentList[0]?.DepartmentName;
      }
      this.approversSendData.push({
        EntityID: this.SharedService.selectedEntityId,
        DepartmentID: deparmrnt_id
      })
      this.readApproverData();
      // this.approversSendData[0].DepartmentID = this.DepartmentList[0]?.idDepartment ? this.DepartmentList[0]?.idDepartment : null;
      // this.entityDeptList = this.entityBodyList[0].department
    });
  }
  onSelectDepartment(val) {
    this.DepartmentList.forEach(ele => {
      if (ele.DepartmentName == val) {
        this.approversSendData[0].DepartmentID = ele.idDepartment
      }
    })
    this.readApproverData();
  }
  readCategoryData() {
    this.SharedService.readCategory().subscribe((data: any) => {
      this.categoryList = data;
    })
  }

  onSelectCategory(val) {
    this.approversSendData[0].categoryID = val;
  }

  readApproverData() {
    this.SpinnerService.show();
    this.approversSendData[0].approver = [];
    this.approverList = {}
    this.SharedService.readApprovers(this.approversSendData[0]).subscribe((data: any) => {
      let resultData = data?.result
      let array = [];
      let list = [];
      let count = 0;
      for (const item in resultData) {
        count = count + 1;
        list = resultData[item].sort((a, b) => a.userPriority - b.userPriority);
        this.approverList[`${item}_${count}`] = list;
        array.push(resultData[item][0]?.User?.idUser);
      }
      this.approversSendData[0].approver = array;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      if (err.status == 403) {
        this.error("Approvers are not available for this combination");
      } else {
        this.error("Server error");
      }

    })

  }

  onSelectApprovers(value, index) {
    this.approversSendData[0].approver[index] = value;
  }

  onSelectPreApprove(bool) {
    if (bool == true) {
      this.open_dialog('approve');
    }
  }

  onSubmitApprovers() {
    this.approversSendData[0].description = this.rejectionComments;
    if (this.preApproveBoolean == false) {
      this.sendApprovalAPI();
    } else {
      if (this.preApproveBoolean == true) {
        this.sendApprovalAPI();
      } else {
        this.error("Please add pre approval comments");
      }
    }
  }
  sendApprovalAPI() {
    this.SpinnerService.show();
    this.SharedService.setApprovers(this.approversSendData[0], this.preApproveBoolean).subscribe((data: any) => {
      this.SpinnerService.hide();
      if (data?.error_status) {
        this.error(data?.error_status)
      } else {
        this.success(data?.result);
        setTimeout(() => {
          this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
        }, 1000);
      }
    },
      (err) => {
        this.SpinnerService.hide();
        this.error("Server error");
      })
  }
  filterEntity(event) {
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < this.entityList?.length; i++) {
    //   let country = this.entityList[i];
    //   if (
    //     country.EntityName.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(country);
    //   }
    // }
    this.filteredEnt = this.dataService.uni_filter(this.entityList,'EntityName',event);
  }
  // onSelectEnt(event){
  //   this.selectedEntity = event.EntityName;
  // }
  onSelectEntity(event, type) {
    if (type == 'change') {
      this.exceptionService.changeEntity(event.idEntity).subscribe((data: any) => {
        if (data.status == 'success') {
          this.success("Entity changed successfully and batch triggered.");
          this.syncBatch();
        } else {
          this.error(data.message)
        }

      }, err => {
        this.error("Server error")
      })
    } else {
      this.entityList.forEach(val => {
        if (event == val.EntityName) {
          this.readPONumbersLCM(val.idEntity);
        }
        this.LCMObj.EntityName = this.EntityName;
        this.LCMLineForm.control.patchValue(this.LCMObj);
      })
    }
  }
  readPONumbersLCM(ent_id) {
    this.SharedService.getLCMPOnum(ent_id).subscribe((data: any) => {
      this.POlist_LCM = data.LCMPoNumbers;
      this.LCMObj.EntityName = this.EntityName;
      this.LCMLineForm.control.patchValue(this.LCMObj);
    })
  }

  filterPOnumber_LCM(event) {
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < this.POlist_LCM?.length; i++) {
    //   let country = this.POlist_LCM[i];
    //   if (
    //     country.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(country);
    //   }
    // }
    this.filteredPO = this.dataService.uni_filter(this.POlist_LCM,'PODocumentID',event);
  }

  selectedPO_lcm(value) {
    this.selectedPONumber = value.PODocumentID;
    this.readLCMLines(value.PODocumentID);
  }
  readLCMLines(po_num) {
    this.LCMItems = [];
    this.SpinnerService.show();
    this.SharedService.getLCMLines(po_num).subscribe((data: any) => {
      let LCMLineData = data.PoLineData;
      let count = 0;
      for (const item in LCMLineData) {
        count = count + 1;
        this.LCMItems.push({ PoLineDescription: item, id: count, values: LCMLineData[item] });
      }
      this.voyageList = data.VoyageNumbers;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }
  filterLCMLine(event) {
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < this.LCMItems?.length; i++) {
    //   let country = this.LCMItems[i];
    //   if (
    //     country.PoLineDescription.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(country);
    //   }
    // }
    this.filteredLCMLines = this.dataService.uni_filter(this.LCMItems,'PoLineDescription',event);
  }
  OnSelectLine(event) {
    this.selectedLCMLine = event.PoLineDescription;
    this.itemId = event.values.ItemId;
    // this.selectedVoyage = event.values.Voyage;
    // this.act_val = event.values.ActualizedValue;
    // this.est_val = event.values.EstimatedValue;
    // this.max_allocation = event.values.AllocateRange;
    this.lineNumber = event.values.LineNumber;
    this.ContextTableId = event.values.ContextTableId;
    this.ContextRecId = event.values.ContextRecId;
    // this.AGIVesselNumber = event.values.AGIVesselNumber;
    this.readChargeCode(event.values.dataAreaId, this.ContextRecId, this.ContextTableId)
  }
  // filterVoyage(event){
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < this.voyageList.length; i++) {
  //     let country = this.voyageList[i];
  //     if (
  //       country.voyage_number.toLowerCase().indexOf(query.toLowerCase()) == 0
  //     ) {
  //       filtered.push(country);
  //     }
  //   }
  //   this.filteredVoyage = filtered;
  // }
  // onSelectVoyage(event){
  //   console.log(event)
  //   this.selectedVoyage = event.voyage_number;
  // }
  readChargeCode(dataArea, ContextRecId, ContextTableId) {
    this.SpinnerService.show();
    this.SharedService.getChargesCode(dataArea, ContextRecId, ContextTableId).subscribe((data: any) => {
      this.chargeList = data.value;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }
  filterCost(event) {
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < this.chargeList?.length; i++) {
    //   let country = this.chargeList[i];
    //   if (
    //     country.MarkupCode.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(country);
    //   }
    // }
    this.filteredCost = this.dataService.uni_filter(this.chargeList,'MarkupCode',event);
  }
  onSelectCost(event) {
    this.selectedCost = event.MarkupCode;
    this.MarkupTransRecId = event.MarkupTransRecId;
    this.SpinnerService.show();
    this.SharedService.getEstActValue(this.selectedPONumber, this.lineNumber, event.MarkupCode).subscribe((data: any) => {
      this.selectedVoyage = data.voyage;
      this.act_val = data.act_val;
      this.est_val = data.est_val;
      this.AGIVesselNumber = data.vessel_num;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  AddLCMLine(value) {
    let Obj = {
      EntityName: this.EntityName,
      PoDocumentId: this.selectedPONumber,
      PoLineDescription: this.selectedLCMLine,
      PoLineNumber: this.lineNumber,
      VoyageNumber: this.selectedVoyage,
      CostCategory: this.selectedCost,
      EstimatedValue: this.est_val,
      ActualizedValue: this.act_val,
      Allocate: value.Allocate,
      ContextTableId: this.ContextTableId,
      ContextRecId: this.ContextRecId,
      AGIVesselNumber: this.AGIVesselNumber,
      MarkupTransRecId: this.MarkupTransRecId
    }

    this.SaveLCM(Obj);
  }
  deleteLCMLine(index) {
    this.LCMDataTable.splice(index, 1);
  }
  onChange(evt) {
    const formData = new FormData();
    formData.append("file", evt.target.files[0]);
    this.uploadExcel_LCM(formData)
  }
  uploadExcel_LCM(file) {
    this.SpinnerService.show();
    this.SharedService.uploadLCM_xl(file).subscribe((data: any) => {
      if (data?.data) {
        //         data.data.forEach(ele => {
        //           this.LCMDataTable.push(ele);
        //         })
        this.readSavedLCMLineData();
        this.success(data.data);
      } else if (data?.error) {
        let str = data.error.toString();
        this.error(str);
      }
      // this.LCMDataTable = data;
      // this.readSavedLCMLineData()
      // this.AlertService.addObject.detail="File Uploaded"
      // this.messageService.add(this.AlertService.addObject);
      // this.successAlert("File Uploaded");
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
    delete this.uploadExcelValue;
  }
  downloadLCMTemplate() {
    this.SharedService.downloadLCMTemplate('').subscribe((data: any) => {
      this.excelDownload(data, 'LCM upload template');
    })
  }
  excelDownload(data, type) {
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `${type}-(${datestring})`);
  }
  readSavedLCMLineData() {
    this.SpinnerService.show()
    this.SharedService.getsavedLCMLineData().subscribe((data: any) => {
      this.LCMDataTable = data.data;
      const sum = this.LCMDataTable.reduce((accumulator, object) => {
        return accumulator + Number(object.Allocate);
      }, 0);
      this.allocateTotal = sum.toFixed(this.decimal_count);
      let bal: any = Number(this.invoiceTotal) - this.allocateTotal;
      this.balanceAmount = parseFloat(bal).toFixed(this.decimal_count);
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  SaveLCM(obj) {
    this.SpinnerService.show();
    this.SharedService.saveLCMdata([obj], true).subscribe((data: any) => {
      if (data?.result) {
        this.SpinnerService.hide();
        this.success(data?.result)
        this.LCMObj.EntityName = this.EntityName;
        this.LCMLineForm.control.patchValue(this.LCMObj);
        this.readSavedLCMLineData();
      } else if (data?.error) {
        this.SpinnerService.hide();
        this.error(data?.error);
      }
    }, err => {
      this.error('Server error');
    })
  }

  submitLCMLines() {
    this.SpinnerService.show();
    this.SharedService.saveLCMdata(this.LCMDataTable, false).subscribe((data: any) => {
      if (data?.result[2] == true) {
        this.success('LCM Lines added please select Approvers');
        this.isLCMCompleted = true;
        this.selectionTabBoolean = true;
        this.supportTabBoolean = true;
        this.isLCMInvoice = false;
        this.readDepartment();
        this.readCategoryData();
        this.getInvoiceFulldata('');
        this.currentTab = 'approver_selection';
      } else {
        this.success('LCM Lines created');
        setTimeout(() => {
          this._location.back();
        }, 1000);
      }
      this.displayrejectDialog = false;
      this.SpinnerService.hide();

    }, err => {
      this.displayrejectDialog = false;
      this.error('Server error');
      this.SpinnerService.hide();
    })

  }
  calculateCost() {
    let totalpoCost = 0;
    let totalinvCost = 0;
    this.lineData?.forEach(el=>{
      let pounitPrice = parseFloat(el?.lines?.UnitPrice?.po_line?.Value);
      const poquantity = parseFloat(el?.lines?.Quantity?.po_line?.Value);
      let invunitPrice = parseFloat(el?.lines?.UnitPrice?.Value);
      const invquantity = parseFloat(el?.lines?.Quantity?.Value);
      const po_discount = parseFloat(el?.lines?.Discount?.po_line?.Value);
      const inv_discount = parseFloat(el?.lines?.Discount?.Value);
      const po_discountPercent = parseFloat(el?.lines?.DiscPercent?.po_line?.Value);
      const inv_discountPercent = parseFloat(el?.lines?.DiscPercent?.Value);
      if(po_discount && po_discount != 0){
        pounitPrice = pounitPrice - po_discount;
      }
      if(inv_discount && inv_discount != 0){
        invunitPrice = invunitPrice - inv_discount;
      }
      if(po_discountPercent && po_discountPercent != 0){
        pounitPrice = pounitPrice - (pounitPrice * po_discountPercent / 100);
      }
      if(inv_discountPercent && inv_discountPercent != 0){
        invunitPrice = invunitPrice - (invunitPrice * inv_discountPercent / 100);
      }
    
      if (!isNaN(pounitPrice) && !isNaN(poquantity)) {
        totalpoCost += pounitPrice * poquantity;
      }
      if (!isNaN(invunitPrice) && !isNaN(invquantity)) {
        totalinvCost += invunitPrice * invquantity;
      }
      // if(!isNaN(po_discount)){
      //     totalPoDiscount += po_discount;
      // }
      // if(!isNaN(inv_discount)){
      //     totalInvDiscount += inv_discount;
      // }
    })
      this.po_total = totalpoCost.toFixed(2);
      this.totalInvCost = totalinvCost.toFixed(2);
    // console.log(unitPriceObject)
    // if (unitPriceObject && quantityObject) {

    //   const unitPriceData = unitPriceObject?.items;
    //   const quantityData = quantityObject?.items;


    //   for (let i = 0; i < unitPriceData?.length; i++) {
       


    //   }
    //   this.po_total = totalpoCost;
    //   this.totalInvCost = totalinvCost.toFixed(2);
    //   // console.log("Total Cost:", totalpoCost);
    // } else {
    //   console.log("UnitPrice or Quantity data not found.");
    // }
  }
  getRejectionComments() {
    this.exceptionService.rejectCommentsList().subscribe((data: any) => {
      this.approvalRejectRecord = data;
    })
  }
  success(msg) {
    this.AlertService.success_alert(msg);
  }
  error(msg) {
    this.AlertService.error_alert(msg);
  }
  update(msg) {
    this.AlertService.update_alert(msg);
  }

  reqDataValidation() {
    for (const row of this.rows) {
      if (!row.driver_name || !row.company_name) {
        this.isFormValid = true;
        break;
      }
    }
  }
  updateEditedValue(iddynamiccostallocation: any, key: string, value: any) {
    //   this.editedValues[key] = value;
    //   this.editedValues[iddynamiccostallocation] = this.editedValues[iddynamiccostallocation] || {};
    //   this.editedValues[iddynamiccostallocation][key] = value;
    this.editedValues[iddynamiccostallocation + ',' + key] = value;

  }
  addRow(index: number) {
    this.isFormValid = false;
    this.rows.push(this.getNewRow());
    // console.log(this.rows)
  }
  getNewRow() {
    return { driver_name: '', company_name: '' };
  }
  removeRow(index: number) {
    // Remove the row at the specified index
    this.rows.splice(index, 1);
  }

  getInvTypes() {
    this.exceptionService.getInvTypes().subscribe((data: any) => {
      this.invTypeList = data.data;
      data.data.forEach(el => {
        if (el.toLowerCase() == this.docType) {
          this.docType = el;
        } if (this.docType == 'credit') {
          this.docType = 'Invoice'
        } else if (this.docType == 'non-po') {
          this.docType = 'Non PO Invoice'
        } else if (this.docType == 'advance invoice') {
          this.docType = 'Advance Invoice'
        } else if (this.docType == 'credit note') {
          this.docType = 'Credit Note'
        } else if (this.docType == 'retention invoice') {
          this.docType = 'Retention Invoice'
        }
        this.d_type = this.docType;
      })
    })
  }
  onSelectInvType(event) {
    this.exceptionService.changeInvType(event.value.toLowerCase()).subscribe((data: any) => {
      if (data.status == 'success') {
        this.success("Invoice type changed successfully, and sent to batch.");
        this.syncBatch();
      } else {
        this.error(data.message)
      }
    }, err => {
      this.error("Server error")
    })
  }

  openBox() {
    this.isBoxOpen = true;
    this.activeTab = 'percentage';
  }

  saveData(tab: string) {
    let pa_data;
    let inv_type = true;

    if (tab === 'percentage') {
      pa_data = this.percentageData;
      inv_type = true;
    } else {
      pa_data = this.amountData;
      inv_type = false;
    }
    this.SharedService.uploadPercentageAndAmountDetails(pa_data, inv_type, tab).subscribe((data: any) => {
      this.success("Submitted successfully")
      setTimeout(() => {
        this.isBoxOpen = false;
      }, 100);
    }, err => {
      this.error("Server error");
      setTimeout(() => {
        this.isBoxOpen = false;
      }, 100);
    });
  }
  closeBox(): void {
    this.isBoxOpen = false;
    // Reset other properties as needed
  }
  updateButtonState(tab: string) {
    // Enable the button only when both percentageData and amountData are provided
    this.isButtonDisabled = !(this.percentageData || this.amountData);
    if (this.percentageData == '') {
      this.resultAmount = 0;
    }
    if (tab === 'percentage') {
      this.isButtonDisabled = !/^[0-9]*$/.test(this.percentageData);
      this.SharedService.getAmountofPercentage(this.percentageData).subscribe((data: any) => {
        this.resultAmount = data;
        // this.cdr.detectChanges();
      });
    } else if (tab === 'amount') {
      this.isButtonDisabled = !/^[0-9]*$/.test(this.amountData);
    }
  }

  onChangeAdvance(data, in_value, tagName) {
    this.advanceAPIbody = {
      "linenumber": data.itemCode,
      "prev_value": data.Value.toString(),
      "id_documentline": data.idDocumentLineItems,
      "value": in_value,
      "tagname": tagName
    };
  }
  saveAdChanges() {
    if (this.advanceAPIbody && this.advanceAPIbody.value != '') {
      this.SpinnerService.show();
      this.exceptionService.getAdPercentage(this.advanceAPIbody).subscribe((data: any) => {
        this.SpinnerService.hide();
        if (data?.status == "Success") {
          this.success("Updated succesfully");
          this.inv_line_total = 0;
          this.lineDisplayData.forEach(tag => {
            let tagName = 'AmountExcTax';
            if (this.advanceAPIbody.tagname == 'AmountExcTax') {
              tagName = 'AdvancePercent';
            }
            tag.linedata.forEach(ele => {
              if (tag.TagName == tagName) {
                if (ele.DocumentLineItems.itemCode == this.advanceAPIbody.linenumber) {
                  ele.DocumentLineItems.Value = data?.result?.value;
                }
              }
              // if(this.advanceAPIbody.tagname == 'AmountExcTax'){
              //   this.inv_line_total = parseFloat(this.advanceAPIbody.value) + this.inv_line_total ;
              // }
              if (tag.TagName == 'AmountExcTax') {
                this.inv_line_total = this.inv_line_total + parseFloat(ele.DocumentLineItems.Value);
              }
            })
          })
        } else {
          this.error(data?.msg);
        }
      }, err => {
        this.SpinnerService.hide();
        this.error("Server error");
      })
    }
  }

  filterPreDrop(event, tag) {
    let arr = [];
    if (tag == 'PurchaseOrder') {
      arr = this.poList;
    } else {
      arr = this.invNumbersList;
    }
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < arr?.length; i++) {
    //   let str = arr[i];
    //   if (
    //     str.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(str);
    //   }
    // }
    this.filteredPreData = this.dataService.uni_filter(arr,tag,event);
  }
  onSelectPrePay(event, value, tagname, index) {
    this.onChangeValue(tagname,event,value);
    // setTimeout(() => {
    //   this.saveChanges();
    // }, 1000);
    // let old_value
    // this.temp_line_data.forEach(tag => {
    //   if (tag.tagname == tagname) {
    //     old_value = tag.items[index].linedetails[0].invline[0].DocumentLineItems.Value
    //   }
    // })
    // let obj = {
    //   tag_id: value.idDocumentLineItems,
    //   tag_name: tagname,
    //   prev_value: old_value,
    //   curr_value: event,
    // }
    // this.exceptionService.savePreData(obj).subscribe((data: any) => {
    //   this.success('Changes saved successfully')
    // }, err => {
    //   this.error("Server error or Please check the data");
    // })
  }

  filterProject(event, tag) {
    let arr = [];
    this.SpinnerService.show();
    if (tag == 'Project') {
      arr = this.projectIdArr;
    } else {
      arr = this.projectCArr;
    }
    // let filtered: any[] = [];
    // let query = event.query;
    // for (let i = 0; i < arr?.length; i++) {
    //   let str = arr[i];
    //   if (
    //     str.toLowerCase().indexOf(query.toLowerCase()) == 0
    //   ) {
    //     filtered.push(str);
    //   }
    // }
    this.filteredProject = this.dataService.uni_filter(arr,tag,event);
    this.SpinnerService.hide();
  }

  onSelectProject(event, value) {
    this.onChangeValue(value.TagLabel,event,value);
    setTimeout(() => {
      this.saveChanges();
    }, 1000);
    // let old_val: any = this.temp_header_data.filter(el => value.idDocumentData == el?.DocumentData?.idDocumentData);
    // let obj = {
    //   tag_id: value.idDocumentData,
    //   tag_name: value.TagLabel,
    //   prev_value: old_val[0]?.DocumentData?.Value,
    //   curr_value: event,
    // }
    // this.exceptionService.saveProjectData(obj).subscribe((data: any) => {
    //   this.success('Changes saved successfully')
    // }, err => {
    //   this.error("Server error or Please check the data");
    // })
  }
  ap_api_body() {
    return {
      "desp": `${this.rejectionComments}`,
      "bulk_approval": this.bulk_bool
    }
  }
  moreInfoFun() {
    this.SpinnerService.show();
    let desc = this.ap_api_body();
    this.exceptionService.sendToMore(desc).subscribe((data: any) => {
      if (data.result == 'success') {
        this.success(data.message);
        setTimeout(() => {
          this.SpinnerService.hide();
          this._location.back();
        }, 1000);
      } else {
        this.error(data.message);
      }
      this.SpinnerService.hide();
    })
  }
  proceedMoreInfo() {
    this.SpinnerService.show();
    let desc = this.ap_api_body();
    this.exceptionService.proceedMoreInfo(desc).subscribe((data: any) => {
      if (data.result == 'success') {
        this.success(data.message);
        setTimeout(() => {
          this._location.back();
        }, 1000);
      } else {
        this.error(data.message);
      }
      this.SpinnerService.hide();
    })
  }
  onHighlight(data) {
    this.rectData = data;
  }
  onChecked(value) {
    this.isManpower = value
  }

  progressiveAmount(amount, id) {
    this.exceptionService.amountToApply(amount, id).subscribe((data: any) => {
      if (data?.status == 'sucess') {
        this.success(data.msg)
      } else {
        this.error(data.msg)
      }
    }, err => {
      this.error("Server error")
    })
  }

  getProjectData(){
    this.exceptionService.readProjectData().subscribe((data:any)=>{
      this.projectIdArr = data.result.value;

    },err=>{
    })
  }
  getProjectCatData(){
    this.exceptionService.readProjectCatData().subscribe((data:any)=>{
      this.projectCArr = data.result.value;
    },err=>{
    })
  }
  shouldRenderInput(){
    return this.client_name === 'Cenomi' && this.GRN_PO_Bool;
  }
  ngOnDestroy() {
    let sessionData = {
      session_status: false,
      "client_address": JSON.parse(sessionStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(sessionData)
      .subscribe((data: any) => { });
    clearTimeout(this.callSession);
    this.AlertService.addObject.severity = 'success';
    this.tagService.financeApprovePermission = false;
    this.tagService.approveBtnBoolean = false;
    this.tagService.submitBtnBoolean = false;
    this.dataService.grnWithPOBoolean = false;
    this.dataService.poLineData = [];
    delete this.SharedService.fileSrc;
    delete this.dataService.documentType;
    delete this.tagService.approval_selection_boolean;
    delete this.dataService.subStatusId;
    delete this.dataService.added_manpower_data;
    delete this.dataService.number_of_days;
    delete this.SharedService.po_num;
    delete this.exceptionService.po_num;
    delete this.SharedService.invoiceID;
    delete this.exceptionService.invoiceID;
    delete this.dataService.grn_manpower_metadata;
    delete this.dataService.manpowerResponse
    this.mat_dlg.closeAll();
    this.dataService.isEditGRN = false;
  }
  labelHighlight(text){
    this.fieldName = text;
  }

}
