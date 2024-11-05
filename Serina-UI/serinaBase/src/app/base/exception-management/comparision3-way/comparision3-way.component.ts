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
import { catchError, map, take } from 'rxjs/operators';
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
  updateInvoiceData: any = [];
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

  isPdfAvailable: boolean;
  userDetails: any;
  showPdf: boolean = true;
  btnText = 'Close';
  selectedPONumber;
  poList = [];
  filteredPO: any[];

  lineCount = [];
  currentTab = 'header';
  lineItems: any;
  inv_itemcode: any;
  po_itemcode: any;
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
    { header: 'Description', field: 'Description' },
    { header: 'Unit', field: 'Unit' },
    { header: 'Price', field: 'UnitPrice' },
    { header: 'Quantity', field: 'Quantity' },
    { header: 'Amount', field: 'amount' }
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
  po_total: number;
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
  totalInvCost: number;
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
  disable_save_btn: boolean;
  saveDisabled: boolean;
  grnTooltip: string;
  isDraft: boolean;

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
    this.ERP = this.dataService?.configData?.erpname;
    this.client_name = this.dataService?.configData?.client_name;
    if (this.client_name == 'SRG') {
      this.mappingForCredit = true;
    } 
    const commonTags = [
      { TagName: 'Description', linedata: [] },
      { TagName: 'PO Qty', linedata: [] },
      { TagName: 'AmountExcTax', linedata: [] },
      { TagName: 'GRN - Quantity', linedata: [] },
      { TagName: 'UnitPrice', linedata: [] },
      { TagName: 'Actions', linedata: [] }
    ];

    this.GRN_PO_tags = [...commonTags];

    if (this.client_name === 'Cenomi') {
      this.GRN_PO_tags.splice(5, 0, { TagName: 'PO Balance Qty', linedata: [] });
    }
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
    this.readFilePath();
    this.ERPCostAllocation();
    this.AddPermission();

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
            this.tagService.headerName = 'Update GRN'
          } else {
            this.tagService.headerName = 'Create GRN with PO';
          }
          this.Itype = 'PO';
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
      if (!['advance invoice'].includes(this.documentType)) {
        this.getGRNtabData();
        this.getGrnAttachment();
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
    } else if (this.ERP == 'Dynamics') {
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
    this.dataService.GRN_PO_Data.forEach((ele, i) => {
      const tagMappings = {
        'Description': { value: 'Name', oldValue: 'Name', isMapped: '', tagName: 'Description' },
        'PO Qty': { value: 'PurchQty', isMapped: '', tagName: 'PO Qty' },
        'PO Balance Qty': { value: 'RemainInventPhysical', isMapped: '', tagName: 'PO Balance Qty' },
        'GRN - Quantity': { value: this.dataService.isEditGRN ?'GRNQty':'', isMapped: '', tagName: 'Quantity' },
        'UnitPrice': { value: 'UnitPrice', isMapped: 'Price', tagName: 'UnitPrice' },
        'AmountExcTax': {
          value: (ele) => {
            const unitPrice = parseFloat(ele.UnitPrice.replace(/,/g, ''));
            let amount;
            if(this.dataService.isEditGRN){
              amount = (unitPrice * ele.GRNQty).toFixed(2);
            } else {
              amount = (unitPrice * ele.PurchQty).toFixed(2);
            }
            this.GRN_line_total += Number(amount);
            return Number(amount);
          },
          isMapped: '',
          tagName: 'AmountExcTax'
        },
        'Actions': { value: '', isMapped: '', tagName: 'Actions' }
      };

      if (this.client_name == 'Cenomi' && this.isManpowerTags) {
        tagMappings['Duration in months'] = { value: 'durationMonth', isMapped: '', tagName: 'Duration in months' }
        tagMappings['Monthly quantity'] = {
          value: (ele) => {
            let monthlyQuantity = 0;
            if (ele.durationMonth) {
              monthlyQuantity = ele.PurchQty / ele.durationMonth;
            }
            return monthlyQuantity.toFixed(2);
          }, isMapped: '', tagName: 'Monthly quantity'
        }
        tagMappings['Is Timesheets'] = { value: 'isTimesheets', isMapped: '', tagName: 'Is Timesheets' }
        tagMappings['Number of Shifts'] = { value: 'shifts', isMapped: '', tagName: 'Number of Shifts' }
      }

      this.GRN_PO_tags.forEach((tag, index) => {
        if (tagMappings[tag.TagName]) {
          const mapping = tagMappings[tag.TagName];
          const value = typeof mapping.value === 'function' ? mapping.value(ele) : ele[mapping.value];
          tag.linedata.push({
            Value: value,
            old_value: mapping.oldValue ? ele[mapping.oldValue] : undefined,
            ErrorDesc: '',
            idDocumentLineItems: ele.LineNumber,
            is_mapped: mapping.isMapped,
            LineNumber: ele.LineNumber || ele.itemCode,
            tagName_u: `${mapping.tagName}-${ele.LineNumber || ele.itemCode}-${i}`,
            tagName: mapping.tagName
          });
        }
      });
    })
    const timeSheetTag = this.GRN_PO_tags.find(item => item.TagName === 'Is Timesheets');
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
    this.lineDisplayData = this.GRN_PO_tags;
    let arr = this.GRN_PO_tags;
    setTimeout(() => {
      arr.forEach((ele1) => {
        if (ele1.TagName == 'GRN - Quantity' || ele1.TagName == 'Description' || ele1.TagName == 'UnitPrice') {
          this.GRNObject.push(ele1.linedata);
        }
        if (ele1.TagName == 'GRN - Quantity') {
          ele1.linedata?.forEach((el) => {
            el.is_quantity = true;
          });
        }
        this.GRNObject = [].concat(...this.GRNObject);
      });
      this.GRNObject.forEach((val) => {
        if (!val.old_value) {
          val.old_value = val.Value;
        }
      });
    }, 100);
    this.grnLineCount = this.lineDisplayData[0]?.linedata;
    this.isGRNDataLoaded = true;
  }

  getInvoiceFulldata_po() {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    this.SharedService.getInvoiceInfo().subscribe(
      (data: any) => {
        const pushedArrayHeader = [];
        data.ok.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        let GRN_linedata = data?.ok?.linedata;
       if(this.dataService.isEditGRN){
        let po_lines = this.dataService.po_lines;
        this.dataService.GRN_PO_Data = this.exceptionService.convertData(GRN_linedata, this.exceptionService.po_num);
        this.getPODocId(this.exceptionService.po_num)
        po_lines?.forEach(line=>{
          this.dataService.GRN_PO_Data.forEach(grn_line=>{
            if(line.LineNumber == grn_line.LineNumber){
              grn_line.PurchQty = line.PurchQty;
              grn_line.RemainInventPhysical = line.RemainInventPhysical;
              
            }
          })
        })
       } 
      //  else {
      //   this.getPODocId(this.po_num);
      //  }
        this.manpower_metadata = this.dataService?.grn_manpower_metadata?.headerFields;
        if (this.client_name == 'Cenomi' && this.router.url.includes('Create_GRN_inv_list')) {
          if (this.manpower_metadata?.length < 1) {
            this.manpowerMetadataFunction();
          } else {
            this.createTimeSheetDisplayData('old');
          }
        }
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
    this.inputDisplayArray = [];
    // this.lineData = [];
    let serviceName;
    if (this.Itype == 'PO' || this.Itype == 'GRN' || this.Itype == 'Service' || this.dataService.documentType == 'advance invoice' || this.dataService.documentType == 'non-po' || this.dataService.documentType == 'credit note' && !this.mappingForCredit) {
      this.pageType = "normal";
      serviceName = this.SharedService;
    } else {
      this.pageType = "mapping";
      serviceName = this.exceptionService;
    }
    serviceName?.getInvoiceInfo().subscribe(
      (data: any) => {
        let response;
        this.lineData = data?.linedata;
        if (serviceName == this.SharedService) {
          response = data?.ok
        } else {
          response = data;
        }
        if (response?.uploadtime) {
          this.uploadtime = response?.uploadtime;
        }
        if (response.doc_type) {
          this.docType = response?.doc_type?.toLowerCase();
          this.documentType = response?.doc_type?.toLowerCase();
        }

        this.getInvTypes();
        // this.lineDataConversion();
        if (this.pageType == "mapping") {
          this.calculateCost();
        }
        // this.po_total = response.po_total;
        const pushedArrayHeader = [];
        // if(data?.ok?.cost_alloc != null){
        //   this.normalCostAllocation = true;
        data?.ok?.cost_alloc?.forEach(cost => {
          let merge = { ...cost.AccountCostAllocation }
          this.costAllocation.push(merge);
        })

        // }
        // else{
        this.normalCostAllocation = false;
        data?.ok?.dynamic_cost_alloc?.forEach(dynamic => {
          this.dynamicdata.push(dynamic);
          this.totalTaxDynamic = this.totalTaxDynamic + Number(dynamic?.calculatedtax);
          this.totalAmountDynamic = this.totalAmountDynamic + Number(dynamic?.amount);
        })
        // }
        response?.headerdata?.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element?.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        this.temp_header_data = response?.headerdata?.slice();
        this.isMoreRequired = response?.approverData?.more_info_required;

        if (response?.approverData?.to_approve_by) {
          let ap_id = response?.approverData?.to_approve_by[0];
          if (ap_id == this.SharedService.userId) {
            this.isAprUser = true;
          }
        }

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
        let vendorData;
        if (this.pageType == 'normal') {
          vendorData = response?.vendordata;
          if (this.Itype == 'PO') {
            let count = 0;
            let array = data?.ok?.linedata;
            array.forEach((val) => {
              if (val.TagName == 'LineNumber') {
                val.id = 1;
              } else if (val.TagName == 'ItemId') {
                val.id = 2;
              } else if (val.TagName == 'Name') {
                val.id = 3;
              } else if (val.TagName == 'ProcurementCategory') {
                val.id = 4;
              } else if (val.TagName == 'PurchQty') {
                val.id = 5;
              } else if (val.TagName == 'UnitPrice') {
                val.id = 6;
              } else if (val.TagName == 'DiscAmount') {
                val.id = 7;
              } else if (val.TagName == 'DiscPercent') {
                val.id = 8;
              } else {
                count = count + 9;
                val.id = count;
              }
            });
            this.lineDisplayData = array.sort((a, b) => a.id - b.id);
          } else {
            this.lineDisplayData = data.ok.linedata;
            if (this.isDesktop) {
              this.lineDisplayData.unshift({
                TagName: 'S.No',
                idDocumentLineItemTags: 1,
              });

            } else {
              // Get the maximum number of linedata entries across all tags
              const maxLinedataEntries = Math.max(...this.lineDisplayData.map(tag => tag.linedata.length));

              // Iterate through the index of linedata entries
              for (let dataIndex = 0; dataIndex < maxLinedataEntries; dataIndex++) {
                const transformedData: any = [];
                let hasError = false;
                let hasUpdated = false;

                // Iterate through the received data
                this.lineDisplayData.forEach(tag => {
                  const tagName = tag.TagName;
                  const linedata = tag.linedata[dataIndex];
                  const itemData = linedata.DocumentLineItems;

                  // Check if any isError is 1
                  if (itemData.isError === 1) {
                    hasError = true;
                  }
                  if (itemData.IsUpdated === 1) {
                    hasUpdated = true;
                  }

                  // Create an object with the TagName and linedata for the current index
                  const tagObject = {
                    TagName: tagName,
                    linedata: linedata
                  };

                  // Add the tagObject to the transformedData array
                  transformedData.push(tagObject);
                });
                transformedData.hasError = hasError;
                transformedData.hasUpdated = hasUpdated;
                // Add the transformedData array for the current index to the main array
                this.linedata_mobile.push(transformedData);
              }
            }
            if (this.editable && !this.fin_boolean) {
              this.lineDisplayData.push({
                TagName: 'Actions',
                idDocumentLineItemTags: 1,
              });
            }
            this.inv_line_total = 0;
            this.lineDisplayData.forEach((ele) => {
              if (ele.TagName == 'S.No') {
                ele.linedata = this.lineDisplayData[2]?.linedata;
              } else if (ele.TagName == 'Actions') {
                ele.linedata = this.lineDisplayData[2]?.linedata;
              }
              if (ele.TagName == 'AmountExcTax') {
                ele.linedata.forEach(ele => {
                  this.inv_line_total = this.inv_line_total + parseFloat(ele.DocumentLineItems.Value);
                })
              }
            });
          }
        } else {
          vendorData = response?.Vendordata;
          this.lineDisplayData = response.linedata.Result;
          this.temp_line_data = JSON.parse(JSON.stringify(response.linedata.Result));
          this.lineDisplayData.forEach((element, index, arr) => {
            this.lineCount = arr[0].items
            if (element.tagname == 'Description') {
              element.order = 1;
            } else if (element.tagname == 'Quantity') {
              element.order = 2;
            } else if (element.tagname == 'UnitPrice') {
              element.order = 3;
            } else if (element.tagname == 'Unit') {
              element.order = 4;
            } else if (element.tagname == 'Discount') {
              element.order = 5;
            } else if (element.tagname == 'AmountExcTax') {
              element.order = 6;
            }
          });
          this.lineDisplayData = this.lineDisplayData.sort((a, b) => a.order - b.order);
        }
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
          this.SpinnerService.hide();
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
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
    if(!this.isServiceData){
      this.inputData.forEach(ele => {
        if (ele.TagLabel == 'VendorName') {
          ele.order = 1
        } else if (ele.TagLabel == 'VendorAddress') {
          ele.order = 2
        } else if (['PurchaseOrder', 'PurchId', 'POHeaderId'].includes(ele.TagLabel)) {
          ele.order = 3
          this.po_num = ele?.Value;
        } else if (['InvoiceId', 'bill_number'].includes(ele.TagLabel)) {
          this.invoiceNumber = ele?.Value;
          ele.order = 4
        } else if (ele.TagLabel == 'InvoiceTotal') {
          ele.order = 5
        } else if (ele.TagLabel == 'InvoiceDate') {
          ele.order = 6
        } else if (ele.TagLabel == 'TotalTax') {
          ele.order = 7
        } else if (ele.TagLabel == 'SubTotal') {
          ele.order = 8
          this.invoice_subTotal = ele?.Value;
        } else if (ele.TagLabel == 'PaymentTerm') {
          ele.order = 9
        } else if (ele.TagLabel == 'TRN') {
          ele.order = 10
        } else if (ele.TagLabel == 'DueDate') {
          ele.order = 11
        }
      })
    } else {
      this.inputData.forEach(ele => {
        let tag = ele.TagLabel.toLowerCase();
        if (tag == 'company name') {
          ele.order = 1
        } else if (tag.includes('customer po box')) {
          ele.order = 2
        } else if (tag == 'bill number') {
          ele.order = 3
        } else if (tag.includes('customer trn')) {
          ele.order = 4
        } else if (tag == 'bill issue date') {
          ele.order = 5
        } else if (tag == 'account number') {
          ele.order = 6
        } else if (tag == 'bill period') {
          ele.order = 7
        } 
      })
    }
    // Separate items with and without the 'order' key
    const withOrder = this.inputData.filter(item => item.hasOwnProperty('order'));
    const withoutOrder = this.inputData.filter(item => !item.hasOwnProperty('order'));

    // Sort the items with 'order' by their 'order' value
    withOrder.sort((a, b) => a.order - b.order);

    // Concatenate the sorted items with 'order' and those without 'order'
    this.inputData = withOrder.concat(withoutOrder);
  }

  readGRNInvData() {
    this.SharedService.readReadyGRNInvData().subscribe(
      (data: any) => {
        this.lineDisplayData = data.ok?.linedata;
        this.grnLineCount = this.lineDisplayData[0]?.linedata;
        let dummyLineArray = this.lineDisplayData;
        dummyLineArray.forEach((ele, i, array) => {
          if (ele.TagName == 'Quantity') {
            ele.TagName = 'Inv - Quantity';
            ele.linedata?.forEach((ele2, index) => {
              this.validatePOInvUnit.push({ invoice_itemcode: ele2?.invoice_itemcode })
              if (ele.linedata?.length <= ele.grndata?.length) {
                ele.grndata?.forEach((ele3) => {
                  ele.grndata[index].old_value = ele2?.Value;
                });
              }
            });
          } else if (ele.TagName == 'UnitPrice') {
            ele.TagName = 'Inv - UnitPrice';
          } else if (ele.TagName == 'Description' || ele.TagName == 'Name') {
            if (ele.linedata?.length > 0) {
              this.descrptonBool = true;
            }
          }
          if (ele.TagName == 'AmountExcTax') {
            ele.TagName = 'Inv - AmountExcTax';
            ele.linedata.forEach(v => {
              this.GRN_line_total = this.GRN_line_total + Number(v.Value)
            })
          }

          setTimeout(() => {
            if (
              ele.TagName == 'Inv - Quantity' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(2, 0, {
                TagName: 'GRN - Quantity',
                linedata: ele.linedata,
              });
              array.splice(7, 0, {
                TagName: 'Comments',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - Quantity' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(2, 0, {
                TagName: 'GRN - Quantity',
                linedata: ele.grndata,
              });
              array.splice(7, 0, {
                TagName: 'Comments',
                linedata: ele.grndata,
              });
              let poQty = [];
              let poBalQty = [];
              ele.podata.forEach((v) => {
                if (v.TagName == 'PurchQty') {
                  poQty.push(v);
                } else if (v.TagName == 'RemainInventPhysical') {
                  poBalQty.push(v);
                }
              });
              if (poQty.length > 0) {
                array.splice(8, 0, { TagName: 'PO quantity', linedata: poQty });
                // array.splice(9, 0, {
                //   TagName: 'PO balance quantity',
                //   linedata: poBalQty,
                // });
              }
            } else if (
              ele.TagName == 'Inv - UnitPrice' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(4, 0, {
                TagName: 'GRN - UnitPrice',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - UnitPrice' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(4, 0, {
                TagName: 'GRN - UnitPrice',
                linedata: ele.grndata,
              });
            } else if (
              ele.TagName == 'Inv - AmountExcTax' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(6, 0, {
                TagName: 'GRN - AmountExcTax',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - AmountExcTax' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(6, 0, {
                TagName: 'GRN - AmountExcTax',
                linedata: ele.grndata,
              });
            }
          }, 10);
        });
        this.lineDisplayData = dummyLineArray;
        this.getInvTypes();
        setTimeout(() => {
          this.lineDisplayData = this.lineDisplayData.filter((v) => {
            return !(
              v.TagName == 'Inv - AmountExcTax'
            );
          });
        }, 100);
        let arr = dummyLineArray;
        setTimeout(() => {
          arr.forEach((ele1) => {
            if (ele1.TagName.includes('GRN') || ele1.TagName == 'Description') {
              this.GRNObject.push(ele1.linedata);
            }
            if (ele1.TagName == 'GRN - Quantity') {
              ele1.linedata?.forEach((el) => {
                el.is_quantity = true;
              });
            }
            this.GRNObject = [].concat(...this.GRNObject);
          });
          this.GRNObject.forEach((val) => {
            if (!val.old_value) {
              val.old_value = val.Value;
            }
          });
        }, 100);

        const pushedArrayHeader = [];
        data.ok.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        let inv_num_data: any = this.inputData.filter(val => {
          return val.TagLabel == 'InvoiceId';
        })
        this.invoiceNumber = inv_num_data[0]?.Value;
        let po_num_data = this.inputData.filter((val) => {
          return (val.TagLabel == 'PurchaseOrder');
        });
        this.headerDataOrder();
        this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        this.vendorData = {
          ...data.ok.vendordata[0].Vendor,
          ...data.ok.vendordata[0].VendorAccount,
        };
        this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.vendorData['VendorName'];
        this.vendorId = this.vendorData['idVendor'];
        // this.selectedRule = data.ok.ruledata[0].Name;
        // this.poList = data.all_pos;
        if (this.router.url.includes('GRN_approvals')) {
          let index = this.lineDisplayData.findIndex(tag => tag.TagName == 'Inv - Quantity');
          this.lineDisplayData.splice(index, 1)
        }
        this.isGRNDataLoaded = true;
        setTimeout(() => {
          // document.getElementById('grnTable').style.display = 'block';
          this.SpinnerService.hide();
        }, 4000);

      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  readFilePath() {
    this.showInvoice = '';
    this.SpinnerService.show();
    this.exceptionService.readFilePath().subscribe(
      (data: any) => {
        this.content_type = data?.content_type;
        if (data.filepath && data.content_type == 'application/pdf') {
          this.isPdfAvailable = false;
          this.isImgBoolean = false;
          this.byteArray = new Uint8Array(
            atob(data.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: 'application/pdf' })
          );
        } else if (data.content_type == 'image/jpg' || data.content_type == 'image/png') {
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
        } else {
          this.isPdfAvailable = true;
          this.showInvoice = '';
        }
        // this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
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

  onChangeValue(key, value, data) {
    if (key == 'InvoiceTotal' || key == 'SubTotal') {
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true;
      } else {
        this.isAmtStr = false;
      }
    }
    let updateValue = {
      documentDataID: data.idDocumentData,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }
  onChangeLineValue(key, value, data) {
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
      documentLineItemID: data?.idDocumentLineItems,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }

  saveChanges() {
    if (!this.isAmtStr && !this.isEmpty) {
      if (this.updateInvoiceData.length != 0) {
        this.SharedService.updateInvoiceDetails(this.updateInvoiceData
        ).subscribe(
          (data: any) => {
            this.success('Changes saved successfully')
            this.updateInvoiceData = [];
          },
          (err) => {
            this.updateInvoiceData = [];
            this.error("Server error or Please check the data");
          }
        );
      }
    } else {
      this.updateInvoiceData = [];
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

  approveChangesBatch() {
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
      this.inputData.forEach((data: any) => {
        if (data.TagLabel == 'InvoiceTotal' || data.TagLabel == 'SubTotal') {
          if (data.Value == '' || isNaN(+data.Value)) {
            count++;
            errorTypeHead = 'AmountHeader';
          }
        } else if (['PurchaseOrder', 'InvoiceDate', 'InvoiceId'].includes(data.TagLabel)) {
          if (data.Value == '') {
            count++;
            errorType = 'emptyHeader';
          }
        }
      });

      this.lineDisplayData.forEach((element) => {
        if (
          ['Quantity', 'UnitPrice', 'AmountExcTax', 'Amount'].includes(element.tagname)
        ) {
          element.items.forEach((ele) => {
            ele.linedetails.forEach((ele1) => {
              if (
                ele1.invline[0]?.DocumentLineItems?.Value == '' ||
                isNaN(+ele1.invline[0]?.DocumentLineItems?.Value)
              ) {
                count++;
                errorTypeLine = 'AmountLine';
              }

              if (element.tagname == 'Quantity') {
                if (
                  ele1.invline[0]?.DocumentLineItems?.Value == 0
                ) {
                  count++;
                  errorTypeLine = 'quantity';
                }
              }
            });
          });
        }
      });
      if (count == 0) {
        this.uploadCompleted = true;
        // this.sendToBatch();
        if (!this.isServiceData) {
          this.vendorSubmit();
        } else {
          this.serviceSubmit();
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
  serviceSubmit() {
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
    this.SharedService.serviceSubmit().subscribe((data: any) => {
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.poList.length; i++) {
      let country = this.poList[i];
      if (
        country.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredPO = filtered;
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
    });
  }
  filterPOLine(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.lineItems.length; i++) {
      let item = this.lineItems[i];
      if (
        item.Value.toLowerCase().includes(query.toLowerCase())
      ) {
        filtered.push(item);
      }
    }
    this.filteredPOLine = filtered;
  }
  readErrorTypes() {
    this.exceptionService.readErrorTypes().subscribe((data: any) => {
      this.givenErrors = data.description;
    });
  }

  lineMapping(val, el, val1) {
    let itemCodeArray = [];
    let presetBoolean: boolean = false;

    this.inv_itemcode = val;
    this.po_itemcode = el;
    this.updateLine();
    // if (itemCodeArray.length > 1) {
    //   presetBoolean = itemCodeArray.includes(el);
    // }
    // if (this.mappedData?.length > 0) {
    //   let presetArray = this.mappedData?.filter((ele1) => {
    //     return ele1.ItemMetaData?.itemcode == el;
    //   });
    //   if (presetArray.length > 0) {
    //     presetBoolean = true;
    //   }
    // }
    // if (presetBoolean) {
    //   if (confirm('Lineitem already mapped, you want to change it again')) {
    //     this.displayErrorDialog = true;
    //   }
    // } else {
    //   itemCodeArray.push(el);
    //   this.displayErrorDialog = true;
    // }
  }

  cancelSelectErrorRule() {
    this.displayErrorDialog = false;
  }

  updateLine() {
    this.exceptionService
      .updateLineItems(
        this.inv_itemcode,
        this.po_itemcode,
        1,
        this.vendorAcId
      )
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
  onChangeGrn(lineItem, val) {
    const po_qty_value = this.po_qty_array?.linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems)?.Value;
    const po_balance_qty_value = this.po_balance_qty_array?.linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems)?.Value;

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
      this.lineDisplayData.find(data => data.TagName == 'GRN - Quantity').linedata.find(data => data.idDocumentLineItems === lineItem.idDocumentLineItems).Value = lineItem.old_value;
      this.error(`GRN Quantity cannot be greater than ${error_msg}`);
      this.grnTooltip = `GRN Quantity cannot be greater than ${error_msg}`;
      this.disable_save_btn = true;
      return;
    }
    if (this.GRN_PO_Bool) {
      this.updateAmountExcTax(lineItem, val, 'UnitPrice', 'AmountExcTax', 'idDocumentLineItems');
    } else {
      this.onChangeLineValue('Quantity', val, lineItem);
      this.updateAmountExcTax(lineItem, val, 'GRN - UnitPrice', 'GRN - AmountExcTax', 'invoice_itemcode');
    }
  }
  updateAmountExcTax(lineItem, newQuantity: number, TagName_u, TagName_a, field) {
    if (lineItem) {
      const unitPrice = this.lineDisplayData.find(item => item.TagName == TagName_u)
        .linedata.find(data => data[field] === lineItem[field]);
      const amountExcTax = (Number(unitPrice.Value) * newQuantity).toFixed(2);
      const amountExcTaxItem = this.lineDisplayData.find(item => item.TagName == TagName_a)
        .linedata.find(data => data[field] === lineItem[field]);

      if (amountExcTaxItem) {
        amountExcTaxItem.Value = amountExcTax;
        amountExcTaxItem.ErrorDesc = "Quantity changed";
      }
      this.GRN_line_total = 0;
      this.lineDisplayData.forEach(ele => {
        if (ele.TagName == TagName_a) {
          ele.linedata.forEach(v => this.GRN_line_total = this.GRN_line_total + Number(v.Value))
        }
      })
    }
  }

  deleteGrnLine(id) {
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to delete this line?', 'confirmation', 'Confirmation')
    drf.afterClosed().subscribe((bool:boolean) => {

      if (bool) {
        this.SpinnerService.show();
        this.lineDisplayData = this.lineDisplayData.map(record => {
          const newLinedata = record.linedata.filter(obj => obj?.idDocumentLineItems !== id);
          return { ...record, linedata: newLinedata };
        });
        this.GRN_line_total = 0;
        this.lineDisplayData.forEach(ele => {
          if (ele.TagName == "AmountExcTax") {
            ele.linedata.forEach(v => this.GRN_line_total = this.GRN_line_total + Number(v.Value))
          }
        })
        this.GRNObject = this.GRNObject.filter(val => {
          return val?.idDocumentLineItems != id
        })
        this.grnLineCount = this.lineDisplayData[0]?.linedata;
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
    const GRNQtyArr = this.lineDisplayData.find(item=> item.TagName === 'GRN - Quantity');
    let validationBool = GRNQtyArr?.linedata?.some(el=> el.Value == '' ||  el.Value == undefined);
    if (validationBool) {
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
            // if (this.invoiceNumber) {
            this.grnDuplicateCheck(boolean);
            // } else {
            //   this.error("Dear user, please add the invoice number.");
            // }
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

  createGRNWithPO(bool) {
    // bool = bool ? 'false' : 'true';
    this.SpinnerService.show();
    let inv_number = '';
    if (this.invoiceNumber) {
      inv_number = `&inv_num=${this.invoiceNumber}`;
    }
    let manPower = '';
    if (this.manpowerHeaderId && this.dataService.isEditGRN) {
      manPower = `&ManPowerHeaderId=${this.manpowerHeaderId}&isdraft=${this.isDraft}&grn_doc_id=${this.invoiceID}`;
    } else if(this.manpowerHeaderId && !this.dataService.isEditGRN){
      manPower = `&ManPowerHeaderId=${this.manpowerHeaderId}&isdraft=${this.isDraft}`;
    } else if(!this.manpowerHeaderId && this.dataService.isEditGRN){
      manPower = `&isdraft=${this.isDraft}&grn_doc_id=${this.invoiceID}`;
    }
    if(this.isManpowerTags && !this.manpowerHeaderId && this.manPowerAPI_request){
      this.SpinnerService.hide();
      return;
    }
    this.SharedService.createGRNWithPO(inv_number, manPower, this.GRNObjectDuplicate).subscribe((data: any) => {
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

    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })

  }

  grnDuplicateCheck(boolean) {
    if (this.GRNObjectDuplicate.length > 0) {
      let arr = [];
      this.GRNObjectDuplicate.forEach((ele) => {
        ele.Value = ele?.Value?.toString()
        if (this.router.url.includes("GRN_approvals")) {
          if (ele.is_quantity) {
            let obj = {
              line_id: ele.invoice_itemcode,
              quantity: ele.Value
            }
            arr.push(obj)
          }
        } else {
          if (ele.tagName == 'Quantity') {
            let obj = {
              line_id: ele.idDocumentLineItems,
              quantity: ele.Value
            }
            arr.push(obj)
          }
        }

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
                this.createGRNWithPO(boolean);
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
    } else {
      alert('There are no lines to create GRN, if you are able to see the lines then please check the quantity');
      this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
    }
  }
  CreateGRNAPI(boolean, txt) {
    if (this.validateUnitpriceBool) {
      if (confirm("Invoice 'unit-price' is not matching with PO. Do you want to proceed?")) {
        this.grnAPICall(boolean, txt);
      }
    } else {
      this.grnAPICall(boolean, txt);
    }
  }

  grnAPICall(boolean, txt) {
    this.SpinnerService.show();
    this.SharedService.saveGRNData(
      boolean, this.GRNObject
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
    this.SharedService.validateUnitprice(this.validatePOInvUnit).subscribe((data: any) => {
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
          const response = this.prepare_api_request(resp.data);
          this.manPowerAPI_request.data = response;
          this.manPowerGRNData = resp.data;
          let grnQuantity = resp.data.find(el => el.TagName == 'GRN - Quantity');
          this.lineDisplayData = this.lineDisplayData.map(el => {
            if (el.TagName == 'GRN - Quantity') {
              el.linedata.forEach(ele => {
                grnQuantity.linedata.forEach(res => {
                  if (ele.LineNumber == res.LineNumber) {
                    this.onChangeGrn(ele, res.Value);
                    ele.Value = res.Value;
                  }
                })
              })
            }
            return el;
          })
          this.SpinnerService.hide();
        }
        this.SpinnerService.hide();
      })
    }
  }

  prepare_api_request(inputData) {
    this.saveDisabled = false;
    let shiftData = [];

    // Organize shift data for each LineNumber
    let shiftsByLineNumber = {};
    inputData.forEach(item => {
      if (item.TagName === "Number of Shifts" || item.TagName === "Shift") {
        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          const shift = line.Value;

          if (!shiftsByLineNumber[lineNumber]) {
            shiftsByLineNumber[lineNumber] = {};
          }

          // Associate the shift with the corresponding idDocumentLineItems for this line
          shiftsByLineNumber[lineNumber][line.idDocumentLineItems] = shift;
        });
      }
    });
    // Gather quantities by date for each LineNumber and shift
    let quantitiesByLineNumberAndShift = {};
    inputData.forEach(item => {
      if (!['Description', 'PO Qty', 'GRN - Quantity', 'Number of Shifts', 'Shift', 'Monthly quantity','PO Balance Qty'].includes(item.TagName)) {
        const date = item.TagName;

        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          if(line.Value == '' || line.Value == undefined){
            this.saveDisabled = true;
          }
          const value = parseFloat(line.Value);
          
          const idDocumentLineItems = line.idDocumentLineItems;

          // Check if there is a shift associated with this idDocumentLineItems for the current lineNumber
          const shift = shiftsByLineNumber[lineNumber]?.[idDocumentLineItems];

          if (shift) {
            // Ensure data structure exists for the current shift and line number
            if (!quantitiesByLineNumberAndShift[lineNumber]) {
              quantitiesByLineNumberAndShift[lineNumber] = {};
            }

            if (!quantitiesByLineNumberAndShift[lineNumber][shift]) {
              quantitiesByLineNumberAndShift[lineNumber][shift] = [];
            }

            // Add the date and quantity to the correct shift
            quantitiesByLineNumberAndShift[lineNumber][shift].push({
              date: date,
              quantity: value
            });
          } 
        });
      }
    });

    // Gather durationmonth from linedisplaydata
    let durationByLineNumber = {};
    this.lineDisplayData.forEach(item => {
      if (item.TagName == "Duration in months") {
        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          const idDocumentLineItems = line.idDocumentLineItems;
          const duration = line.Value; 
          if (!durationByLineNumber[lineNumber]) {
            durationByLineNumber[lineNumber] = {};
          }

          durationByLineNumber[lineNumber][idDocumentLineItems] = parseInt(duration, 10); // Store the duration as integer
        });
      }
    });

    // Prepare the result in the desired format
    Object.keys(quantitiesByLineNumberAndShift).forEach(lineNumber => {
      Object.keys(quantitiesByLineNumberAndShift[lineNumber]).forEach(shift => {
        const durationmonth = durationByLineNumber[lineNumber][lineNumber] || null;

        shiftData.push({
          itemCode: lineNumber,
          shift: shift,
          quantity: JSON.stringify(quantitiesByLineNumberAndShift[lineNumber][shift]),
          durationmonth: durationmonth
        });
      });
    });

    return shiftData;
  }

  createTimeSheetDisplayData(str) {
    this.dataService.GRN_PO_Data.forEach(ele => {
      this.manpower_metadata.forEach(meta => {
        if (ele.LineNumber == meta.itemCode) {
          ele.durationMonth = meta.durationMonth || "NA";
          ele.isTimesheets = str == "new" ? meta.isTimesheets : true;
          ele.shifts = meta.shifts || "NA";

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
    
    this.exceptionService.createTimesheet(this.SharedService.po_doc_id,this.manPowerAPI_request, 'po').subscribe((data: any) => {
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
    this.GRN_PO_tags = this.GRN_PO_tags.filter((tag) => tag.linedata = []);
    if(this.GRN_PO_tags.filter(tag => tag.TagName == 'Duration in months').length == 0) {
      this.GRN_PO_tags.splice(5, 0, { TagName: 'Duration in months', linedata: [] }, { TagName: 'Monthly quantity', linedata: [] }, { TagName: 'Is Timesheets', linedata: [] }, { TagName: 'Number of Shifts', linedata: [] })
    }
  }
  open_dialog(str) {
    if (str == 'reject') {
      this.rejectModalHeader = 'ADD Rejection Comments';
      this.getApprovedUserList();
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
    this.exceptionService.checkItemCode(item).subscribe((data: any) => {
      if (data.status == "not exists") {
        let addLineData = {
          "documentID": this.invoiceID,
          "itemCode": item
        };
        this.exceptionService.addLineItem(addLineData).subscribe((data: any) => {
          this.success("Line item Added")

          this.getInvoiceFulldata('');
        });
        this.displayrejectDialog = false;
      } else {
        this.error("Item code already exists, Please try with another item code.");
      }
    }, err => {
      this.error("Server error");
      this.displayrejectDialog = false;
    })
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
    this.updateInvoiceData = [];
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
    let filtered: any[] = [];
    let query = event.query;
    if (this.poNumbersList?.length > 0) {
      for (let i = 0; i < this.poNumbersList?.length; i++) {
        let PO: any = this.poNumbersList[i];
        if (PO.PODocumentID.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
        this.filteredPO = filtered;
      }
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
    this.updateInvoiceData = [];
    let po_num_text = document.getElementById(id).innerHTML;
    let po_num = po_num_text.trim();
    this.poDate = this.poNumbersList.filter((val) => {
      return val.Document.PODocumentID == po_num
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
      documentDataID: this.searchPOArr.idDocumentData,
      OldValue: this.searchPOArr.Value || '',
      NewValue: this.SharedService.po_num,
    };
    this.updateInvoiceData.push(updateValue);
    this.saveChanges();
    this.progressDailogBool = false;
    setTimeout(() => {
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
    this.uploadSupport();
  }
  onSelectFile(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadFileList.push(event.target.files[i]);

    }
  }
  removeUploadQueue(index) {
    this.uploadFileList.splice(index, 1);
  }

  uploadSupport() {
    this.progress = 1;
    const formData: any = new FormData();
    for (const file of this.uploadFileList) {
      const cleanedFileName = file.name.replace(/\.(?=.*\.)/g, '');
      formData.append('files', file, cleanedFileName);
    }
    this.SpinnerService.show()
    this.SharedService.uploadSupportDoc(formData)
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.entityList?.length; i++) {
      let country = this.entityList[i];
      if (
        country.EntityName.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredEnt = filtered;
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.POlist_LCM?.length; i++) {
      let country = this.POlist_LCM[i];
      if (
        country.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredPO = filtered;
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.LCMItems?.length; i++) {
      let country = this.LCMItems[i];
      if (
        country.PoLineDescription.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredLCMLines = filtered;
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.chargeList?.length; i++) {
      let country = this.chargeList[i];
      if (
        country.MarkupCode.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredCost = filtered;
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
      this.allocateTotal = sum.toFixed(2);
      let bal: any = Number(this.invoiceTotal) - this.allocateTotal;
      this.balanceAmount = parseFloat(bal).toFixed(2);
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

    const unitPriceObject = this.lineData?.Result?.find(obj => obj?.tagname === "UnitPrice");
    const quantityObject = this.lineData?.Result?.find(obj => obj?.tagname === "Quantity");
    // console.log(unitPriceObject)
    if (unitPriceObject && quantityObject) {

      const unitPriceData = unitPriceObject?.items;
      const quantityData = quantityObject?.items;

      let totalpoCost = 0;
      let totalinvCost = 0;
      for (let i = 0; i < unitPriceData?.length; i++) {
        const pounitPrice = parseFloat(unitPriceData[i]?.linedetails[0]?.poline[0]?.Value);
        const poquantity = parseInt(quantityData[i]?.linedetails[0]?.poline[0]?.Value);

        const invunitPrice = parseFloat(unitPriceData[i]?.linedetails[0]?.invline[0]?.DocumentLineItems?.Value);
        const invquantity = parseInt(quantityData[i]?.linedetails[0]?.invline[0]?.DocumentLineItems?.Value);

        if (!isNaN(pounitPrice) && !isNaN(poquantity)) {
          totalpoCost += pounitPrice * poquantity;
        }
        if (!isNaN(invunitPrice) && !isNaN(invquantity)) {
          totalinvCost += invunitPrice * invquantity;
        }
      }
      this.po_total = totalpoCost;
      this.totalInvCost = totalinvCost;
      // console.log("Total Cost:", totalpoCost);
    } else {
      console.log("UnitPrice or Quantity data not found.");
    }
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
    // let amount_old;
    // let amt_line_id;
    // let ad_line_id;
    // let ad_percent_old;
    // let prev_value_amt;
    // let prev_value_ad;
    // this.lineDisplayData.forEach(tag=>{
    //   if(tag.TagName == 'AmountExcTax'){
    //     prev_value_amt = data.Value.toString();
    //     tag.linedata.forEach(ele=>{
    //       if(ele.DocumentLineItems.itemCode == data.itemCode){
    //         amount_old = ele.DocumentLineItems.Value;
    //         amt_line_id = ele.DocumentLineItems.idDocumentLineItems;
    //       }
    //     })
    //   }
    //   if(tag.TagName == 'AdvancePercent'){
    //     prev_value_ad = data.Value.toString();
    //     tag.linedata.forEach(ele=>{
    //       if(ele.DocumentLineItems.itemCode == data.itemCode){
    //         ad_percent_old = ele.DocumentLineItems.Value;
    //         ad_line_id = ele.DocumentLineItems.idDocumentLineItems;
    //       }
    //     })
    //   }
    // })
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
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < arr?.length; i++) {
      let str = arr[i];
      if (
        str.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(str);
      }
    }
    this.filteredPreData = filtered;
  }
  onSelectPrePay(event, value, tagname, index) {
    let old_value
    this.temp_line_data.forEach(tag => {
      if (tag.tagname == tagname) {
        old_value = tag.items[index].linedetails[0].invline[0].DocumentLineItems.Value
      }
    })
    let obj = {
      tag_id: value.idDocumentLineItems,
      tag_name: tagname,
      prev_value: old_value,
      curr_value: event,
    }
    this.exceptionService.savePreData(obj).subscribe((data: any) => {
      this.success('Changes saved successfully')
    }, err => {
      this.error("Server error or Please check the data");
    })
  }

  filterProject(event, tag) {
    let arr = [];
    this.SpinnerService.show();
    if (tag == 'Project') {
      arr = this.projectIdArr;
    } else {
      arr = this.projectCArr;
    }
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < arr?.length; i++) {
      let str = arr[i];
      if (
        str.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(str);
      }
    }
    this.filteredProject = filtered;
    this.SpinnerService.hide();
  }

  onSelectProject(event, value) {
    let old_val: any = this.temp_header_data.filter(el => value.idDocumentData == el?.DocumentData?.idDocumentData);
    let obj = {
      tag_id: value.idDocumentData,
      tag_name: value.TagLabel,
      prev_value: old_val[0]?.DocumentData?.Value,
      curr_value: event,
    }
    this.exceptionService.saveProjectData(obj).subscribe((data: any) => {
      this.success('Changes saved successfully')
    }, err => {
      this.error("Server error or Please check the data");
    })
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
    console.log(data)
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
    delete this.dataService.grn_manpower_metadata;
    delete this.dataService.manpowerResponse
    this.mat_dlg.closeAll();
    this.dataService.isEditGRN = false;
  }
}
