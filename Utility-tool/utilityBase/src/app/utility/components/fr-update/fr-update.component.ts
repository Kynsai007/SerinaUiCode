import { NgForm } from '@angular/forms';
import { SharedService } from './../../../services/shared/shared.service';
import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MobmainService } from './mob/mobmain/mobmain.service';
import * as fileSaver from 'file-saver';
import { FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-fr-update',
  templateUrl: './fr-update.component.html',
  styleUrls: ['./fr-update.component.scss']
})
export class FrUpdateComponent implements OnInit,AfterContentInit {
  @ViewChild("outlet", {read: ViewContainerRef}) outletRef: ViewContainerRef;
  @ViewChild("content", {read: TemplateRef}) contentRef: TemplateRef<any>;
  vendorData: any;
  vendorName: any;
  checkselect:boolean=false;
  displayAddTemplateDialog: boolean;
  vendorAccountList = [];
  currencies = [];
  languages = [];
  decimal_sep = [];
  select_vendorAccount: any;
  templateName: string;
  modaladderr:boolean=false;
  FRConfigData: any;
  trainingResult: any;
  testingResult:any;
  FRMetaData: any;
  modalList: any[] = [];
  allsynonyms: any;
  msg:string = "Drag and drop an HTML File";
  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });
  public hasBaseDropZoneOver: boolean = false;
  uploading: boolean = false;
  selected_template: string;
  docFormats = ['pdf,jpg,png,jpeg','html']
  selectedDocFormat = "pdf,jpg,png,jpeg";
  dateFormats = ['mm/dd/yy', 'mm/dd/yyyy', 'mm.dd.yy', 'mm.dd.yyyy','dd/mm/yy','dd-mm-yy','dd-mm-yyyy','dd.mm.yyyy','dd-mmm-yy','dd-mmm-yyyy','yyyy mm dd','mmm-dd-yyyy','dd/mm/yyyy','dd mmm yyyy','mmm dd yyyy','yyyy/mm/dd']
  enableTabsBoolean: boolean = false;
  enableMetaDataBoolean: boolean = false;
  sasExpiry:any;
  modelData: any;
  saving:boolean = false;
  frLoadBoolean:boolean;
  downloading:boolean = false;
  htmluploaded:boolean= false;
  rulesData: any;
  filterdRules:any;
  amountRulesData:any;
  currentTemplate: any;
  FolderPath:string="";
  showCheckboxHeaderDiv: boolean ;
  showCheckboxLineDiv: boolean ;
  headerTags = [];
  trainingAverageAccuracy:string="0 %";
  testingAverageAccuracy:string="0 %";
  headerArray =[];
  headerMandetory =[];
  headerOptionalArray =[];
  headerOptTags=[];
  headerStr:string;
  accuracyScore:any;
  trainingFields=[];
  testingFields={};
  LineTags = []
  LineArray =[];
  Linestr: string;
  lineMandetory=[];
  LineOptTags=[];
  LineArrayOptinal = [];
  templateKeys:any;
  showCheckboxOptHeaderDiv: boolean;
  showCheckboxLineOptDiv:boolean;
  selectErpRule:any;
  selectedVendorType = '';
  vendorTypeData = [
    {value :'PO based', id:1},
    {value :'Non-PO based', id:2},
  ];
  GRN_TYPE = [
    {value :'Manual', id:1, disabled: false, selected: true},
    {value :'ERP', id:2, disabled: false, selected: false},
  ]
  selectedRuleId:any;
  fieldscount:number = 0;
  fieldsaccuracy:number = 0;
  fieldsaccavg:string = "0.0 %";
  selectedGRNType:any;
  batchBoolean: any;
  isPObasedVendor: boolean;
  selecteddocType:string="";
  trnMandatoryValue: Number = 1;
  trnboolean: boolean = true;
  switchLabel:string = "Yes";
  documentCount:number = 0;
  showRule:boolean=true;
  @ViewChild('updateMetaData')
  updateMetaData:NgForm;
  instanceData:any;

  constructor(private sharedService: SharedService,
    private messageService : MessageService,
    private router:Router,
    private mobservice:MobmainService,
    private _location: Location) { 
      this.decimal_sep = [{"value":".","display":"Dot"},{"value":",","display":"Comma"}]
      this.currencies = [ 
        {"currency":"AED",
        "description":"United Arab Emirates Dirham"},
        {"currency":"AFN",
        "description":"Afghan Afghani"},
        {"currency":"ALL",
        "description":"Albanian Lek"},
        {"currency":"AMD",
        "description":"Armenian Dram"},
        {"currency":"ANG",
        "description":"Netherlands Antillean Guilder"},
        {"currency":"AOA",
        "description":"Angolan Kwanza"},
        {"currency":"ARS",
        "description":"Argentine Peso"},
        {"currency":"AUD",
        "description":"Australian Dollar"},
        {"currency":"AWG",
        "description":"Aruban Florin"},
        {"currency":"AZN",
        "description":"Azerbaijani Manat"},
        {"currency":"BAM",
        "description":"Bosnia & Herzegovina Convertible Mark"},
        {"currency":"BBD",
        "description":"Barbadian Dollar"},
        {"currency":"BDT",
        "description":"Bangladeshi Taka"},
        {"currency":"BGN",
        "description":"Bulgarian Lev"},
        {"currency":"BHD",
        "description":"Bahraini Dinar"},
        {"currency":"BIF",
        "description":"Burundian Franc"},
        {"currency":"BMD",
        "description":"Bermudian Dollar"},
        {"currency":"BND",
        "description":"Brunei Dollar"},
        {"currency":"BOB",
        "description":"Bolivian Boliviano"},
        {"currency":"BRL",
        "description":"Brazilian Real"},
        {"currency":"BSD",
        "description":"Bahamian Dollar"},
        {"currency":"BTN",
        "description":"Bhutanese Ngultrum"},
        {"currency":"BWP",
        "description":"Botswana Pula"},
        {"currency":"BYN",
        "description":"Belarus Ruble"},
        {"currency":"BZD",
        "description":"Belize Dollar"},
        {"currency":"CAD",
        "description":"Canadian Dollar"},
        {"currency":"CDF",
        "description":"Congolese Franc"},
        {"currency":"CHF",
        "description":"Swiss Franc"},
        {"currency":"CLP",
        "description":"Chilean Peso"},
        {"currency":"CNY",
        "description":"Chinese Yuan"},
        {"currency":"COP",
        "description":"Colombian Peso"},
        {"currency":"CRC",
        "description":"Costa Rican Colon"},
        {"currency":"CUC",
        "description":"Cuban Convertible Peso"},
        {"currency":"CVE",
        "description":"Cape Verdean Escudo"},
        {"currency":"CZK",
        "description":"Czech Republic Koruna"},
        {"currency":"DJF",
        "description":"Djiboutian Franc"},
        {"currency":"DKK",
        "description":"Danish Krone"},
        {"currency":"DOP",
        "description":"Dominican Peso"},
        {"currency":"DZD",
        "description":"Algerian Dinar"},
        {"currency":"EGP",
        "description":"Egyptian Pound"},
        {"currency":"ERN",
        "description":"Eritrean Nakfa"},
        {"currency":"ETB",
        "description":"Ethiopian Birr"},
        {"currency":"EUR",
        "description":"Euro"},
        {"currency":"FJD",
        "description":"Fiji Dollar"},
        {"currency":"GBP",
        "description":"British Pound Sterling"},
        {"currency":"GEL",
        "description":"Georgian Lari"},
        {"currency":"GHS",
        "description":"Ghanaian Cedi"},
        {"currency":"GIP",
        "description":"Gibraltar Pound"},
        {"currency":"GMD",
        "description":"Gambian Dalasi"},
        {"currency":"GNF",
        "description":"Guinea Franc"},
        {"currency":"GTQ",
        "description":"Guatemalan Quetzal"},
        {"currency":"GYD",
        "description":"Guyanaese Dollar"},
        {"currency":"HKD",
        "description":"Hong Kong Dollar"},
        {"currency":"HNL",
        "description":"Honduran Lempira"},
        {"currency":"HRK",
        "description":"Croatian Kuna"},
        {"currency":"HTG",
        "description":"Haiti Gourde"},
        {"currency":"HUF",
        "description":"Hungarian Forint"},
        {"currency":"IDR",
        "description":"Indonesian Rupiah"},
        {"currency":"ILS",
        "description":"Israeli Shekel"},
        {"currency":"INR",
        "description":"Indian Rupee"},
        {"currency":"IQD",
        "description":"Iraqi Dinar"},
        {"currency":"IRR",
        "description":"Iranian Rial"},
        {"currency":"ISK",
        "description":"Icelandic Krona"},
        {"currency":"JMD",
        "description":"Jamaican Dollar"},
        {"currency":"JOD",
        "description":"Jordanian Dinar"},
        {"currency":"JPY",
        "description":"Japanese Yen"},
        {"currency":"KES",
        "description":"Kenyan Shilling"},
        {"currency":"KGS",
        "description":"Kyrgystani Som"},
        {"currency":"KHR",
        "description":"Cambodian Riel"},
        {"currency":"KMF",
        "description":"Comorian Franc"},
        {"currency":"KPW",
        "description":"North Korean Won"},
        {"currency":"KRW",
        "description":"South Korean Won"},
        {"currency":"KWD",
        "description":"Kuwaiti Dinar"},
        {"currency":"KYD",
        "description":"Cayman Islands Dollar"},
        {"currency":"KZT",
        "description":"Kazakhstan Tenge"},
        {"currency":"LAK",
        "description":"Laotian Kip"},
        {"currency":"LBP",
        "description":"Lebanese Pound"},
        {"currency":"LKR",
        "description":"Sri Lankan Rupee"},
        {"currency":"LRD",
        "description":"Liberian Dollar"},
        {"currency":"LSL",
        "description":"Lesotho Loti"},
        {"currency":"LYD",
        "description":"Libyan Dinar"},
        {"currency":"MAD",
        "description":"Moroccan Dirham"},
        {"currency":"MDL",
        "description":"Moldovan Leu"},
        {"currency":"MGA",
        "description":"Malagasy Ariary"},
        {"currency":"MKD",
        "description":"Macedonian Denar"},
        {"currency":"MMK",
        "description":"Myanma Kyat"},
        {"currency":"MNT",
        "description":"Mongolian Tugrik"},
        {"currency":"MOP",
        "description":"Macau Pataca"},
        {"currency":"MRO",
        "description":"Mauritanian Ouguiya"},
        {"currency":"MUR",
        "description":"Mauritian Rupee"},
        {"currency":"MVR",
        "description":"Maldivian Rufiyaa"},
        {"currency":"MWK",
        "description":"Malawi Kwacha"},
        {"currency":"MXN",
        "description":"Mexican Peso"},
        {"currency":"MYR",
        "description":"Malaysian Ringgit"},
        {"currency":"MZN",
        "description":"Mozambican Metical"},
        {"currency":"NAD",
        "description":"Namibian Dollar"},
        {"currency":"NGN",
        "description":"Nigerian Naira"},
        {"currency":"NIO",
        "description":"Nicaragua Cordoba"},
        {"currency":"NOK",
        "description":"Norwegian Krone"},
        {"currency":"NPR",
        "description":"Nepalese Rupee"},
        {"currency":"NZD",
        "description":"New Zealand Dollar"},
        {"currency":"OMR",
        "description":"Omani Rial"},
        {"currency":"PAB",
        "description":"Panamanian Balboa"},
        {"currency":"PEN",
        "description":"Peruvian Nuevo Sol"},
        {"currency":"PGK",
        "description":"Papua New Guinean Kina"},
        {"currency":"PHP",
        "description":"Philippine Peso"},
        {"currency":"PKR",
        "description":"Pakistani Rupee"},
        {"currency":"PLN",
        "description":"Polish Zloty"},
        {"currency":"PYG",
        "description":"Paraguayan Guarani"},
        {"currency":"QAR",
        "description":"Qatari Riyal"},
        {"currency":"RON",
        "description":"Romanian Leu"},
        {"currency":"RSD",
        "description":"Serbian Dinar"},
        {"currency":"RUB",
        "description":"Russian Ruble"},
        {"currency":"RWF",
        "description":"Rwanda Franc"},
        {"currency":"SAR",
        "description":"Saudi Riyal"},
        {"currency":"SBD",
        "description":"Solomon Islands Dollar"},
        {"currency":"SCR",
        "description":"Seychellois Rupee"},
        {"currency":"SDG",
        "description":"Sudanese Pound"},
        {"currency":"SEK",
        "description":"Swedish Krona"},
        {"currency":"SGD",
        "description":"Singapore Dollar"},
        {"currency":"SHP",
        "description":"Saint Helena Pound"},
        {"currency":"SLL",
        "description":"Sierra Leonean Leone"},
        {"currency":"SOS",
        "description":"Somali Shilling"},
        {"currency":"SRD",
        "description":"Surinamese Dollar"},
        {"currency":"SSP",
        "description":"South Sudanese Pound"},
        {"currency":"STD",
        "description":"Sao Tome and Principe Dobra"},
        {"currency":"SYP",
        "description":"Syrian Pound"},
        {"currency":"SZL",
        "description":"Swazi Lilangeni"},
        {"currency":"THB",
        "description":"Thai Baht"},
        {"currency":"TJS",
        "description":"Tajikistan Somoni"},
        {"currency":"TMT",
        "description":"Turkmenistani Manat"},
        {"currency":"TND",
        "description":"Tunisian Dinar"},
        {"currency":"TOP",
        "description":"Tonga Paanga"},
        {"currency":"TRY",
        "description":"Turkish Lira"},
        {"currency":"TTD",
        "description":"Trinidad and Tobago Dollar"},
        {"currency":"TWD",
        "description":"New Taiwan Dollar"},
        {"currency":"TZS",
        "description":"Tanzanian Shilling"},
        {"currency":"UAH",
        "description":"Ukrainian Hryvnia"},
        {"currency":"UGX",
        "description":"Ugandan Shilling"},
        {"currency":"USD",
        "description":"United States Dollar"},
        {"currency":"UYU",
        "description":"Uruguayan Peso"},
        {"currency":"UZS",
        "description":"Uzbekistan Som"},
        {"currency":"VEF",
        "description":"Venezuelan Bolivar"},
        {"currency":"VND",
        "description":"Vietnamese Dong"},
        {"currency":"VUV",
        "description":"Vanuatu Vatu"},
        {"currency":"WST",
        "description":"Samoan Tala"},
        {"currency":"XAF",
        "description":"Central African CFA franc"},
        {"currency":"XCD",
        "description":"East Caribbean Dollar"},
        {"currency":"XOF",
        "description":"West African CFA franc"},
        {"currency":"XPF",
        "description":"CFP Franc"},
        {"currency":"YER",
        "description":"Yemeni Rial"},
        {"currency":"ZAR",
        "description":"South African Rand"},
        {"currency":"ZMW",
        "description":"Zambian Kwacha"}
        ];
        this.languages = [
          {"language":"English","code":'en'},
          {"language":"Arabic","code":'ar'},
          {"language":"French","code":'fr'},
          {"language":"Spanish","code":'es'},
          {"language":"German","code":'ge'},
          {"language":"Hindi","code":'hi'},
          {"language":"Italian","code":'it'},
          {"language":"Turkish","code":'tr'}
        ]
    }

  ngOnInit(): void {
    this.instanceData = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel;
    this.selectedGRNType = 1;
    this.selectErpRule = 1;
    this.selectedRuleId = 8;
    if(this.instanceData.idinstance == 3){
      this.selectedGRNType = 2;
      this.GRN_TYPE[0].disabled = true;
      this.GRN_TYPE[0].selected = false;
      this.GRN_TYPE[1].selected = true;
    }
    this.msg = "Drag and drop an HTML File";
    this.selectedDocFormat = "pdf,jpg,png,jpeg";
    if(sessionStorage.getItem("currentFolder")){
      sessionStorage.removeItem("currentFolder");
    }
    if (this.sharedService.vendorDetails) {
      this.vendorData = this.sharedService.vendorDetails;
      this.vendorName = this.sharedService.vendorDetails.VendorName;
      this.selecteddocType = 'Invoice';
    }
    if(this.sharedService.customerDetails){
      this.vendorData = this.sharedService.customerDetails;
      this.vendorName = this.sharedService.customerDetails.VendorName;
      this.selecteddocType = 'Purchase Orders';
    }
    if (!this.sharedService.vendorDetails && !this.vendorName) {
      try{
        this.vendorData = this.sharedService.currentVendorData;
        this.vendorName = this.sharedService.currentVendorData.VendorName;
        this.selecteddocType = 'Invoice';
      }catch(ex){

      }
    }
    if (!this.sharedService.customerDetails && !this.vendorName) {
      try{
        this.vendorData = this.sharedService.currentCustomerData;
        this.vendorName = this.sharedService.currentCustomerData.VendorName;
        this.selecteddocType = 'Purchase Orders';
      }catch(ex){

      }
    }
    this.getModalList(this.selecteddocType);
    this.changeMetaData();
    this.getAccuracyScore();
    this.getVendorAccounts();
    this.getfrConfig();
    this.getSynonyms();
    this.getRules();
    this.getAmountRules();
  }
  changeDocFormat(val:any){
    this.selectedDocFormat = val;
  }
  changeMetaData(){
    if(this.selecteddocType == "Purchase Orders"){
      this.showRule=false;
      this.isPObasedVendor = true;
      this.selectErpRule = 1;
      this.selectedVendorType = "PO based";
      this.selectedGRNType = 1;
      this.selectedRuleId = 8;
    }else{
      this.showRule = true;
      this.isPObasedVendor = true;
      this.selectedVendorType = "PO based";
    }
  }
  ngAfterContentInit() : void {
    let _this = this;
    setTimeout(() => {
      _this.outletRef.createEmbeddedView(_this.contentRef);
    }, 500);
  }
  getAccuracyScore(){
    this.sharedService.getAccuracyScore("vendor",this.vendorName).subscribe(data => {
      this.accuracyScore = data;
      this.documentCount = data["DocumentCount"];
    })
  }
  getAccValue(field){
    if(this.fieldscount > 0){
      this.fieldsaccavg = (this.fieldsaccuracy/this.fieldscount).toFixed(1) + " %";
    }else{
      this.fieldsaccavg = "0.0 %";
    }
    if(field in this.accuracyScore){
      let total = this.accuracyScore[field]["match"] + this.accuracyScore[field]["miss"];
      let accuracy = (this.accuracyScore[field]["match"]/total * 100).toFixed(1) + " %";
      this.fieldscount += 1;
      this.fieldsaccuracy += this.accuracyScore[field]["match"]/total * 100;
      return accuracy;
    }else{
      this.fieldscount += 1;
      this.fieldsaccuracy += 0;
      return "0.0 %";
    }
   
  }
  // controller
  parseDate(dateString: string): Date {
    let date = new Date(dateString);
    this.sasExpiry = date.toISOString()
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  trnMandatoryToggle(value){
    if(value == true){
      this.headerTags.filter(v => v.Name == 'TRN')[0]["Ismendatory"] = 1;
      this.headerMandetory.push("TRN");
      this.headerArray.push("TRN");
      this.trnboolean = true;
      this.trnMandatoryValue = 1;
      this.switchLabel = "Yes";
    } else {
      this.headerTags.filter(v => v.Name == 'TRN')[0]["Ismendatory"] = 0;
      this.headerMandetory.splice(this.headerMandetory.indexOf("TRN"),1);
      this.headerArray.splice(this.headerArray.indexOf("TRN"),1);
      this.trnboolean = false;
      this.trnMandatoryValue = 0;
      this.switchLabel = "No";
    }
  }
  getSynonyms(){
    this.sharedService.getemailconfig(this.selecteddocType).subscribe(data => {
      if(data['message'] == 'success'){
        this.allsynonyms = data['config']['synonyms']; 
        if(this.vendorName in data['config']['synonyms']){
          this.templateKeys = data['config']['synonyms'][this.vendorName];
        }else{
          this.templateKeys = [];
        }
      }
    })
  }
  updateFr(value) {
    value.SasExpiry = this.sasExpiry;
    let _this = this;
    if (window.confirm("Are you sure you want to update the configs?")) {
    this.sharedService.updateFrConfig(value).subscribe((data:any)=>{
      (<HTMLDivElement>document.getElementById("notify")).style.opacity = "0.8";
      setTimeout(() => {
        _this.closeNotify();
      }, 3000);
      this.msg = 'FR config updated successfully';
    });
  }
  }
  closeNotify(){
    (<HTMLDivElement>document.getElementById("notify")).style.opacity = "0";
  }
  
  selectTemplate(modal_id){
    this.selectedDocFormat = this.modalList.filter(v => v.DocumentModel.idDocumentModel == modal_id)[0].labels;
    this.currentTemplate = modal_id;
    this.getAllTags(this.currentTemplate,this.selecteddocType);
    this.getTrainingTestingRes(modal_id);
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);
    if(modal_id){
      this.enableTabsBoolean = true;
      let selected = this.modalList.filter(ele=>{
        return modal_id == ele.DocumentModel.idDocumentModel;
      })
      this.modelData = selected[0];
      this.mobservice.setModelData(this.modelData.DocumentModel);
      sessionStorage.setItem("modelData",JSON.stringify(this.modelData.DocumentModel));
      this.FolderPath = this.modelData.DocumentModel.folderPath;
      (<HTMLInputElement>document.getElementById("FolderPath")).value = this.FolderPath;
    }
  }
  getTrainingTestingRes(modal_id){
    this.sharedService.getTrainingTestRes(modal_id).subscribe((data: any) =>{
      this.trainingResult = data['training_result'] ? JSON.parse(data['training_result']) : {};
      this.testingResult = data['test_result'] ? JSON.parse(data['test_result']) : {};
      this.trainingAverageAccuracy = data['training_result'] ? (this.trainingResult['trainResult']['averageModelAccuracy'] * 100).toFixed(1)+"%" : "Not Trained!";
      this.testingAverageAccuracy = data['test_result'] ? (this.testingResult['documentResults'][0]['docTypeConfidence'] *100).toFixed(1)+"%" : "Not Tested!";
      this.trainingFields = 'trainResult' in this.trainingResult ? this.trainingResult['trainResult']['fields'] : [];
      this.testingFields = 'documentResults' in this.testingResult ? this.testingResult['documentResults'][0]['fields'] : {};
    })
  }
  getValue(field){
    if(field in this.testingFields){
      return this.testingFields[field]['confidence']*100 + "%";
    }else{
      return "Not Tested!";
    }
  }
  checkincludes(key){
    if(key.includes('tab_1')){
      return true;
    }
    return false;
  }
  getVendorAccounts() {
    this.sharedService.getVendorAccounts(this.vendorData.idVendor).subscribe((data: any) => {
      this.vendorAccountList = data;
    })
  }

  getfrConfig() {
    this.sharedService.getFrConfig().subscribe((data: any) => {
      this.frLoadBoolean = true;
      this.FRConfigData = [data];
      sessionStorage.setItem('configData',JSON.stringify([data]));
      this.sharedService.frData = this.FRConfigData;
    })
  }
  downloadDoc(tagtype){
    this.downloading = true;
    this.sharedService.downloadDoc(tagtype).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: 'application/vnd.ms-excel; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      //window.location.href = response.url;
      fileSaver.saveAs(blob, `VendorsTaggedInfo.xlsx`);
      this.downloading = false;
    }
      ,err=>{
        console.log(err);
        this.downloading = false;
      })
  }
  downloadDocAccuracy(tagtype){
    this.downloading = true;
    this.sharedService.downloadDocAccuracy(tagtype).subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: 'application/vnd.ms-excel; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      //window.location.href = response.url;
      fileSaver.saveAs(blob, `EntityLevelAccuracy.xlsx`);
      this.downloading = false;
    }
      ,err=>{
        console.log(err);
        this.downloading = false;
      })
  }

  getMetaData(documentId) {
    this.sharedService.getMetaData(documentId).subscribe((data:any) =>{
        this.FRMetaData = data;
        if(this.FRMetaData?.mandatoryheadertags){
          this.headerArray = this.FRMetaData['mandatoryheadertags'].split(',');
          if(!this.headerArray.includes("TRN") && this.headerTags.filter(v => v.Name == 'TRN').length > 0){
            this.headerTags.filter(v => v.Name == 'TRN')[0]["Ismendatory"] = 0;
            this.headerMandetory.splice(this.headerMandetory.indexOf("TRN"),1);
            this.trnboolean = false;
            this.switchLabel = "No";
          }
          setTimeout(() => {
            this.headerArray.forEach((ele)=>{
              const index = this.headerOptionalArray.indexOf(ele);
            if (index > -1) {
              this.headerOptionalArray.splice(index, 1);
            }
            })
          }, 1000);
        }else{
          this.headerArray = [];
          this.headerTags.forEach((el)=>{
            if(el['Ismendatory'] == 1){
              this.headerArray.push(el['Name']);
              this.headerMandetory.push(el['Name']);
            } else {
              this.headerOptionalArray.push(el['Name'])
            }
          });
        }
        if(this.FRMetaData?.mandatorylinetags){
          this.LineArray = this.FRMetaData['mandatorylinetags'].split(',');
          setTimeout(() => {
          this.LineArray.forEach((ele)=>{
            const index = this.LineArrayOptinal.indexOf(ele);
          if (index > -1) {
            this.LineArrayOptinal.splice(index, 1);
          }
          })
          }, 1000);
        }else{
          this.LineArray = [];
          this.LineTags.forEach((el)=>{
            if(el['Ismendatory'] == 1){
              this.LineArray.push(el['Name']);
              this.lineMandetory.push(el['Name']);
            } else {
              this.LineArrayOptinal.push(el['Name'])
            }
          });
        }
      
        if(this.FRMetaData?.optionalheadertags){
          this.headerOptTags = this.FRMetaData?.optionalheadertags?.split(',');
        }else{
          this.headerOptTags = [];
        }
        if(this.FRMetaData?.optionallinertags){
          this.LineOptTags = this.FRMetaData?.optionallinertags?.split(',');
          this.LineOptTags.forEach((ele)=>{
            this.selectLineTag(false,ele);
          })
        }else{
          this.LineOptTags = [];
        }
        if(this.FRMetaData){
          this.htmluploaded = true;
          this.msg = "File Uploaded Successfully";
          if(!this.FRMetaData['DateFormat'] || this.FRMetaData['DateFormat'] == ''){
            this.FRMetaData['DateFormat'] = 'dd/mm/yy';
          }
          (<HTMLSelectElement>document.getElementById("DateFormat")).value = this.FRMetaData['DateFormat'];
          if(!this.FRMetaData['AccuracyOverall'] || this.FRMetaData['AccuracyOverall'] == ''){
            this.FRMetaData['AccuracyOverall'] = '90';
          }
          (<HTMLInputElement>document.getElementById("AccuracyOverall")).value = this.FRMetaData['AccuracyOverall'];
          if(!this.FRMetaData['AccuracyFeild'] || this.FRMetaData['AccuracyFeild'] == ''){
            this.FRMetaData['AccuracyFeild'] = '90';
          }
          (<HTMLInputElement>document.getElementById("AccuracyFeild")).value = this.FRMetaData['AccuracyFeild'];
          this.selectedDocFormat = this.FRMetaData['InvoiceFormat'];
          (<HTMLInputElement>document.getElementById("unitprice_tol")).value = this.FRMetaData['UnitPriceTol_percent'];
          (<HTMLInputElement>document.getElementById("quantity_tol")).value = this.FRMetaData['QtyTol_percent'];
          if(!this.FRMetaData['Units'] || this.FRMetaData['Units'] == ''){
            this.FRMetaData['Units'] = 'USD';
          }else{
            (<HTMLInputElement>document.getElementById("Units")).value = this.FRMetaData['Units'];
          }
          if(!this.FRMetaData['temp_language'] || this.FRMetaData['temp_language'] == ''){
            this.FRMetaData['temp_language'] = 'en';
          }else{
            (<HTMLInputElement>document.getElementById("temp_language")).value = this.FRMetaData['temp_language'];
          }
          if(!this.FRMetaData['current_po_format'] || this.FRMetaData['current_po_format'] == ''){
            this.FRMetaData['current_po_format'] = '.';
          }else{
            (<HTMLInputElement>document.getElementById("current_po_format")).value = this.FRMetaData['current_po_format'];
          }
          this.selectedRuleId= this.FRMetaData['ruleID'];

          if(!this.FRMetaData['erprule']){
            this.selectErpRule = 1;
          } else {
            this.selectErpRule = this.FRMetaData['erprule'];
          }
          this.batchBoolean = this.FRMetaData['batchmap'];

          if(!this.FRMetaData['vendorType']){
            this.selectedVendorType = '';
          } else {
            this.selectedVendorType = this.FRMetaData['vendorType'];
            if(this.selectedVendorType == "PO based"){
              this.isPObasedVendor = true;
            } else {
              this.isPObasedVendor = false;
            }
          }
          if(!this.FRMetaData['GrnCreationType']){
            this.selectedGRNType = 1;
          } else {
            this.selectedGRNType = this.FRMetaData['GrnCreationType'];
            if(this.instanceData.idinstance == 3){
              this.selectedGRNType = 2;
            }
            this.onSelectGRNType(this.selectedGRNType);
          }
        
          
        }else{
          this.htmluploaded = false;
          this.msg = "Drag and drop an HTML File";
          (<HTMLSelectElement>document.getElementById("DateFormat")).value = '';
          (<HTMLInputElement>document.getElementById("AccuracyOverall")).value = '90';
          (<HTMLInputElement>document.getElementById("AccuracyFeild")).value = '90';
          (<HTMLInputElement>document.getElementById("Units")).value = 'USD';
          (<HTMLInputElement>document.getElementById("current_po_format")).value = '.';
          (<HTMLInputElement>document.getElementById("temp_language")).value = 'en';
          if((<HTMLSelectElement>document.getElementById("ruleID")))
          (<HTMLSelectElement>document.getElementById("ruleID")).value = '';
        }    
    })
  }
  fileDrop(event) {
    const formData = new FormData();
    formData.append("file", event[0], event[0].name);
    this.sharedService.uploadHTMLFile(formData,this.FolderPath).subscribe(data =>{
      if(data.filename){
        this.htmluploaded = true;
        this.msg = "File Uploaded Successfully";
      }else{
        this.msg = "File is not Uploaded due to Server Error";
        this.htmluploaded = false;
      }
    })
  }
  uploadFolderEvent(e:any){
    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    this.sharedService.uploadHTMLFile(formData,this.FolderPath).subscribe(data =>{
      if(data.filename){
        this.msg = "File Uploaded Successfully";
        this.htmluploaded = true;
      }else{
        this.msg = "File is not Uploaded due to Server Error";
        this.htmluploaded = false;
      }
    })
  }
  upload_Blob(){

  }
  fileOverBase(event) {
    this.hasBaseDropZoneOver = event;
  }
  selectVendorAccont(value) {

  }

  statusUpdate(value){
  }
  enableMetaDataTab(value){
    this.enableMetaDataBoolean = value;
  }
  getModalList(doctype:string) {
    this.sharedService.getModalList(this.vendorData.idVendor,doctype).subscribe((data: any) => {
      this.modalList = data;
      if(this.modalList.length == 0){
        this.checkselect = true;
      }else{
        this.selectTemplate(this.modalList[0].DocumentModel.idDocumentModel);
        this.checkselect = false;
      }
    })
  }
  removealert(){
    this.modaladderr = false;
  }
  createModel(value) {
    value.modelStatus = 1;
    value.docType = this.selecteddocType;
    value.labels = this.selectedDocFormat;
    if(value['modelName'] == ''){
      return;
    }
    if(this.modalList && this.modalList.length > 0){
      let checkexists = this.modalList.filter(v => v.DocumentModel.modelName == value['modelName']);
      if(checkexists.length > 0){
        this.modaladderr = true;
        return;
      }
    }
    this.sharedService.createNewTemplate(value).subscribe((data: any) => {
      (<HTMLButtonElement>document.getElementById("closeBtn")).click();
      this.getModalList(this.selecteddocType);
      this.getVendorAccounts();
      if(data["result"] == "Updated"){
        this.FolderPath = data['records']['folderPath']
        this.messageService.add({
          severity:"info",
          summary:"Created",
          detail:"New model created successfully"
        });
      }else{
        this.messageService.add({
          severity:"error",
          summary:"error",
          detail:"Template Name already exists!"
        });
      }
    }, error=>{
      this.messageService.add({
        severity:"error",
        summary:"error",
        detail:error.statusText
      });
    })
  }

  batchProcessToggle(value){
    if(value == true){
      this.batchBoolean = 1;
    } else {
      this.batchBoolean = 0;
    }
  }

  onChangeVndrType(evnt){
    if(evnt == "PO based"){
      this.isPObasedVendor = true;
    } else {
      this.isPObasedVendor = false;
    }
  }
  onSelectGRNType(val){
    let filterdRules = this.filterdRules;
    filterdRules = filterdRules.filter(ele=>{
      return val == ele.GrnCreationType;
    });
    this.rulesData = filterdRules;
  }

  updateMetainfo(value) {
   if((this.templateKeys !='') && this.updateMetaData.valid){
    for(let key of Object.keys(this.allsynonyms)){
      for(let s of this.templateKeys){
        if(key != this.vendorName && this.allsynonyms[key].includes(s)){
          alert(`Duplicate Synonym found for vendor ${key}, Synonym: ${s}, Please remove it and retry!`);
          return;
        }
      }
    }
    if(value['FolderPath'] == ''){
      value['FolderPath'] = (<HTMLInputElement>document.getElementById("FolderPath")).value;
    }
    if(!value['DateFormat'] || value['DateFormat'] == ''){
      value['DateFormat'] = (<HTMLInputElement>document.getElementById("DateFormat")).value;
    }
    if(value['AccuracyOverall'] == ''){
      value['AccuracyOverall'] = (<HTMLInputElement>document.getElementById("AccuracyOverall")).value;
    }
    if(value['AccuracyFeild'] == ''){
      value['AccuracyFeild'] = (<HTMLInputElement>document.getElementById("AccuracyFeild")).value;
    }
    if(value['UnitPriceTol_percent'] == ''){
      value['UnitPriceTol_percent'] = (<HTMLInputElement>document.getElementById("unitprice_tol")).value;
    }
    if(value['QtyTol_percent'] == ''){
      value['QtyTol_percent'] = (<HTMLInputElement>document.getElementById("quantity_tol")).value;
    }
    if(this.isPObasedVendor){
      if(!value['ruleID'] || value['ruleID'] == ''){
        if((<HTMLInputElement>document.getElementById("ruleID")))
        value['ruleID'] = (<HTMLInputElement>document.getElementById("ruleID")).value;
        else
        value['ruleID'] = this.selectedRuleId;
      }
    }

    if(value['Units'] == ''){
      value['Units'] = (<HTMLInputElement>document.getElementById("Units")).value;
    }
    if(value['current_po_format'] == ''){
      value['current_po_format'] = (<HTMLInputElement>document.getElementById("current_po_format")).value;
    }
    if(value['temp_language'] == ''){
      value['temp_language'] = (<HTMLInputElement>document.getElementById("temp_language")).value;
    }
    sessionStorage.setItem("temp_lang",value['temp_language'])
     value['InvoiceFormat'] = this.selectedDocFormat;
     value['mandatoryheadertags'] = this.headerArray.toString();
     value['mandatorylinetags'] = this.LineArray.toString();
     value['optionalheadertags'] = this.headerOptTags ? this.headerOptTags.toString() : "";
     value['optionallinertags'] = this.LineOptTags ? this.LineOptTags.toString() : "";
     value["vendorName"] = this.vendorName;
     if(value["vendorType"] == "PO based"){
       value["batchmap"] = 1;
       if(!value['erprule'] || value['erprule'] == ''){
        if((<HTMLInputElement>document.getElementById("erprule")))
        value['erprule'] = (<HTMLInputElement>document.getElementById("erprule")).value;
        else
        value['erprule'] = this.selectErpRule;
      }
     } else {
        value["batchmap"] = 0;
     }
    let _this = this;
    _this.saving = true;
    if (window.confirm("Are you sure you want to update the metadata?")) {
    this.sharedService.updateFrMetaData(this.currentTemplate,value).subscribe((data:any)=>{
      _this.saving = false;
      (<HTMLDivElement>document.getElementById("notify")).style.opacity = "0.8";
      setTimeout(() => {
        _this.closeNotify();
        _this.router.navigate(['IT_Utility/training']);
      }, 3000);
      this.msg = 'FR metadata updated successfully';
    });
  }else{
    _this.saving = false;
  }
   } else {
     alert('Please add required fields.');
   }
 }
 
 changeActiveTab(){
   if((<HTMLAnchorElement>document.getElementById("mob-tab")).classList.contains("active")){
    (<HTMLAnchorElement>document.getElementById("mob-tab")).classList.remove("active");
    (<HTMLAnchorElement>document.getElementById("meta-tab")).classList.add("active");
    (<HTMLDivElement>document.getElementById("mob")).classList.remove("active");
    (<HTMLDivElement>document.getElementById("mob")).classList.remove("show");
    (<HTMLDivElement>document.getElementById("meta")).classList.add("active");
    (<HTMLDivElement>document.getElementById("meta")).classList.add("show");
  }
 }
  getRules() {
    this.sharedService.getRules().subscribe((data:any)=>{
      this.rulesData = data;
      this.filterdRules = data;
    })
  }
  getAmountRules() {
    this.sharedService.getAmountRules().subscribe((data:any)=>{
      this.amountRulesData = data;
    })
  }
  onCancel() {
    this._location.back();
  }
  checkHeaderTagged(tag){
    if(this.headerArray.includes(tag) || this.headerOptTags.includes(tag)){
      return true;
    }
    return false;
  }
  checkLineTagged(tag){
    if(this.LineArray.includes(tag) || this.LineOptTags.includes(tag)){
      return true;
    }
    return false;
  }
  getHeaderStatus(tag){
    if(this.headerArray.includes(tag)){
      return "Tagged";
    }else if(this.headerOptTags.includes(tag)){
      return "Tagged Optional";
    }
  }
  getLineStatus(tag){
    if(this.LineArray.includes(tag)){
      return "Tagged";
    }else if(this.LineOptTags.includes(tag)){
      return "Tagged Optional";
    }
  }
  getAllTags(modal_id,docType) {
    this.headerArray = [];
    this.headerMandetory = [];
    this.headerOptionalArray = [];
    this.LineArray = [];
    this.lineMandetory = [];
    this.LineArrayOptinal = [];
    this.sharedService.getAllTags('vendor',docType).subscribe((data:any)=>{
      this.headerTags = data.header;
      this.headerTags.forEach((el)=>{
        if(el['Ismendatory'] == 1){
          this.headerMandetory.push(el['Name']);
          this.headerArray.push(el['Name']);
        } else {
          this.headerOptionalArray.push(el['Name'])
        }
      });
      this.headerArray=[...new Set(this.headerArray)];
      this.headerOptionalArray.forEach((ele,index)=>{
        this.headerArray.forEach(tagName=>{
          if(ele == tagName){
            this.headerOptionalArray.splice(index,1);
          }
        })
      })
      this.LineTags = data.line;
      this.LineTags.forEach((el)=>{
        if(el['Ismendatory'] == 1){
          this.lineMandetory.push(el['Name']);
          this.LineArray.push(el['Name']);
        } else {
          this.LineArrayOptinal.push(el['Name'])
        }
      });
      this.LineArray=[...new Set(this.LineArray)];
      this.LineArrayOptinal.forEach((ele,index)=>{
        this.LineArray.forEach(tagName=>{
          if(ele == tagName){
            this.LineArrayOptinal.splice(index,1);
          }
        })
      })
      this.LineArrayOptinal =[...new Set(this.LineArrayOptinal)];
    })
    setTimeout(() => {
      this.getMetaData(modal_id);    
    }, 500);
  }
  showHeaderCheckboxes() {
    this.showCheckboxLineDiv = false;
    this.showCheckboxOptHeaderDiv = false;
    this.showCheckboxLineOptDiv = false;
    this.showCheckboxHeaderDiv = !this.showCheckboxHeaderDiv;
  }

  showHeaderOptionalCheckboxes(){
    this.showCheckboxLineDiv = false;
    this.showCheckboxHeaderDiv = false;
    this.showCheckboxLineOptDiv = false;
    this.showCheckboxOptHeaderDiv = !this.showCheckboxOptHeaderDiv;
  }
  selectHeader(val,val1) {
    if(val == true){
      this.headerArray.push(val1);
      const index = this.headerOptionalArray.indexOf(val1);
        if (index > -1) {
          this.headerOptionalArray.splice(index, 1);
        }
        if(this.headerOptTags){
          this.headerOptTags.forEach((element,index)=>{
            if(element == val1){
              this.headerOptTags.splice(index,1);
            }
          })
        }
    } else {
      this.headerOptionalArray.push(val1)
        const index = this.headerArray.indexOf(val1);
        if (index > -1) {
          this.headerArray.splice(index, 1);
        }
    }
    this.headerArray = [...new Set(this.headerArray)];
    this.headerOptionalArray = [...new Set(this.headerOptionalArray)];
  }

  selectHeaderoptional(checked,val1){
    if(checked == true){
      this.headerOptTags.push(val1);
    } else {
        const index = this.headerOptTags.indexOf(val1);
        if (index > -1) {
          this.headerOptTags.splice(index, 1);
        }
    }
    this.headerOptTags = [...new Set(this.headerOptTags)];
    // this.headerOptionalArray = [...new Set(this.headerOptionalArray)];
  }

  removeHeaderTag(index,tag) {
    // if(this.headerMandetory.includes(tag)){
    //   alert(`${tag} is mandetory field.`)
    // } else{
      this.headerArray.splice(index,1);
      this.headerOptionalArray.push(tag)
    // }
  }

  removeHeaderOptTag(index,tag) {
    this.headerOptTags.splice(index,1);
  }

  showLineCheckboxes(){
    this.showCheckboxHeaderDiv = false;
    this.showCheckboxOptHeaderDiv = false;
    this.showCheckboxLineOptDiv = false;
    this.showCheckboxLineDiv = !this.showCheckboxLineDiv;
  }

  showLineOptCheckboxes() {
    this.showCheckboxHeaderDiv = false;
    this.showCheckboxOptHeaderDiv = false;
    this.showCheckboxLineDiv = false;
    this.showCheckboxLineOptDiv = !this.showCheckboxLineOptDiv;
  }
  
  selectLineTag(val,val1) {
    if(val == true){
      this.LineArray.push(val1);
      const index = this.LineArrayOptinal.indexOf(val1);
        if (index > -1) {
          this.LineArrayOptinal.splice(index, 1);
        }
        if(this.LineOptTags){
          this.LineOptTags.forEach((element,index)=>{
            if(element == val1){
              this.LineOptTags.splice(index,1);
            }
          })
        }
    } else {
      this.LineArrayOptinal.push(val1);
        const index = this.LineArray.indexOf(val1);
        if (index > -1) {
          this.LineArray.splice(index, 1);
        }
    }
    this.LineArray = [...new Set(this.LineArray)];
    this.LineArrayOptinal = [...new Set(this.LineArrayOptinal)];
  }

  selectLineOptTag(checked,val1){
    if(checked == true){
      this.LineOptTags.push(val1);
    } else {
        const index = this.LineOptTags.indexOf(val1);
        if (index > -1) {
          this.LineOptTags.splice(index, 1);
        }
    }
    this.LineOptTags = [...new Set(this.LineOptTags)];
    // this.headerOptionalArray = [...new Set(this.headerOptionalArray)];
  }

  removeLineTag(index,tag) {
    // if(this.lineMandetory.includes(tag)){
    //   alert(`${tag} is mandetory field.`);
    // } else{
      this.LineArray.splice(index,1);
      this.LineArrayOptinal.push(tag)
    // }
  }
  removeLineOptTag(index,tag) {
    this.LineOptTags.splice(index,1);
  }
}
