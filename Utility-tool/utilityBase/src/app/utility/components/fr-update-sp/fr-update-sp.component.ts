import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/services/shared/shared.service';
import { MobmainService } from '../fr-update/mob/mobmain/mobmain.service';
import * as fileSaver from 'file-saver';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-fr-update-sp',
  templateUrl: './fr-update-sp.component.html',
  styleUrls: ['./fr-update-sp.component.scss']
})
export class FrUpdateSpComponent implements OnInit {
  @ViewChild("outlet", {read: ViewContainerRef}) outletRef: ViewContainerRef;
  @ViewChild("content", {read: TemplateRef}) contentRef: TemplateRef<any>;
  SPData: any;
  SPName: any;
  checkselect:boolean=false;
  displayAddTemplateDialog: boolean;
  SPAccountList = [];
  currencies = [];
  languages = [];
  select_SPAccount: any;
  templateName: string;
  modaladderr:boolean=false;
  FRConfigData: any;
  trainingResult: any;
  testingResult:any;
  FRMetaData: any;
  modalList: any;
  allsynonyms: any;
  selected_template: string;
  dateFormats = ['mm/dd/yy', 'mm/dd/yyyy', 'mm.dd.yy', 'mm.dd.yyyy','dd/mm/yy','dd-mm-yy','dd-mm-yyyy','dd.mm.yyyy','dd-mmm-yy']
  enableTabsBoolean: boolean = false;
  enableMetaDataBoolean: boolean = false;
  sasExpiry:any;
  modelData: any;
  saving:boolean = false;
  msg:string="";
  frLoadBoolean:boolean;
  rulesData: any;
  filterdRules:any;
  amountRulesData:any;
  currentTemplate: any;
  FolderPath:string="";
  selected_extraction_type:string;
  selected_page_selection:string;
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
  trainingFields=[];
  accuracyScore:any;
  testingFields={};
  LineTags = []
  LineArray =[];
  Linestr: string;
  lineMandetory=[];
  LineOptTags=[];
  LineArrayOptinal = [];
  //templateKeys:any;
  showCheckboxOptHeaderDiv: boolean;
  showCheckboxLineOptDiv:boolean;
  selectErpRule:any;
  downloading:boolean=false;
  selectedSPType = '';
  SPTypeData = [
    {value :'PO based', id:1},
    {value :'Non-PO based', id:2},
  ];
  GRN_TYPE = [
    {value :'Manual', id:1},
    {value :'ERP', id:2},
  ]
  selectedRuleId:any;
  selectedGRNType:any;
  fieldscount:number = 0;
  fieldsaccuracy:number = 0;
  fieldsaccavg:string = "0.0 %";
  batchBoolean: any;
  isPObasedSP: boolean;
  @ViewChild('updateMetaData')
  updateMetaData:NgForm;
  serviceRules: any;
  mandatoryServiceRules = [];
  save_unidentified_accounts:boolean=false;
  auto_template_classification:boolean=false;
  showCheckboxServiceDiv:boolean;
  selected_dateFormat:string;
  modelVersions = [
    { name: 'Azure Form Recognizer 2.1', version:'v2.1'},
    { name: 'Azure Form Recognizer 3.0', version:'2022-08-31'},
    { name: 'Azure Form Recognizer 3.1', version:'2023-07-31'},
  ]

  constructor(private sharedService: SharedService,
    private messageService : MessageService,
    private router:Router,
    private mobservice:MobmainService,
    private _location: Location) { 
      this.currencies = this.sharedService.currencies;
      this.languages = this.sharedService.languages;
    }

  ngOnInit(): void {
    if(sessionStorage.getItem("currentFolder")){
      sessionStorage.removeItem("currentFolder");
    }
    if (this.sharedService.SPDetails) {
      this.SPData = this.sharedService.SPDetails;
      this.SPName = this.sharedService.SPDetails.ServiceProviderName;
    }
    if (!this.SPName) {
      this.SPData = this.sharedService.currentSPData;
      this.SPName = this.sharedService.currentSPData.ServiceProviderName;
    }
    this.getAccuracyScore();
    this.getfrConfig();
    this.getModalList();
  }
  
  ngAfterContentInit() : void {
    let _this = this;
    setTimeout(() => {
      _this.outletRef.createEmbeddedView(_this.contentRef);
    }, 500);
  }

  getAccuracyScore(){
    this.sharedService.getAccuracyScore("sp",this.SPName).subscribe(data => {
      this.accuracyScore = data;
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
  
  // getSynonyms(){
  //   this.sharedService.getemailconfig().subscribe(data => {
  //     if(data['message'] == 'success'){
  //       this.allsynonyms = data['config']['synonyms']; 
  //       if(this.SPName in data['config']['synonyms']){
  //         this.templateKeys = data['config']['synonyms'][this.SPName];
  //       }else{
  //         this.templateKeys = [];
  //       }
  //     }
  //   })
  // }
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
    this.currentTemplate = modal_id;
    this.getAllTags();
    this.getServiceRules();
    this.getMetaData(modal_id);
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
      this.trainingResult = JSON.parse(data['training_result']);
      this.testingResult = JSON.parse(data['test_result']);
      if(this.trainingResult && this.testingResult){
        this.trainingAverageAccuracy = (this.trainingResult['trainResult']['averageModelAccuracy'] * 100).toFixed(1)+"%";
        this.testingAverageAccuracy = (this.testingResult['documentResults'][0]['docTypeConfidence'] *100).toFixed(1)+"%";
        this.trainingFields = this.trainingResult['trainResult']['fields'];
        this.testingFields = this.testingResult['documentResults'][0]['fields'];
      }
    })
  }
  
  getValue(field){
    if(this.testingFields[field]){
      return this.testingFields[field]['confidence']*100;
    }else{
      return 0
    }
  }
  checkincludes(key){
    if(key.includes('tab_1')){
      return true;
    }
    return false;
  }
  getSPAccounts() {
    this.sharedService.getSPAccounts(this.SPData.idServiceProvider).subscribe((data: any) => {
      this.SPAccountList = data;
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
      fileSaver.saveAs(blob, `SPTaggedInfo.xlsx`);
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
      this.FRMetaData = data.FRMetaData;
      this.headerArray = [];
      this.LineArray = [];
      this.selected_dateFormat = this.FRMetaData?.DateFormat;
      if (this.FRMetaData?.auto_template_classification) {
        this.auto_template_classification = this.FRMetaData?.auto_template_classification;
      } 
      if(this.FRMetaData?.save_unidentified_accounts){
        this.save_unidentified_accounts = this.FRMetaData?.save_unidentified_accounts;
      }
      if(data?.extractiontype){
        this.selected_extraction_type =data?.extractiontype;
      }
      if(data?.pagepreference){
        this.selected_page_selection = JSON.stringify(data?.pagepreference);
      }
      if(this.FRMetaData?.service_rules_function){
        this.serviceRules?.forEach(el=>{
          if(this.FRMetaData?.service_rules_function?.includes(el.function_name)){
            el.isSelected = true;
            this.mandatoryServiceRules.unshift(el);
          }
        })
      }
      if(this.FRMetaData?.mandatoryheadertags){
        this.headerArray = this.FRMetaData['mandatoryheadertags'].split(',');
        setTimeout(() => {
          this.headerArray.forEach((ele)=>{
            const index = this.headerOptionalArray.indexOf(ele);
          if (index > -1) {
            this.headerOptionalArray.splice(index, 1);
          }
          })
        }, 1000);
      }else{
        this.headerTags.forEach((el)=>{
          if(el['Ismendatory'] == 1){
            this.headerArray.push(el['Name']);
          } 
        });
        this.headerArray=[...new Set(this.headerArray)];
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
        this.LineTags.forEach((el)=>{
          if(el['Ismendatory'] == 1){
            this.LineArray.push(el['Name']);
          }
        });
        this.LineArray=[...new Set(this.LineArray)];
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
        if(!this.FRMetaData['DateFormat'] || this.FRMetaData['DateFormat'] == ''){
          this.FRMetaData['DateFormat'] = 'dd/mm/yy';
        }
        if((<HTMLSelectElement>document.getElementById("DateFormat")))
        (<HTMLSelectElement>document.getElementById("DateFormat")).value = this.FRMetaData['DateFormat'];
        if(!this.FRMetaData['AccuracyOverall'] || this.FRMetaData['AccuracyOverall'] == ''){
          this.FRMetaData['AccuracyOverall'] = '90';
        }
        if((<HTMLInputElement>document.getElementById("AccuracyOverall")))
        (<HTMLInputElement>document.getElementById("AccuracyOverall")).value = this.FRMetaData['AccuracyOverall'];
        if(!this.FRMetaData['AccuracyFeild'] || this.FRMetaData['AccuracyFeild'] == ''){
          this.FRMetaData['AccuracyFeild'] = '90';
        }
        if((<HTMLInputElement>document.getElementById("AccuracyFeild")))
        (<HTMLInputElement>document.getElementById("AccuracyFeild")).value = this.FRMetaData['AccuracyFeild'];
        if((<HTMLInputElement>document.getElementById("InvoiceFormat")))
        (<HTMLInputElement>document.getElementById("InvoiceFormat")).value = this.FRMetaData['InvoiceFormat'];
        
        //(<HTMLInputElement>document.getElementById("unitprice_tol")).value = this.FRMetaData['UnitPriceTol_percent'];
        //(<HTMLInputElement>document.getElementById("quantity_tol")).value = this.FRMetaData['QtyTol_percent'];
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
        // this.selectedRuleId= this.FRMetaData['ruleID'];

        // if(!this.FRMetaData['erprule']){
        //   this.selectErpRule = '';
        // } else {
        //   this.selectErpRule = this.FRMetaData['erprule'];
        // }
        // this.batchBoolean = this.FRMetaData['batchmap'];

        // if(!this.FRMetaData['vendorType']){
        //   this.selectedVendorType = '';
        // } else {
        //   this.selectedVendorType = this.FRMetaData['vendorType'];
        //   if(this.selectedVendorType == "PO based"){
        //     this.isPObasedVendor = true;
        //   } else {
        //     this.isPObasedVendor = false;
        //   }
        // }
        // if(!this.FRMetaData['GrnCreationType']){
        //   this.selectedGRNType = '';
        // } else {
        //   this.selectedGRNType = this.FRMetaData['GrnCreationType'];
        //   this.onSelectGRNType(this.selectedGRNType);
        // }
       
        
      }else{
        (<HTMLSelectElement>document.getElementById("DateFormat")).value = '';
        (<HTMLInputElement>document.getElementById("AccuracyOverall")).value = '90';
        (<HTMLInputElement>document.getElementById("AccuracyFeild")).value = '90';
        (<HTMLInputElement>document.getElementById("InvoiceFormat")).value = 'pdf,jpg';
        (<HTMLInputElement>document.getElementById("Units")).value = 'USD';
          (<HTMLInputElement>document.getElementById("temp_language")).value = 'en';
        //(<HTMLSelectElement>document.getElementById("ruleID")).value = '';
      }
      
    })
  }

  selectSPAccont(value) {

  }

  statusUpdate(value){
    if(value == true){
      //this.getModalList();
    }
  }
  enableMetaDataTab(value){
    this.enableMetaDataBoolean = value;
  }
  getModalList() {
    this.sharedService.getModalListSP(this.SPData.idServiceProvider).subscribe((data: any) => {
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
    value.docType = "Invoice";
    value.serviceproviderID = this.SPData.idServiceProvider;
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
      //this.getSPAccounts();
      this.getModalList();
      this.FolderPath = data['records']['folderPath']
      this.messageService.add({
        severity:"info",
        summary:"Created",
        detail:"New model created successfully"
      });
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
      this.isPObasedSP = true;
    } else {
      this.isPObasedSP = false;
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
   if(this.updateMetaData.valid){
    // for(let key of Object.keys(this.allsynonyms)){
    //   for(let s of this.templateKeys){
    //     if(key != this.SPName && this.allsynonyms[key].includes(s)){
    //       alert(`Duplicate Synonym found for Service Provider ${key}, Synonym: ${s}, Please remove it and retry!`);
    //       return;
    //     }
    //   }
    // }
    let rules = []
    this.mandatoryServiceRules.forEach(el=>{
      rules.push(el.function_name)
    })
    value.service_rules_function = rules;
    if(value['FolderPath'] == ''){
      value['FolderPath'] = (<HTMLInputElement>document.getElementById("FolderPath")).value;
    }
    // if(!value['DateFormat'] || value['DateFormat'] == ''){
    //   value['DateFormat'] = (<HTMLInputElement>document.getElementById("DateFormat")).value;
    // }
    // if(value['AccuracyOverall'] == ''){
    //   value['AccuracyOverall'] = (<HTMLInputElement>document.getElementById("AccuracyOverall")).value;
    // }
    // if(value['AccuracyFeild'] == ''){
    //   value['AccuracyFeild'] = (<HTMLInputElement>document.getElementById("AccuracyFeild")).value;
    // }
    // if(value['UnitPriceTol_percent'] == ''){
    //   value['UnitPriceTol_percent'] = (<HTMLInputElement>document.getElementById("unitprice_tol")).value;
    // }
    // if(value['QtyTol_percent'] == ''){
    //   value['QtyTol_percent'] = (<HTMLInputElement>document.getElementById("quantity_tol")).value;
    // }
    // if(this.isPObasedSP){
    //   if(!value['ruleID'] || value['ruleID'] == ''){
    //     value['ruleID'] = (<HTMLInputElement>document.getElementById("ruleID")).value;
    //   }
    // }

    if(value['Units'] == ''){
      value['Units'] = (<HTMLInputElement>document.getElementById("Units")).value;
    }
    if(value['temp_language'] == ''){
      value['temp_language'] = (<HTMLInputElement>document.getElementById("temp_language")).value;
    }
    sessionStorage.setItem("temp_lang",value['temp_language'])
    // if(value['InvoiceFormat'] == ''){
    //   value['InvoiceFormat'] = (<HTMLInputElement>document.getElementById("InvoiceFormat")).value;
    // }
     value['mandatoryheadertags'] = this.headerArray.toString();
     value['mandatorylinetags'] = this.LineArray.toString();
     value['optionalheadertags'] = this.headerOptTags ? this.headerOptTags.toString() : "";
     value['optionallinertags'] = this.LineOptTags ? this.LineOptTags.toString() : "";
     value["ServiceProviderName"] = this.SPName;
    //  if(value["SPType"] == "PO based"){
    //    value["batchmap"] = 1;
    //    if(!value['erprule'] || value['erprule'] == ''){
    //     value['erprule'] = (<HTMLInputElement>document.getElementById("erprule")).value;
    //   }
    //  } else {
    //     value["batchmap"] = 0;
    //  }
     console.log(value);
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
  }
  else{
    _this.saving = false;
    _this.router.navigate(['IT_Utility/training']);
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
      console.log("rules",data);
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
  getAllTags() {
    this.sharedService.getAllTags('sp',"Invoice").subscribe((data:any)=>{
      this.headerTags = data.header;
      this.headerTags.forEach((el)=>{
        if(el['Ismendatory'] == 1){
          this.headerArray.push(el['Name']);
          this.headerMandetory.push(el['Name']);
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
          this.LineArray.push(el['Name']);
          this.lineMandetory.push(el['Name']);
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
  }
  showHeaderCheckboxes() {
    // console.log(val.value)
    this.showCheckboxLineDiv = false;
    this.showCheckboxOptHeaderDiv = false;
    this.showCheckboxLineOptDiv = false;
    this.showCheckboxHeaderDiv = !this.showCheckboxHeaderDiv;
  }

  showServiceRule(){
    this.showCheckboxServiceDiv = !this.showCheckboxServiceDiv;
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
      console.log(val1)
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
  getServiceRules(){
    this.mandatoryServiceRules = [];
    this.sharedService.readServiceRules().subscribe((data:any)=>{
      console.log(data);
      this.serviceRules = data?.result;
      // this.serviceRules.forEach(el=>{
      //   if(el.mandatory == 1) {
      //     el.isSelected = true;
      //     this.mandatoryServiceRules.push(el)
      //   }
      // })
      // this.mandatoryServiceRules = [...new Set(this.mandatoryServiceRules)];
    })
  }
  selectServiceRules(bool,val1){
    if(bool == true){
      const index = this.mandatoryServiceRules.findIndex(el=>el.idserinarules == val1.idserinarules);
        if (index > -1) {
          this.mandatoryServiceRules.splice(index, 1);
        } else {
          this.mandatoryServiceRules.push(val1);
        }
    } else {
        const index = this.mandatoryServiceRules.findIndex(el=>el.idserinarules == val1.idserinarules);

        if (index > -1) {
          this.mandatoryServiceRules.splice(index, 1);
        }
    }
    this.mandatoryServiceRules = [...new Set(this.mandatoryServiceRules)];
    this.addFlag();
    this.keepLastItemAtEnd();

    let order = 1
    this.mandatoryServiceRules.forEach(val=>{
      val.order = order;
      order++
    })
    console.log(this.mandatoryServiceRules)

  }
  addFlag(){
    const bIds = new Set(this.mandatoryServiceRules.map(obj => obj.idserinarules));
    this.serviceRules = this.serviceRules.map(obj => {
      // Check if the current object id is in bIds set
      const isSelected = bIds.has(obj.idserinarules);
      // Return the updated object with the new flag
      return { ...obj, isSelected };
    });
  }
  removeServiceRule(i,value){
    if(value.idserinarules != 8){
      const index = this.mandatoryServiceRules.findIndex(el=>el.idserinarules == value.idserinarules);
      if (index > -1) {
        this.mandatoryServiceRules.splice(index, 1);
      }
      this.addFlag();
    }

  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.mandatoryServiceRules, event.previousIndex, event.currentIndex);
    this.updateOrder();
  }

  updateOrder() {
    this.mandatoryServiceRules.forEach((item, index) => {
      item.order = index + 1; // Update the order based on the new index
    });
  }
  keepLastItemAtEnd() {
    const index = this.mandatoryServiceRules.findIndex(item => item.idserinarules === 8);
    if (index !== -1) {
      const [item] = this.mandatoryServiceRules.splice(index, 1); // Remove the item with id 8
      this.mandatoryServiceRules.push(item); // Add it back at the end
    }
  }
  
}
