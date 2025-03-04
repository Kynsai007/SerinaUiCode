import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import * as pdfjsLib from 'pdfjs-dist';
import Fuse from 'fuse.js'
import {CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/services/shared/shared.service';
import $ from 'jquery';
if( pdfjsLib !== undefined ){
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://npmcdn.com/pdfjs-dist@2.6.347/build/pdf.worker.js";
}
@Component({
  selector: 'app-taggingtool',
  templateUrl: './taggingtool.component.html',
  styleUrls: ['./taggingtool.component.css']
})
export class TaggingtoolComponent implements OnInit,AfterViewInit {
  @Input() frConfigData:any;
  @Input() modelData:any;
  layouttext:string;
  textValue: string;
  loadingValues: boolean = false;
  allFileLabels: any[] = [];
  alldivs: {};
  resp:any;
  top:number;
  activatedrw:boolean = false;
  currenttable:string="tab_1";
  temp_lang:string="en";
  displayResponsivepopup:boolean=false;
  currenttableheaders:any[]=[];
  isFixed:boolean=false;
  thumbnails:any[] = [];
  loading1:boolean =false;
  previousdoc:string = "";
  loading = false;
  analyzing = false;
  frp_id:any;
  connectionString:string="";
  containerName:string="";
  fieldid:any;
  saving=false;
  currentangle:any;
  currentfiletype:string="";
  ready = false;
  dragdisable= false;
  currentfieldindex:number=0;
  fileurl = "";
  currentfile:string = "";
  currentpage: string = '';
  currentindex: number = 0;
  maxpage:number=0;
  fieldsfile:any = {}
  fields:any[]=[];
  columnfields:any[]=[];
  rowfields:any[]=[];
  colors:string[]= [];
  zoomVal:number = 0.6;
  jsonresult:any = {};
  readResults:any[]=[];
  currenttext:string="";
  labelsJson={};
  showtags:boolean = true;
  showtabletags:boolean = false;
  loadingIndex: number | null = null;
  loadingtableIndex: boolean = false;
  target:any;
  currentSelection:any[]=[];
  // currentwidth:any;
  currentwidth:number;
  currentheight:number;
  p_name:any;
  rows:any[]=[];
  rownumber:number = 0;
  tablefields:any[]= [];
  tabledetails:{};
  options:any;
  pid:any;
  htmlstring:string;
  sanitizedHtml: SafeHtml;
  fuse:any;
  htmlArray: any[] = [];
  savedhtmltags: boolean = false;
  savedhtmlbtntext: string = "Save Tags Info";
  tagid:string="";
  tagtext:string="";
  @Input() showtab:any;
  @Output() changeTab = new EventEmitter<{'show1':boolean,'show2':boolean,'show3':boolean,'show4':boolean}>();
  drawStartX: number;
  drawStartY: number;
  drawingRect: any;
  selectedRect: any;
  toDelete:any[]= [];
  ocr_version: any;
  constructor(private domSanitizer: DomSanitizer,private sharedService:SharedService,private router:Router,private sanitizer: DomSanitizer) { 
    this.fieldsfile = {}
    this.options = {'rect':{'minWidth':10,'minHeight':10}}
    this.columnfields = [{'fieldKey':'','fieldType':'string','fieldFormat':'not-specified','itemType':null,'fields':null}]
    this.rows = [0];
    this.temp_lang = sessionStorage.getItem("temp_lang");
    sessionStorage.setItem("layoutInfo",JSON.stringify({}));
    sessionStorage.removeItem("htmlInfo");
    sessionStorage.removeItem("htmlArray");
    this.modelData = JSON.parse(sessionStorage.getItem("modelData"));
    this.ocr_version = this.modelData?.model_version || 'v2.1';
    router.events.forEach((event) => {
      if(event instanceof NavigationStart && router.url == '/IT_Utility/training') {
        
      }
    });
  }
  bestMatch(targetId:string){
    if(this.alldivs[this.currentindex]){
      let result = this.fuse.search(targetId);
      if (result.length > 0) {
        return result[0];
      } else {
        console.warn("No matching result found");
        return null;
      }
    }
    return null;
  }  
  createRect(x:any, y:any, w:any, h:any) {
    return $('<div/>').css({
        left: x,
        top: y,
        width: w,
        height: h,
        'position': 'absolute',
        'border': '2px solid rgba(199, 25, 9, 0.64)',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        '-o-user-select': 'none',
        'user-select': 'none',
        'z-index': 5000
    }).appendTo($("#parentcanvas"+this.currentindex));
  }
  startDrawRect(e:any) {
    let offset = $("#canvas"+this.currentindex).offset();
    this.drawStartX = e.clientX - offset.left;
    this.drawStartY = e.clientY - offset.top;
    this.drawingRect = this.createRect(this.drawStartX, this.drawStartY, 0, 0);
  }
  drawRect(e:any) {
    let offset = $("#canvas"+this.currentindex).offset();
    let currentX = e.clientX - offset.left;
    let currentY = e.clientY - offset.top;
    let position = this.calculateRectPos(this.drawStartX, this.drawStartY, currentX, currentY);
    this.drawingRect.css(position);
  }
   endDrawRect(e:any) {
    let offset = $("#canvas"+this.currentindex).offset();
    let currentX = e.clientX - offset.left;
    let currentY = e.clientY - offset.top;
    let position = this.calculateRectPos(this.drawStartX, this.drawStartY, currentX, currentY);
      if (position.width < this.options.rect.minWidth || position.height < this.options.rect.minHeight) {
        this.drawingRect.remove();
      }else {
        this.drawingRect.css(position);
        this.selectRect(this.drawingRect);
      }
    }
    selectRect(rect:any) {
      this.selectedRect && this.selectedRect.removeClass('selected');
      this.selectedRect = rect;
      this.selectedRect.addClass('selected');
    }
    calculateRectPos(startX, startY, endX, endY) {
      var width = endX - startX;
      var height = endY - startY;
      var posX = startX;
      var posY = startY;
      if (width < 0) {
          width = Math.abs(width);
          posX -= width;
      }
      if (height < 0) {
          height = Math.abs(height);
          posY -= height;
      }
      return {
          left: posX,
          top: posY,
          width: width,
          height: height
      };
    }
  activateDraw(){
    if(this.activatedrw == false){
      let _this = this;
      this.activatedrw = true;
      this.dragdisable = true;
      $("#canvas"+this.currentindex).mousedown(function (e) {
        _this.startDrawRect(e);
        $("#canvas"+_this.currentindex).bind('mousemove',function(e){
          _this.drawRect(e);
         })
      });
      $("#canvas"+this.currentindex).mouseup(function (e) {
        _this.endDrawRect(e);
        $("#canvas"+_this.currentindex).unbind('mousemove');
      });
      (<HTMLDivElement>document.getElementById("drawdiv")).style.backgroundColor = '#888888';
      (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.cursor = 'crosshair';
    }else{
      this.activatedrw = false;
      this.dragdisable = false;
      $("#canvas"+this.currentindex).unbind("mousedown");
      $("#canvas"+this.currentindex).unbind("mouseup");
      $("#canvas"+this.currentindex).unbind("mousemove");
      (<HTMLDivElement>document.getElementById("drawdiv")).style.backgroundColor = 'transparent';
      (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.cursor = 'default';
    }
  }
  async ngOnInit(){
    this.setup();
    let _this = this;
    document.addEventListener('keydown',function(e){
      if((_this.router.url == '/IT_Utility/training') && e.key == 'Control' || e.key == '+' || e.key == '-' || e.key == '='){
        e.preventDefault();
      }
    },{passive:false})
    // document.addEventListener('wheel',function(e){
    //   if(_this.router.url == '/IT_Utility/training'){
    //     e.preventDefault();
    //   }
    // },{passive:false})
  }
  async deleteBlob(i){
    let filename = this.modelData.folderPath+"/"+Object.keys(this.thumbnails[i])[0];
    this.sharedService.deleteBlob(filename).subscribe(data => {
      this.thumbnails.splice(i,1);
    })
  }

  downloadBlob(filename) {
      const link = document.createElement('a');
      link.href = this.fileurl;
      link.setAttribute('download', filename);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  ngAfterViewInit(): void {
    sessionStorage.setItem("configData",JSON.stringify(this.frConfigData));
  }
  addTableRow(){
    this.rownumber += 1
    this.rows.push(this.rownumber);
  }
  navigatetoPage(page:string){
    if(page == 'tagging'){
      this.changeTab.emit({'show1':true,'show2':false,'show3':false,'show4':false});
    }else if(page == 'training'){
      this.changeTab.emit({'show1':false,'show2':true,'show3':false,'show4':false});
    }else if(page == 'composing'){
      this.changeTab.emit({'show1':false,'show2':false,'show3':true,'show4':false});
    }else{
      this.changeTab.emit({'show1':false,'show2':false,'show3':false,'show4':true});
    }
  }
  getHighest(val,comp){
    if(val > comp){
      return val;
    }
    return comp;
  }
  async setInitialTableCellTag() {
    try {
      this.tabledetails = {}
      for(let v of this.tablefields){
        this.tabledetails[v.fieldKey] = 0;
        for(let l of this.labelsJson["labels"]){
          if(l.label.startsWith(v.fieldKey)){
            let val = Number(l.label.split("/")[1]);
            let highest = this.getHighest(val,this.tabledetails[v.fieldKey]);
            this.tabledetails[v.fieldKey] = highest;
          }
        }
      }
      // Pre-filter labelsJson based on tablefields
      const filteredLabels = {};
      for (const v of this.tablefields) {
        const filtered = this.labelsJson["labels"].filter(l => l.label.startsWith(v.fieldKey));
        filteredLabels[v.fieldKey] = filtered;
      }
      // Set initial table cell tags
      for (const v of this.tablefields) {
        for (const l of filteredLabels[v.fieldKey]) {
          const index = this.labelsJson["labels"].findIndex(el => el.label == l.label);
          let unsorted = this.labelsJson["labels"][index]["value"];

          for (let o = 0; o < unsorted.length; o++) {
            let boundingBox;
            if (this.currentfiletype === 'application/pdf') {
              boundingBox = this.convertInchToPixel(unsorted[o].boundingBoxes[0]);
            } else {
              boundingBox = this.convertImagePixelToPixel(unsorted[o].boundingBoxes[0]);
            }
            boundingBox[0] = Math.round(boundingBox[0] * this.currentwidth);
            boundingBox[1] = Math.round(boundingBox[1] * this.currentheight);

            if (!isNaN(boundingBox[0]) && !isNaN(boundingBox[1])) {
              const divid = `rect${this.currentindex}${unsorted[o].text}${boundingBox[0]}${boundingBox[1]}`;
              const bestmatch = await this.bestMatch(divid);

              if (bestmatch && document.getElementById(String(bestmatch["item"]))) {
                unsorted[o].line = Number((<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).getAttribute("line"));
              }
            }
          }

          // Sort the unsorted array
          unsorted = unsorted.sort((a: any, b: any) => a.line - b.line || a.boundingBoxes[0][0] - b.boundingBoxes[0][0]);

          // Update labelsJson
          this.labelsJson["labels"][index]["value"] = unsorted.map(s => ({
            page: s.page,
            text: s.text,
            boundingBoxes: s.boundingBoxes
          }));

          // Update DOM elements
          for (let i = 0; i < unsorted.length; i++) {
            let boundingBox;
            if (this.currentfiletype === 'application/pdf') {
              boundingBox = this.convertInchToPixel(unsorted[i].boundingBoxes[0]);
            } else {
              boundingBox = this.convertImagePixelToPixel(unsorted[i].boundingBoxes[0]);
            }
            boundingBox[0] = Math.round(boundingBox[0] * this.currentwidth);
            boundingBox[1] = Math.round(boundingBox[1] * this.currentheight);

            if (!isNaN(boundingBox[0]) && !isNaN(boundingBox[1])) {
              const divid = `rect${unsorted[i].page}${unsorted[i].text}${boundingBox[0]}${boundingBox[1]}`;
              const bestmatch = await this.bestMatch(divid);
              if (bestmatch) {
                const div = document.getElementById(String(bestmatch["item"]));
                if (div) {
                  div.style.backgroundColor = 'transparent';
                  div.setAttribute("selected", "false");
                  div.setAttribute("fieldid", l.label);
                  div.style.borderColor = 'rgb(0, 121, 255)';
                  div.style.borderStyle = 'solid';
                  div.style.borderWidth = '2px';
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in setInitialTableCellTag:", error);
    }
  }
  async setTableCellTag(index,fieldKey){
    this.loadingtableIndex = true;
      this.tabledetails[this.currenttable] = index;
      if(this.labelsJson["labels"].findIndex(v => v.label == this.currenttable+"/"+index+"/"+fieldKey) == -1){
        this.labelsJson["labels"].push({'label':this.currenttable+"/"+index+"/"+fieldKey,'key':null,'value':[]});
      }
      let tabindex = this.labelsJson["labels"].findIndex(v => v.label == this.currenttable+"/"+index+"/"+fieldKey); 
      let arr = this.currentSelection;
      for(let i=0;i<arr.length;i++){
        let boundingbox = [arr[i].x,arr[i].y,arr[i].x2,arr[i].y2,arr[i].w,arr[i].h,arr[i].x4,arr[i].y4];
        if(this.currentfiletype == 'application/pdf'){
          boundingbox = this.convertPixelToInch(boundingbox);
        }else{
          boundingbox = this.convertPixeltoImagePixel(boundingbox);
        }
        if(!this.checkFieldExists({page:this.currentindex,text:arr[i].text,boundingBoxes:[boundingbox]})){
          this.labelsJson["labels"][tabindex]["value"].push({page:this.currentindex,text:arr[i].text,boundingBoxes:[boundingbox]})
          let divid = "rect"+this.currentindex+arr[i].text+Math.round(arr[i].x)+Math.round(arr[i].y);
          let bestmatch = this.bestMatch(divid);
          if(bestmatch){
            let div = (<HTMLDivElement>document.getElementById(String(bestmatch["item"])));
            if(div){
              div.style.backgroundColor = 'transparent';
              div.setAttribute("selected","false");
              div.setAttribute("fieldid",this.currenttable+"/"+index+"/"+fieldKey);
              div.style.borderColor = 'rgb(0, 121, 255)';
              div.style.borderStyle = 'solid';
              div.style.borderWidth = 'medium';
            }
          }
        }
      }
      let unsorted = this.labelsJson["labels"][tabindex]["value"];
        for(let o=0;o<unsorted.length;o++){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(unsorted[o].boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(unsorted[o].boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          let divid = "rect"+this.currentindex+unsorted[o].text+boundingBox[0]+boundingBox[1];
          let bestmatch = this.bestMatch(divid);
          if(bestmatch)
          unsorted[o].line = Number((<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).getAttribute("line"));
        }
        unsorted = unsorted.sort((a:any,b:any) => {
          return a.line - b.line || a.boundingBoxes[0][0] - b.boundingBoxes[0][0]; 
        })
        this.labelsJson["labels"][tabindex]["value"] = unsorted.map(s => ({
          page : s.page,
          text : s.text,
          boundingBoxes : s.boundingBoxes
        }))
      this.labelsJson = await this.customMizeLabels(this.labelsJson);
      let frobj = {
        'documentId':this.modelData.idDocumentModel,
        'container':this.frConfigData[0].ContainerName,
        'connstr':this.frConfigData[0].ConnectionString,
        'filename':this.modelData.folderPath+"/"+this.currentfile,
        'saveJson':null,
        'labelJson':this.labelsJson
      }
      this.sharedService.saveLabelsFile(frobj).subscribe((data:any) => {
        this.loadingtableIndex  = false;
      })
      this.currenttext =  this.labelsJson["labels"][tabindex]["value"].map(function(element){return element.text}).join(" ");
      (<HTMLDivElement>document.getElementById(this.currenttable+"/"+index+"/"+fieldKey)).innerHTML = `${this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div>`;
      if(this.temp_lang == "ar"){
        (<HTMLDivElement>document.getElementById(this.currenttable+"/"+index+"/"+fieldKey)).innerHTML = `<div dir="rtl">${this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div></div>`;
      }
      this.currentSelection = [];
      this.currenttext = "";
  }
 
  mouseEnter(field){
      let index = this.labelsJson["labels"].findIndex(el => el.label == field);
      if(index != -1){
        for(let v of this.labelsJson["labels"][index]["value"]){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(v.boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(v.boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          let divid = "rect"+this.currentindex+v.text+boundingBox[0]+boundingBox[1];
          let bestmatch = this.bestMatch(divid)
          if(bestmatch && <HTMLDivElement>document.getElementById(String(bestmatch["item"]))){
            (<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).style.transform = 'scale(2)';
          }
        }
      }
  }
  mouseLeave(field){
    let index = this.labelsJson["labels"].findIndex(el => el.label == field);
      if(index != -1){
        for(let v of this.labelsJson["labels"][index]["value"]){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(v.boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(v.boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          let divid = "rect"+this.currentindex+v.text+boundingBox[0]+boundingBox[1];
          let bestmatch = this.bestMatch(divid)
          if(bestmatch && <HTMLDivElement>document.getElementById(String(bestmatch["item"]))){
            (<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).style.transform = 'scale(1)';
          }
        }
      }
  }
  resetTagging(opt:any){
    let model_id = this.modelData.idDocumentModel;
    let folderPath = this.modelData.folderPath;
    let filename = null;
    let resetObj = {'model_id':model_id,'folderpath':folderPath}
    if(opt == "currentfile"){
      filename = folderPath+"/"+this.currentfile+".labels.json";
    }
    this.sharedService.resetTagging(resetObj,filename).subscribe((data:any) =>{
      if(data['message'] == 'success'){
        location.reload()
      }
    })
  }
  
  async setup(){
      try {
        if(!this.modelData || !this.frConfigData){
          this.modelData = JSON.parse(sessionStorage.getItem("modelData"));
          this.frConfigData = JSON.parse(sessionStorage.getItem("configData")); 
        }
        this.loading = true;
        this.connectionString = this.frConfigData[0].ConnectionString;
        this.containerName = this.frConfigData[0].ContainerName;
        if(this.modelData){
          this.sharedService.getTaggingInfo(this.containerName,this.modelData.folderPath,this.connectionString,this.modelData.idDocumentModel).subscribe((data:any) => {
            this.resp = data;
            this.loading = false;
          if(this.resp['message'] == 'success'){
            this.thumbnails = this.resp['file_list']
            if(this.resp['fieldexist']){
              this.fieldsfile = this.resp['fields'];
              this.fields = this.fieldsfile['fields'];
              this.tablefields = this.fields.filter(v => v.fieldType == 'array');
              for(let f=0;f<=this.fields.length;f++){
                this.randomHsl(f);
              }
            }
            setTimeout(() => {
              this.SelectDoc(0);
            }, 50);
          }
          })
        }
      }catch(ex){
        console.log(ex)
      }
  
  }
  clearFields(){
    for(let i=0;i<this.fields.length;i++){
      let div = (<HTMLDivElement>document.getElementById("field-"+this.fields[i].fieldKey));
      if(div){
        div.innerHTML = "";
      }
    }
  }
  addColumnFields(){
    this.columnfields.push({'fieldKey':'','fieldType':'string','fieldFormat':'not-specified','itemType':null,'fields':null})
  }
  setTableFieldKey(i){
    this.columnfields[i]['fieldKey'] = (<HTMLInputElement>document.getElementById("columnfield"+i)).value.replace("/"," ");
  }
  setTableFieldType(e,i){
    this.columnfields[i]['fieldType'] = e.target.value;
  }
  setTableFieldFormat(e,i){
    this.columnfields[i]['fieldFormat'] = e.target.value;
  }
  addTag(){
    let div = (<HTMLDivElement>document.getElementById("newtag"));
    if(div.style.display == 'block'){
      div.style.display = 'none';
    }else{
      div.style.display = 'block';
    }
  }
  async deleteTag(f){
    this.fieldsfile["fields"] = this.fieldsfile["fields"].filter(v => v.fieldKey != f.fieldKey);
    this.fields = this.fieldsfile["fields"];
    let frobj = {
      'fields':this.fieldsfile,
      'documentId':this.modelData.idDocumentModel,
      'container':this.frConfigData[0].ContainerName,
      'connstr':this.frConfigData[0].ConnectionString,
      'folderpath':this.modelData.folderPath
    }
    this.sharedService.saveFieldsFile(frobj).subscribe((data:any) => {
    })
  }
  async setTag(){
    let value = (<HTMLInputElement>document.getElementById("newtaginput")).value;
    if(value == ""){
      return;
    }
    if(!("$schema" in this.fieldsfile)){
      this.fieldsfile["$schema"] = "https://schema.cognitiveservices.azure.com/formrecognizer/2021-03-01/fields.json";
    }
    if(!("definitions" in this.fieldsfile)){
      this.fieldsfile["definitions"] = {}
    }
    if(!("fields" in this.fieldsfile)){
      this.fieldsfile["fields"] = [{'fieldKey':value,'fieldType':'string','fieldFormat':'not-specified'}]
    }else{
      this.fieldsfile["fields"].push({'fieldKey':value,'fieldType':'string','fieldFormat':'not-specified'})
    }
    this.fields = this.fieldsfile['fields'];
    for(let f=0;f< this.fields.length;f++){
      this.randomHsl(f);
    }
    let frobj = {
      'fields':this.fieldsfile,
      'documentId':this.modelData.idDocumentModel,
      'container':this.frConfigData[0].ContainerName,
      'connstr':this.frConfigData[0].ConnectionString,
      'folderpath':this.modelData.folderPath
    }
    this.sharedService.saveFieldsFile(frobj).subscribe((data:any) => {
    });
    (<HTMLInputElement>document.getElementById("newtaginput")).value = "";
  }
  async saveTableTag(){
    if(!this.isFixed){
      this.columnfields = this.columnfields.filter(v => v.fieldKey != "");
      let value = (<HTMLInputElement>document.getElementById("tabletag")).value;
      if(value == null || value == ""){
        return;
      }
      if("fields" in this.fieldsfile){
        this.fieldsfile["fields"].push({"fieldKey":value,"fieldType":"array","fieldFormat":"not-specified","itemType":value+"_object","fields":null})
      }else{
        this.fieldsfile["fields"] = [{"fieldKey":value,"fieldType":"array","fieldFormat":"not-specified","itemType":value+"_object","fields":null}]
      }
      if(!("definitions" in this.fieldsfile)){
        this.fieldsfile["definitions"] = {}
      }
      if(!(value+"_object" in this.fieldsfile["definitions"])){
        this.fieldsfile["definitions"][value+"_object"] = {"fieldKey":value+"_object","fieldType":"object","fieldFormat":"not-specified","itemType":null,"fields":this.columnfields}
      }
      this.fields = this.fieldsfile['fields'];
      this.columnfields = [{'fieldKey':'','fieldType':'string','fieldFormat':'not-specified','itemType':null,'fields':null}];
      this.showtags = false;
      this.showtabletags = false;
      this.addTableTag();
      let frobj = {
        'fields':this.fieldsfile,
        'documentId':this.modelData.idDocumentModel,
        'container':this.frConfigData[0].ContainerName,
        'connstr':this.frConfigData[0].ConnectionString,
        'folderpath':this.modelData.folderPath
      }
      this.sharedService.saveFieldsFile(frobj).subscribe((data:any) => {
      })
    }
  }
  getBackgroundColor(fieldType){
    return fieldType == 'array' ? 'rgb(0, 121, 255)' : 'rgb(9, 179, 60)';
  }
  startTableTagging(fieldindex,fieldKey){
    (<HTMLDivElement>document.getElementById("hidden"+this.currentindex)).style.display = 'none';
    this.currentfieldindex = fieldindex;
    this.currenttable = fieldKey;
    this.currenttableheaders = this.fieldsfile["definitions"][fieldKey+"_object"]["fields"];
    this.showtags = true;
    this.showtabletags = true;
    (<HTMLDivElement>document.getElementById("tagdiv")).style.flex = '38%';
    let endpoint = this.tabledetails[this.currenttable] + 1;
    this.rows = this.counter(endpoint);
    setTimeout(() => {
      for(let i = 0;i<endpoint;i++){
        for(let l of this.labelsJson["labels"]){
          if(l.label.startsWith(this.currenttable)){
            let labelindex = this.labelsJson["labels"].findIndex(el => el.label === l.label);
            if((<HTMLDivElement>document.getElementById(l.label))){
              this.currenttext = this.labelsJson["labels"][labelindex]["value"].map(function(element){return element.text}).join(" ");
              (<HTMLDivElement>document.getElementById(l.label)).innerHTML = `${this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div>`;
              if(this.temp_lang == "ar"){
                (<HTMLDivElement>document.getElementById(l.label)).innerHTML = `<div dir="rtl">${this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div></div>`;
              }
            }
          }
        }
      }
    }, 50);
  }
  
  async stopTableTagging(){
    this.showtags = true;
    this.showtabletags = false;
    (<HTMLDivElement>document.getElementById("tagdiv")).style.flex = '19%';
    setTimeout(() => {
      let inc = 0;
      for (let f of this.fields){
        this.setinitial(inc,f);
        inc++;
      }  
      let div = (<HTMLDivElement>document.getElementById("newtag"));
      div.style.display = 'none';
    }, 500);
  }
  addTableTag(){
    if(this.showtags == true && this.showtabletags == false){
      this.showtags = false;
      (<HTMLDivElement>document.getElementById("tagdiv")).style.flex = '38%';
    }else if(this.showtags == false && this.showtabletags == false){
      this.showtags = true;
      (<HTMLDivElement>document.getElementById("tagdiv")).style.flex = '19%';
      setTimeout(() => {
        let inc = 0;
        for (let f of this.fields){
          this.setinitial(inc,f);
          inc++;
        }  
      }, 50);
    }
    
  }
  cancelTableTag(){
    this.showtags = true;
    this.showtabletags = false;
    (<HTMLDivElement>document.getElementById("tagdiv")).style.flex = '19%';
    setTimeout(() => {
      let inc = 0;
      for (let f of this.fields){
        this.setinitial(inc,f);
        inc++;
      } 
      let div = (<HTMLDivElement>document.getElementById("newtag"));
      div.style.display = 'none'; 
    }, 50);
  }
  randomHsl(i:number) {
    let color = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
    if(this.colors.includes(color)){
      this.randomHsl(i);
    }else{
      if(!this.colors[i]){
        this.colors[i] = color;
      }else{
        color = this.colors[i];
      }
    }
    return color; 
  }
  setcolor(i:number){
    return this.colors[i];
  }
  domsanitize(str:string){
    return this.domSanitizer.bypassSecurityTrustUrl(str);
  }
  
 async clearTableTags(){
    let existingfields = [];
    if(this.fieldsfile['definitions']){
      for(let v of this.fieldsfile['definitions'][this.currenttable+'_object']['fields']){
        existingfields.push(v.fieldKey);
      }
      for(let l of this.labelsJson["labels"]){
        let labelindex = this.labelsJson["labels"].findIndex(el => el.label === l.label);
        if(l.label.startsWith(this.currenttable)){
          if(!existingfields.includes(this.labelsJson["labels"][labelindex].label.split("/")[2])){
            this.labelsJson["labels"].splice(labelindex,1);
          }
        }
        if(this.labelsJson["labels"][labelindex].value.length == 0){
          this.labelsJson["labels"].splice(labelindex,1);
        }
      }
      let frobj = {
        'documentId':this.modelData.idDocumentModel,
        'container':this.frConfigData[0].ContainerName,
        'connstr':this.frConfigData[0].ConnectionString,
        'filename':this.modelData.folderPath+"/"+this.currentfile,
        'saveJson':null,
        'labelJson':this.labelsJson
      }
      this.sharedService.saveLabelsFile(frobj).subscribe((data:any) => {
      })
    }
    
  }
  onTagHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tagElement = target.closest('.tag');
    if (tagElement) {
      tagElement.classList.toggle('highlight');
    }
  }
  onTagClick(event: MouseEvent): void{
    const target = event.target as HTMLElement;
    const tagElement = target.closest('.tag');
    let tagpresent = false;
    if(tagElement){
      this.tagid = tagElement.getAttribute("id");
      this.tagtext = tagElement.textContent.trim().replace(/\s+/g, ' ').replace(/\n/g, '');
      for(let obj of this.htmlArray){
        let key = Object.keys(obj)[0];
        let id = obj[key]["id"];
        if(id == this.tagid){
          tagpresent = true;
        }
      }
      if(tagpresent){
        tagElement.classList.toggle("mark1");
        const index = this.toDelete.indexOf(this.tagid); // Find the index of the element
        if (index !== -1) {
          this.toDelete.splice(index, 1); // Remove the element from the array
        }else{
          this.toDelete.push(this.tagid);
        }
      }else{
        tagElement.classList.toggle("mark");
      }
    }
  }
  SetHTMLField(i:any,f:any){
    if(this.tagtext != ""){
      (<HTMLDivElement>document.getElementById("field-"+f.fieldKey)).innerHTML = this.tagtext;
      let obj = {}
      obj[f.fieldKey] = {"id":this.tagid,"text":this.tagtext}
      this.htmlArray.push(obj);
      this.tagtext = "";
      this.tagid = "";
    }
  }
  saveFieldsData(){
    this.saving = true;
    this.sharedService.saveHTMLFields(this.htmlArray,this.modelData.modelName).subscribe(data => {
      this.saving = false;
    })
  }
  async analyzeDocumentHTML(filename:string){
    let full_filename = this.modelData.folderPath+"/"+filename;
    this.ready = false;
    if(sessionStorage.getItem("htmlInfo") != null && sessionStorage.getItem("htmlArray") != null){
      this.ready = true;
      this.htmlstring = sessionStorage.getItem("htmlInfo");
      this.htmlArray = JSON.parse(sessionStorage.getItem("htmlArray"));
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlstring);
      setTimeout(() => {
        this.setHTMLFields();
      }, 1000);
    }else{
      this.sharedService.getAnalyzeResultHTML(full_filename).subscribe(data=>{
        this.ready = true;
        if(data.message == "success"){
          this.htmlstring = data.content;
          this.htmlArray = data.fields;
          this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlstring);
          sessionStorage.setItem("htmlInfo",data.content);
          sessionStorage.setItem("htmlArray",JSON.stringify(data.fields));
          setTimeout(() => {
            this.setHTMLFields();
          }, 1000);
        }
      })
    }
  }
  setHTMLFields(){
    if(this.htmlArray && this.htmlArray.length > 0){
      this.savedhtmltags = true;
      this.savedhtmlbtntext = "Saved!"
    }else{
      this.htmlArray = [];
      this.savedhtmltags = false;
      this.savedhtmlbtntext = "Save Tags Info"
    }
    for(let obj of this.htmlArray){
      let key = Object.keys(obj)[0];
      let id = obj[key]["id"];
      let text = obj[key]["text"];
      (<HTMLElement>document.getElementById(id)).classList.add("mark");
      (<HTMLDivElement>document.getElementById("field-"+key)).innerHTML = text;
    }
    let _this = this;
    document.addEventListener('keydown',async function(eve){
      const key = eve.key;
      if(key === 'Delete'){
        for(let obj of _this.htmlArray){
          let key = Object.keys(obj)[0];
          let id = obj[key]["id"];
          if(_this.toDelete.includes(id)){
            const filteredData = _this.htmlArray.filter(obj => !obj.hasOwnProperty(key));
            _this.htmlArray = filteredData;
            const index = _this.toDelete.indexOf(id); // Find the index of the element
            if (index !== -1) {
              _this.toDelete.splice(index, 1); // Remove the element from the array
            }
            (<HTMLDivElement>document.getElementById(id)).classList.remove("mark1");
            (<HTMLDivElement>document.getElementById(id)).classList.remove("mark");
            (<HTMLDivElement>document.getElementById("field-"+key)).innerHTML = "";
          }
        }
      }
    });
  }
  async customMizeLabels(labelsJson:any){
    const ocr_engine_version =  this.ocr_version
    if (ocr_engine_version === "v2.1") {
      if (!labelsJson["labelingState"]) {
          labelsJson["labelingState"] = 2;
      }
      labelsJson["labels"].forEach(item => {
        if (!item.hasOwnProperty('key')) {
            item.key = null;
        }
    });
      labelsJson["labels"].forEach(item => {
        if (item.hasOwnProperty('labelType')) {
            delete item.labelType;
        }
    });
  }else if (ocr_engine_version === "2022-08-31" || ocr_engine_version === "2023-07-31") {
      if (labelsJson["labelingState"]) {
          delete labelsJson["labelingState"];
      }
      labelsJson["labels"].forEach(item => {
        if (item.hasOwnProperty('key')) {
            delete item.key;
        }
      });
      labelsJson["labels"].forEach(item => {
        if (!item.hasOwnProperty('labelType')) {
            item["labelType"] = "Words";
        }
      });
    }
    return labelsJson
  }
  async analyzeDocument(id: any, filename: string, data: Object) {
    // const instanceConfig = JSON.parse(sessionStorage.getItem('instanceConfig'));
    const ocrEngineVersion =  this.ocr_version || 'v.21';

    this.showtags = true;
    this.showtabletags = false;
    const tagDiv = document.getElementById("tagdiv") as HTMLDivElement;
    tagDiv.style.flex = '19%';

    this.clearFields();
    this.labelsJson = {};

    if (Object.keys(data['labels']).length > 0) {
        this.labelsJson = JSON.parse(data['labels'].blob);
        this.labelsJson["document"] = this.currentfile;
        this.labelsJson = await this.customMizeLabels(this.labelsJson);
    } else {
        this.labelsJson["$schema"] = "https://schema.cognitiveservices.azure.com/formrecognizer/2021-03-01/labels.json";
        this.labelsJson["document"] = this.currentfile;
        this.labelsJson["labels"] = [];
        if (ocrEngineVersion === "v2.1") {
            this.labelsJson["labelingState"] = 2;
        }
    }

    this.alldivs = {};
    this.clearTableTags();
    this.analyzing = true;
    this.layouttext = "Running Layout. Please Wait!";
    this.ready = false;

    const stickyDiv = document.getElementById("sticky") as HTMLDivElement;
    stickyDiv.classList.remove("sticky-top");

    const frobj = {
        container: this.frConfigData[0].ContainerName,
        account: this.frConfigData[0].ConnectionString.split("AccountName=")[1].split(";AccountKey")[0],
        connstr: this.frConfigData[0].ConnectionString,
        fr_endpoint: this.frConfigData[0].Endpoint,
        fr_key: this.frConfigData[0].Key1,
        filename: `${this.modelData.folderPath}/${filename}`
    };

    const layoutInfo = sessionStorage.getItem("layoutInfo");
    if (layoutInfo && this.modelData.folderPath + "/" + filename in JSON.parse(layoutInfo)) {
        await this.processLayoutFromStorage(layoutInfo, filename, ocrEngineVersion);
    } else {
        this.sharedService.getAnalyzeResult(frobj, this.ocr_version).subscribe(async (data: any) => {
            await this.processAnalyzeResult(data, filename, ocrEngineVersion);
        });
    }
}

private async processLayoutFromStorage(layoutInfo: string, filename: string, ocrEngineVersion: string) {
    this.analyzing = false;
    this.ready = true;

    const layout = JSON.parse(layoutInfo);
    this.jsonresult = layout[this.modelData.folderPath + "/" + filename]["jsonresult"];
    this.currentfiletype = layout[this.modelData.folderPath + "/" + filename]["currentfiletype"];

    this.zoomVal = this.currentfiletype === 'application/pdf' ? 0.6 : 1;

    const obj = this.getReadResults(ocrEngineVersion);
    this.readResults = obj;
    this.setCurrentDimensions(obj[0]);

    this.fileurl = layout[this.modelData.folderPath + "/" + filename]['file_url'];
    await this.loadFile(this.fileurl, this.currentfiletype);

    setTimeout(async () => {
        await this.drawAllCanvases(ocrEngineVersion);
        this.fuse = new Fuse(this.alldivs[this.currentindex], {
          threshold: 0.3, // Adjust the threshold as needed
          keys: [], // The keys to search for similarity
        });
        this.initializeFields();
    }, 500);
}

private async processAnalyzeResult(data: any, filename: string, ocrEngineVersion: string) {
    this.resp = data;
    this.analyzing = false;
    this.ready = true;

    if (this.resp['message'] === 'success') {
        const stickyDiv = document.getElementById("sticky") as HTMLDivElement;
        stickyDiv.classList.add("sticky-top");

        this.jsonresult = this.resp['json_result'];
        this.currentfiletype = this.resp['content_type'];
        this.zoomVal = this.currentfiletype === 'application/pdf' ? 0.6 : 1;

        const layout = JSON.parse(sessionStorage.getItem("layoutInfo") || '{}');
        layout[this.modelData.folderPath + "/" + filename] = {
            "jsonresult": this.resp['json_result'],
            "file_url": this.resp["file_url"],
            "currentfiletype": this.resp['content_type']
        };
        sessionStorage.setItem("layoutInfo", JSON.stringify(layout));

        const obj = this.getReadResults(ocrEngineVersion);
        this.readResults = obj;
        this.setCurrentDimensions(obj[0]);

        this.fileurl = this.resp['file_url'];
        await this.loadFile(this.fileurl, this.currentfiletype);
        setTimeout(async () => {
            await this.drawAllCanvases(ocrEngineVersion);
            this.fuse = new Fuse(this.alldivs[this.currentindex], {
              threshold: 0.3, // Adjust the threshold as needed
              keys: [], // The keys to search for similarity
            });
            this.initializeFields();
        }, 500);
    }
}

private getReadResults(ocrEngineVersion: string): any[] {
    if (ocrEngineVersion === "v2.1") {
        return this.jsonresult['analyzeResult']['readResults'];
    } else {
        return this.jsonresult?.analyzeResult?.pages;
    }
}

private setCurrentDimensions(obj: any) {
    this.currentwidth = obj['width'];
    this.currentheight = obj['height'];
    this.currentangle = obj['angle'];
}

private async loadFile(fileurl: string, filetype: string) {
    if (filetype === 'application/pdf') {
        await this.loadPDF(fileurl);
    } else {
        await this.loadImage(fileurl);
    }
}

private async drawAllCanvases(ocrEngineVersion: string) {
    for (const obj of this.readResults) {
        this.alldivs[ocrEngineVersion === "v2.1" ? obj["page"] : obj["pageNumber"]] = [];
        if (ocrEngineVersion === "v2.1") {
            await this.drawCanvas(obj);
        } else {
            await this.drawCanvasv3(obj);
        }
    }
}

private initializeFields() {
    let inc = 0;
    for (const f of this.fields) {
        this.setinitial(inc, f);
        inc++;
    }

    const div = document.getElementById("newtag") as HTMLDivElement;
    div.style.display = 'none';
    this.setInitialTableCellTag();
}
  async loadPDF(pdfurl:string) {
    const loadingTask = await pdfjsLib.getDocument( pdfurl );
    let pdf = await loadingTask.promise;
    this.currentpage = "Page 1";
    this.currentindex = 1;
    this.maxpage = pdf.numPages;
    for(let i=1;i<=pdf.numPages;i++){
      let page = await pdf.getPage(i)   
      let scale = 1.5;  
      let viewport = page.getViewport({scale:scale});
      let canvas: any = document.getElementById('canvas'+i);
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      let renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext);
    }
  }

 async loadImage(fileurl){
  this.currentpage = "Page 1";
  this.currentindex = 1;
  this.maxpage = 1;
  setTimeout(() => {
    let canvas = (<HTMLCanvasElement>document.getElementById('canvas1'));
    let ctx = (<CanvasRenderingContext2D>canvas.getContext('2d'));
    let img = new Image;
    img.onload = function(){
      ctx.drawImage(img,0,0); // Or at whatever offset you like
    };
    img.src = fileurl;
    canvas.height = this.currentheight;
    canvas.width = this.currentwidth;  
    }, 50);
}

  drawCanvas(obj){
    try{
      let _this = this;
      document.addEventListener('mousemove', function(event) {
        _this.target = event.target;
      }, false);
      const ZOOM_SPEED = 0.08;
      let pagenum = obj['page'];
      let parentdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
      if(parentdiv){
        parentdiv.addEventListener('mouseover',function(e){
          if(_this.activatedrw){
            _this.dragdisable = true;
          }else{
            _this.dragdisable = false;
          }
        })
      }
      document.addEventListener('wheel',function(e){
        if(_this.target.id == 'canvas'+pagenum){
          let scaletransform = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform;
          let res = scaletransform.split("scale")[0];
          if(_this.zoomVal <= 0.1 || _this.zoomVal >=3.0){
            _this.zoomVal = 1;
          }
          if(e.deltaY < 0){    
            res = res + `scale(${_this.zoomVal += ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform = res;  
          }else{    
            res = res + `scale(${_this.zoomVal -= ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform = res;  }  
          }
      })
      $("#parentcanvas"+pagenum+" div[id^='rect']").remove();
      let line = 0;
      let transformdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
      if(transformdiv && this.currentfiletype == 'application/pdf'){
        transformdiv.style.transform = 'translate3d(-18px, -300px, 0px) scale('+this.zoomVal+')';
      }
      for(let l of obj['lines']){
        let i = 0;
        for(let w of l['words']){
          let boundingbox = w.boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingbox = this.convertInchToPixel(boundingbox);
          }else{
            boundingbox = this.convertImagePixelToPixel(boundingbox);
          }
          let div : any = document.createElement('div');
          div.id = "rect"+pagenum+w.text+Math.round(boundingbox[0])+Math.round(boundingbox[1]);
          this.alldivs[pagenum].push(div.id);
          div.setAttribute("line",line);
          div.style.position = 'absolute';
          div.style.border = '1px solid yellow';
          div.style.top = boundingbox[1]+'px'
          div.style.left = boundingbox[0]+'px';
          div.style.width = boundingbox[4]+'px';
          div.style.height = boundingbox[5]+'px';
          div.style.zIndex = "5000";
          div.setAttribute("selected","false");
          let parentdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
          if(parentdiv){
            parentdiv.appendChild(div)
          }
          i++;
          let popdiv = (<HTMLDivElement>document.getElementById("hidden"+pagenum));
          if(popdiv){
            popdiv.style.display = 'none';  
          }
          div.addEventListener('mousedown',function(eve){
            if(_this.activatedrw){
              return;
            }
            if(div.getAttribute("selected") == "false"){
              if(!_this.showtabletags){
                popdiv.style.position = 'absolute';
                popdiv.style.display = 'block';
                popdiv.style.zIndex = '10000';
                popdiv.style.background = '#F8F8FF'
                popdiv.style.color = '#f1c40f';
                popdiv.style.top = boundingbox[1]+15+"px";
                popdiv.style.left = boundingbox[0]+10+"px";
              }
              div.setAttribute("selected","true")
              div.style.backgroundColor = "rgba(0,255,0,0.4)"
              _this.displayResponsivepopup = true;
              _this.top = boundingbox[1]+10;
              _this.currentSelection.push({'x':boundingbox[0],'y':boundingbox[1],'w':boundingbox[4],'h':boundingbox[5],'x2':boundingbox[2],'y2':boundingbox[3],'x4':boundingbox[6],'y4':boundingbox[7],'text':w.text,'line':Number(div.getAttribute("line")),'div':div.id})
              if(_this.currentSelection.length > 1){
                _this.currentSelection = _this.currentSelection.sort((a,b) => {
                  return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                })
              }
            }else{
              div.setAttribute("selected","false")
              div.style.backgroundColor = "transparent";
              _this.currentSelection = _this.currentSelection.filter(a => a.div != div.id);
              if(_this.currentSelection.length > 1){
                _this.currentSelection = _this.currentSelection.sort((a,b) => {
                  return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                })
              }
            }
            if(_this.currentSelection.length == 0){
              popdiv.style.display = 'none';
            }
          });
          div.addEventListener('mouseenter',function(eve){
            if(_this.activatedrw){
              _this.dragdisable = true;
              return;
            } 
            _this.dragdisable = true;
            if(eve.which == 1){
            if(div.getAttribute("selected") == "false"){
                div.setAttribute("selected","true")
                if(div.style.backgroundColor != "rgba(0,255,0,0.4)"){
                  if(!_this.showtabletags){
                    popdiv.style.position = 'absolute';
                    popdiv.style.display = 'block';
                    popdiv.style.zIndex = '10000';
                    popdiv.style.background = '#F8F8FF'
                    popdiv.style.color = '#f1c40f';
                    popdiv.style.top = boundingbox[1]+15+"px";
                    popdiv.style.left = boundingbox[0]+10+"px";
                  }
                  div.style.backgroundColor = "rgba(0,255,0,0.4)"
                  _this.currentSelection.push({'x':boundingbox[0],'y':boundingbox[1],'w':boundingbox[4],'h':boundingbox[5],'x2':boundingbox[2],'y2':boundingbox[3],'x4':boundingbox[6],'y4':boundingbox[7],'text':w.text,'line':Number(div.getAttribute("line")),'div':div.id})
                  if(_this.currentSelection.length > 1){
                    _this.currentSelection = _this.currentSelection.sort((a:any,b:any) => {
                      return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                    })
                  }
                }
              }else{
                div.setAttribute("selected","false")
                div.style.backgroundColor = "transparent";
                _this.currentSelection = _this.currentSelection.filter(a => a.div != div.id);
                if(_this.currentSelection.length > 1){
                  _this.currentSelection = _this.currentSelection.sort((a,b) => {
                    return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                  })
                }
                if(_this.currentSelection.length == 0){
                  popdiv.style.display = 'none';
                }
              }
              
            }
          });
        }
        line++;
      }
      document.addEventListener('keydown',async function(eve){
          const key = eve.key;
          if(key === 'Delete'){
            _this.loadingtableIndex = true;
            let popdiv = (<HTMLDivElement>document.getElementById("hidden"+pagenum));
            if(popdiv){
              popdiv.style.display = 'none';
            }
            for(let m=0;m<_this.currentSelection.length;m++){
              let boundingbox = [_this.currentSelection[m].x,_this.currentSelection[m].y,_this.currentSelection[m].x2,_this.currentSelection[m].y2,_this.currentSelection[m].w,_this.currentSelection[m].h,_this.currentSelection[m].x4,_this.currentSelection[m].y4];
              if(_this.currentfiletype == 'application/pdf'){
                boundingbox = _this.convertPixelToInch(boundingbox);
              }else{
                boundingbox = _this.convertPixeltoImagePixel(boundingbox);
              }
              let divid = "rect"+_this.currentindex+_this.currentSelection[m].text+Math.round(_this.currentSelection[m].x)+Math.round(_this.currentSelection[m].y);
              let bestmatch = _this.bestMatch(divid)
              if(bestmatch){
                let div = (<HTMLDivElement>document.getElementById(String(bestmatch["item"])));
                if(div){
                  div.style.backgroundColor = 'transparent';
                  div.setAttribute("selected","false");
                  div.style.border = '1px solid yellow';
                  _this.fieldid = div.getAttribute("fieldid");
                  let index;
                  if(_this.fieldid){
                    if(!_this.fieldid.startsWith(_this.currenttable)){
                      let fieldKey = _this.fieldid.split("-")[1]
                      index =  _this.labelsJson["labels"].findIndex(el => el.label == fieldKey);
                      _this.loadingIndex = index;
                    }else{
                      index =  _this.labelsJson["labels"].findIndex(el => el.label == _this.fieldid);
                    }
                   
                    for(let v of _this.labelsJson["labels"][index]["value"]){
                      if(v.text == _this.currentSelection[m].text && v.boundingBoxes[0][0].toFixed(1) == boundingbox[0].toFixed(1) && v.boundingBoxes[0][1].toFixed(1) == boundingbox[1].toFixed(1)){
                        _this.labelsJson["labels"][index]["value"] = _this.labelsJson["labels"][index]["value"].filter(val => val != v);
                      }
                    }
                    _this.currenttext = _this.labelsJson["labels"][index]["value"].map(function(element){return element.text}).join(" ");
                    if(_this.fieldid.startsWith(_this.currenttable)){
                      _this.currenttext = `${_this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;"> ${_this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div>`;
                      if(_this.temp_lang == "ar"){
                        _this.currenttext = `<div dir="rtl">${_this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;"> ${_this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</div></div>`;
                      }
                    }
                    (<HTMLDivElement>document.getElementById(_this.fieldid)).innerHTML = _this.currenttext;
                  }
                }
              }
            }
            _this.labelsJson = await _this.customMizeLabels(_this.labelsJson);
            let frobj = {
              'documentId':_this.modelData.idDocumentModel,
              'container':_this.frConfigData[0].ContainerName,
              'connstr':_this.frConfigData[0].ConnectionString,
              'filename':_this.modelData.folderPath+"/"+_this.currentfile,
              'saveJson':null,
              'labelJson':_this.labelsJson
            }
            _this.sharedService.saveLabelsFile(frobj).subscribe((data:any) => {
              _this.loadingIndex = null;
              _this.loadingtableIndex = false;
            })
            _this.currenttext = "";
            _this.currentSelection = [];
          }
      });
    }catch(ex){
      console.log(ex);
    }
  }

  drawCanvasv3(obj){
    try{
      let _this = this;
      document.addEventListener('mousemove', function(event) {
        _this.target = event.target;
      }, false);
      const ZOOM_SPEED = 0.08;
      let pagenum = obj['pageNumber'];
      let parentdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
      if(parentdiv){
        parentdiv.addEventListener('mouseover',function(e){
          if(_this.activatedrw){
            _this.dragdisable = true;
          }else{
            _this.dragdisable = false;
          }
        })
      }
      document.addEventListener('wheel',function(e){
        if(_this.target.id == 'canvas'+pagenum){
          let scaletransform = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform;
          let res = scaletransform.split("scale")[0];
          if(_this.zoomVal <= 0.1 || _this.zoomVal >=3.0){
            _this.zoomVal = 1;
          }
          if(e.deltaY < 0){    
            res = res + `scale(${_this.zoomVal += ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform = res;  
          }else{    
            res = res + `scale(${_this.zoomVal -= ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum)).style.transform = res;  }  
          }
      })
      $("#parentcanvas"+pagenum+" div[id^='rect']").remove();
      let line = 0;
      let transformdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
      if(transformdiv && this.currentfiletype == 'application/pdf'){
        transformdiv.style.transform = 'translate3d(-18px, -300px, 0px) scale('+this.zoomVal+')';
      }
      for(let l of obj['words']){
        let i = 0;
        let boundingbox = l.polygon;
        if(this.currentfiletype == 'application/pdf'){
          boundingbox = this.convertInchToPixel(boundingbox);
        }else{
          boundingbox = this.convertImagePixelToPixel(boundingbox);
        }
        let div : any = document.createElement('div');
        div.id = "rect"+pagenum+l.content+Math.round(boundingbox[0])+Math.round(boundingbox[1]);
        this.alldivs[pagenum].push(div.id);
        div.setAttribute("line",line);
        div.style.position = 'absolute';
        div.style.border = '1px solid yellow';
        div.style.top = boundingbox[1]+'px'
        div.style.left = boundingbox[0]+'px';
        div.style.width = boundingbox[4]+'px';
        div.style.height = boundingbox[5]+'px';
        div.style.zIndex = "5000";
        div.setAttribute("selected","false");
        let parentdiv = (<HTMLDivElement>document.getElementById("parentcanvas"+pagenum));
        if(parentdiv){
          parentdiv.appendChild(div)
        }
        i++;
        let popdiv = (<HTMLDivElement>document.getElementById("hidden"+pagenum));
        if(popdiv){
          popdiv.style.display = 'none';  
        }
        div.addEventListener('mousedown',function(eve){
          if(_this.activatedrw){
            return;
          }
          if(div.getAttribute("selected") == "false"){
            if(!_this.showtabletags){
              popdiv.style.position = 'absolute';
              popdiv.style.display = 'block';
              popdiv.style.zIndex = '10000';
              popdiv.style.background = '#F8F8FF'
              popdiv.style.color = '#f1c40f';
              popdiv.style.top = boundingbox[1]+15+"px";
              popdiv.style.left = boundingbox[0]+10+"px";
            }
            div.setAttribute("selected","true")
            div.style.backgroundColor = "rgba(0,255,0,0.4)"
            _this.displayResponsivepopup = true;
            _this.top = boundingbox[1]+10;
            _this.currentSelection.push({'x':boundingbox[0],'y':boundingbox[1],'w':boundingbox[4],'h':boundingbox[5],'x2':boundingbox[2],'y2':boundingbox[3],'x4':boundingbox[6],'y4':boundingbox[7],'text':l.content,'line':Number(div.getAttribute("line")),'div':div.id})
            if(_this.currentSelection.length > 1){
              _this.currentSelection = _this.currentSelection.sort((a,b) => {
                return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
              })
            }
          }else{
            div.setAttribute("selected","false")
            div.style.backgroundColor = "transparent";
            _this.currentSelection = _this.currentSelection.filter(a => a.div != div.id);
            if(_this.currentSelection.length > 1){
              _this.currentSelection = _this.currentSelection.sort((a,b) => {
                return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
              })
            }
          }
          if(_this.currentSelection.length == 0){
            popdiv.style.display = 'none';
          }
        });
        div.addEventListener('mouseenter',function(eve){
          if(_this.activatedrw){
            _this.dragdisable = true;
            return;
          } 
          _this.dragdisable = true;
          if(eve.which == 1){
          if(div.getAttribute("selected") == "false"){
              div.setAttribute("selected","true")
              if(div.style.backgroundColor != "rgba(0,255,0,0.4)"){
                if(!_this.showtabletags){
                  popdiv.style.position = 'absolute';
                  popdiv.style.display = 'block';
                  popdiv.style.zIndex = '10000';
                  popdiv.style.background = '#F8F8FF'
                  popdiv.style.color = '#f1c40f';
                  popdiv.style.top = boundingbox[1]+15+"px";
                  popdiv.style.left = boundingbox[0]+10+"px";
                }
                div.style.backgroundColor = "rgba(0,255,0,0.4)"
                _this.currentSelection.push({'x':boundingbox[0],'y':boundingbox[1],'w':boundingbox[4],'h':boundingbox[5],'x2':boundingbox[2],'y2':boundingbox[3],'x4':boundingbox[6],'y4':boundingbox[7],'text':l.content,'line':Number(div.getAttribute("line")),'div':div.id})
                if(_this.currentSelection.length > 1){
                  _this.currentSelection = _this.currentSelection.sort((a:any,b:any) => {
                    return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                  })
                }
              }
            }else{
              div.setAttribute("selected","false")
              div.style.backgroundColor = "transparent";
              _this.currentSelection = _this.currentSelection.filter(a => a.div != div.id);
              if(_this.currentSelection.length > 1){
                _this.currentSelection = _this.currentSelection.sort((a,b) => {
                  return _this.float2int(a.line) - _this.float2int(b.line) || _this.float2int(a.x) - _this.float2int(b.x); 
                })
              }
              if(_this.currentSelection.length == 0){
                popdiv.style.display = 'none';
              }
            }
            
          }
        });
        line++;
      }
      document.addEventListener('keydown',async function(eve){
          const key = eve.key;
          if(key === 'Delete'){
            _this.loadingtableIndex = true;
            let popdiv = (<HTMLDivElement>document.getElementById("hidden"+pagenum));
            if(popdiv){
              popdiv.style.display = 'none';
            }
            for(let m=0;m<_this.currentSelection.length;m++){
              let boundingbox = [_this.currentSelection[m].x,_this.currentSelection[m].y,_this.currentSelection[m].x2,_this.currentSelection[m].y2,_this.currentSelection[m].w,_this.currentSelection[m].h,_this.currentSelection[m].x4,_this.currentSelection[m].y4];
              if(_this.currentfiletype == 'application/pdf'){
                boundingbox = _this.convertPixelToInch(boundingbox);
              }else{
                boundingbox = _this.convertPixeltoImagePixel(boundingbox);
              }
              let divid = "rect"+_this.currentindex+_this.currentSelection[m].text+Math.round(_this.currentSelection[m].x)+Math.round(_this.currentSelection[m].y);
              let bestmatch = _this.bestMatch(divid)
              if(bestmatch){
                let div = (<HTMLDivElement>document.getElementById(String(bestmatch["item"])));
                if(div){
                  div.style.backgroundColor = 'transparent';
                  div.setAttribute("selected","false");
                  div.style.border = '1px solid yellow';
                  _this.fieldid = div.getAttribute("fieldid");
                  let index;
                  if(_this.fieldid){
                    if(!_this.fieldid.startsWith(_this.currenttable)){
                      let fieldKey = _this.fieldid.split("-")[1]
                      index =  _this.labelsJson["labels"].findIndex(el => el.label == fieldKey);
                      _this.loadingIndex = index;
                    }else{
                      index =  _this.labelsJson["labels"].findIndex(el => el.label == _this.fieldid);
                    }
                  
                    for(let v of _this.labelsJson["labels"][index]["value"]){
                      if(v.text == _this.currentSelection[m].text && v.boundingBoxes[0][0].toFixed(1) == boundingbox[0].toFixed(1) && v.boundingBoxes[0][1].toFixed(1) == boundingbox[1].toFixed(1)){
                        _this.labelsJson["labels"][index]["value"] = _this.labelsJson["labels"][index]["value"].filter(val => val != v);
                      }
                    }
                    _this.currenttext = _this.labelsJson["labels"][index]["value"].map(function(element){return element.text}).join(" ");
                    if(_this.fieldid.startsWith(_this.currenttable)){
                      _this.currenttext = `${_this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${_this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</i></div>`;
                      if(_this.temp_lang == "ar"){
                        _this.currenttext = `<div dir="rtl">${_this.currenttext} <div style="display: flex; justify-content: flex-end;margin-left: 150px;">${_this.currenttext != '' ? `<i class="fa fa-check" style="color: #27ae60;"></i>` : `<i class="fa fa-times" style="color: #e74c3c;"></i>`}</i></div></div>`;
                      }
                    }
                    (<HTMLDivElement>document.getElementById(_this.fieldid)).innerHTML = _this.currenttext;
                  }
                }
              }
            }
            _this.labelsJson = await _this.customMizeLabels(_this.labelsJson);
            let frobj = {
              'documentId':_this.modelData.idDocumentModel,
              'container':_this.frConfigData[0].ContainerName,
              'connstr':_this.frConfigData[0].ConnectionString,
              'filename':_this.modelData.folderPath+"/"+_this.currentfile,
              'saveJson':null,
              'labelJson':_this.labelsJson
            }
            _this.sharedService.saveLabelsFile(frobj).subscribe((data:any) => {
              _this.loadingIndex = null;
              _this.loadingtableIndex = false;
            })
            _this.currenttext = "";
            _this.currentSelection = [];
          }
      });
    }catch(ex){
      console.log(ex);
    }
  }
  
  updateTableType(event){
    if(event.target.id == 'dynamicsized'){
      this.isFixed = false;
    }else{
      this.isFixed = true;
    }
  }
  convertInchToPixel(arr:any){
      let diagonalpixel = Math.sqrt(Math.pow(window.screen.width,2)+Math.pow(window.screen.height,2));
      let diagonalinch = diagonalpixel/72;
      let ppi = diagonalpixel/diagonalinch;
      let x1 = arr[0]*ppi;
      let y1 = arr[1]*ppi;
      let x2 = arr[2]*ppi;
      let y2 = arr[3]*ppi;
      let x3 = arr[4]*ppi - arr[0]*ppi;
      let y3 = arr[5]*ppi - arr[1]*ppi;
      let x4 = arr[6]*ppi;
      let y4 = arr[7]*ppi;
      return [x1*1.5,y1*1.5,x2,y2,x3*1.5,y3*1.5,x4,y4]
  }
  convertImagePixelToPixel(arr:any){
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4] - arr[0];
    let y3 = 0;
    if(arr[5] >= arr[1]){
      y3 = arr[5] - arr[1];
    }else{
      y3 = Math.max(arr[1],arr[3],arr[5],arr[7]) - Math.min(arr[1],arr[3],arr[5],arr[7]);
    }
    let x4 = arr[6];
    let y4 = arr[7];
    return [x1,y1,x2,y2,x3,y3,x4,y4]
  }
  convertPixelToInch(arr:any){
    let diagonalpixel = Math.sqrt(Math.pow(window.screen.width,2)+Math.pow(window.screen.height,2));
    let diagonalinch = diagonalpixel/72;
    let ppi = diagonalpixel/diagonalinch;
    let x1 = arr[0]/ppi;
    let y1 = arr[1]/ppi;
    let x2 = arr[2]/ppi;
    let y2 = arr[3]/ppi;
    let x3 = arr[4]/ppi + arr[0]/ppi;
    let y3 = arr[5]/ppi + arr[1]/ppi;
    let x4 = arr[6]/ppi;
    let y4 = arr[7]/ppi;
    x1 = x1/1.5;
    y1 = y1/1.5;
    x3= x3/1.5;
    y3=y3/1.5;
    return [x1/this.currentwidth,y1/this.currentheight,x2/this.currentwidth,y2/this.currentheight,x3/this.currentwidth,y3/this.currentheight,x4/this.currentwidth,y4/this.currentheight]
  }
  convertPixeltoImagePixel(arr:any){
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4] + arr[0];
    let y3 = arr[5] + arr[1];
    let x4 = arr[6];
    let y4 = arr[7];
    return [x1/this.currentwidth,y1/this.currentheight,x2/this.currentwidth,y2/this.currentheight,x3/this.currentwidth,y3/this.currentheight,x4/this.currentwidth,y4/this.currentheight]
  }
  Objectkeys(obj:any){
    return Object.keys(obj);
  }
  next(){
    const ocr_engine_version =  this.ocr_version;
    this.currentindex = this.currentindex + 1;
    if(this.currentindex > this.maxpage){
      this.currentindex = 1;
    }
    this.fuse = new Fuse(this.alldivs[this.currentindex], {
      threshold: 0.3, // Adjust the threshold as needed
      keys: [], // The keys to search for similarity
    });
    let popdiv = (<HTMLDivElement>document.getElementById("hidden"+this.currentindex));
    popdiv.style.display = 'none';
    let obj;
    if(ocr_engine_version == "v2.1")
    obj = this.readResults.filter(v => v.page == this.currentindex);
    else
    obj = this.readResults.filter(v => v.pageNumber == this.currentindex);
    this.currentwidth = obj[0]['width'];
    this.currentheight = obj[0]['height'];
    this.currentangle = obj[0]['angle'];
    this.currentpage = "Page-"+this.currentindex;
    for(let p=1;p<=this.maxpage;p++){
      if("Page-"+p == this.currentpage){
        (<HTMLDivElement>document.getElementById(this.currentpage+'container')).style.display = 'flex';
      }else{
        (<HTMLDivElement>document.getElementById('Page-'+p+'container')).style.display = 'none';
      }
    }
  }


  previous(){
    const ocr_engine_version =  this.ocr_version;
    this.currentindex = this.currentindex - 1
    if(this.currentindex < 1){
      this.currentindex = this.maxpage;
    }
    this.fuse = new Fuse(this.alldivs[this.currentindex], {
      threshold: 0.3, // Adjust the threshold as needed
      keys: [], // The keys to search for similarity
    });
    let popdiv = (<HTMLDivElement>document.getElementById("hidden"+this.currentindex));
    popdiv.style.visibility = 'none';
    let obj;
    if(ocr_engine_version == "v2.1")
    obj = this.readResults.filter(v => v.page == this.currentindex);
    else
    obj = this.readResults.filter(v => v.pageNumber == this.currentindex);
    this.currentwidth = obj[0]['width'];
    this.currentheight = obj[0]['height'];
    this.currentangle = obj[0]['angle'];
    this.currentpage = "Page-"+this.currentindex;
    for(let p=1;p<=this.maxpage;p++){
      if("Page-"+p == this.currentpage){
        (<HTMLDivElement>document.getElementById(this.currentpage+'container')).style.display = 'flex';
      }else{
        (<HTMLDivElement>document.getElementById('Page-'+p+'container')).style.display = 'none';
      }
    }
  }
  counter(i: number) {
    return Array(i);
  }
  
  async SelectDoc(i:number){
    if(this.loading1){
      return;
    }
    // if(this.previousdoc in this.labels){
    //   let jsonlabel = JSON.parse(this.labels[this.previousdoc].blob);
    //   let taggedlabels = jsonlabel.labels.filter(v => v.value.length > 0);
    //   taggedlabels = taggedlabels.map(function(t){return t.label});
    //   let alllabels = this.fields.filter(v => v.fieldType == "string");
    //   alllabels = alllabels.map(function(f){return f.fieldKey});
    //   let untaggedfields = alllabels.filter(x => !taggedlabels.includes(x));
    //   if(untaggedfields.length > 0){
    //       alert(`Mandatory Fields ${untaggedfields.join()} are not tagged for file ${this.previousdoc}!`);
    //       return;
    //   }else{
    //       this.previousdoc = Object.keys(this.thumbnails[i])[0];
    //   }
    // }else{
    //   if(this.previousdoc != ""){
    //     this.previousdoc = Object.keys(this.thumbnails[i])[0];
    //     alert(`All Mandatory Fields are not tagged for file ${this.previousdoc}!`);
    //     return;
    //   }
    // }
    // if(this.previousdoc == ""){
    //   this.previousdoc = Object.keys(this.thumbnails[i])[0];
    // }
    this.currentfile = Object.keys(this.thumbnails[i])[0];
    this.sharedService.getLabelsInfo(this.modelData.folderPath,this.currentfile).subscribe((data:any) => {
      for(let t = 0;t<this.thumbnails.length;t++){
        if(t == i){
          (<HTMLInputElement>document.getElementById("thumb"+t.toString())).classList.add('selected');
        }else{
          (<HTMLInputElement>document.getElementById("thumb"+t.toString())).classList.remove('selected');
        }
      }
      let div = (<HTMLDivElement>document.getElementById("newtag"));
      if(div){
        div.style.display = 'none';
      }
      if(!this.currentfile.endsWith(".html") && !this.currentfile.endsWith(".htm")){
        this.analyzeDocument(this.frp_id,this.currentfile,data);
      }else{
        this.analyzeDocumentHTML(this.currentfile);
      }
    });
  }
  zoomIn(){
    this.zoomVal = this.zoomVal + 0.08;
    if(this.zoomVal >= 3.0){
      this.zoomVal = 1;
    }
    let scaletransform = (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform;
    let res = scaletransform.split("scale")[0];
    res = res + 'scale('+this.zoomVal+')';
    (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform = res;
  }
  DragRemoved(event:CdkDragEnd){
  }
  DragMoving(event:CdkDragMove){
      let scaletransform = (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform;
      let res = scaletransform.split("scale")[0];
      res = res + 'scale('+this.zoomVal+')';
      (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform = res;  
  }
  getLabelIndex(field){
    return this.labelsJson["labels"].findIndex(el => el.label == field.fieldKey);
  }
  async setinitial(i,field){
    if(!field.fieldKey.startsWith(this.currenttable)){
      let index = this.labelsJson["labels"].findIndex(el => el.label == field.fieldKey);
      if(index != -1){
        let unsorted = this.labelsJson["labels"][index]["value"];
        for(let o=0;o<unsorted.length;o++){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(unsorted[o].boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(unsorted[o].boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          if(!isNaN(boundingBox[0]) && !isNaN(boundingBox[1])){
            let divid = "rect"+this.currentindex+unsorted[o].text+boundingBox[0]+boundingBox[1];
            let bestmatch = this.bestMatch(divid);
            if(bestmatch && (<HTMLDivElement>document.getElementById(String(bestmatch["item"])))){
              unsorted[o].line = Number((<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).getAttribute("line"));
            }
          }
        }
        unsorted = unsorted.sort((a:any,b:any) => {
          return a.line - b.line || a.boundingBoxes[0][0] - b.boundingBoxes[0][0]; 
        })
        this.labelsJson["labels"][index]["value"] = unsorted.map(s => ({
          page : s.page,
          text : s.text,
          boundingBoxes : s.boundingBoxes
        }))
        let arr = this.labelsJson["labels"][index]["value"];
        for(let j=0;j<arr.length;j++){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(arr[j].boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(arr[j].boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          if(!isNaN(boundingBox[0]) && !isNaN(boundingBox[1])){
            let divid = "rect"+arr[j].page+arr[j].text+boundingBox[0]+boundingBox[1];
            let bestmatch = this.bestMatch(divid);
            if(bestmatch){
              let div = (<HTMLDivElement>document.getElementById(String(bestmatch["item"])));
              if(div){
                div.style.backgroundColor = 'transparent';
                div.setAttribute("selected","false");
                div.setAttribute("fieldid","field-"+field.fieldKey);
                div.style.borderColor = 'rgb(9, 179, 60)';
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '2px';
              }
            }
          }
        }
        this.currenttext = this.labelsJson["labels"][index]["value"].map(function(element){return element.text}).join(" ");
        (<HTMLDivElement>document.getElementById("field-"+field.fieldKey)).innerHTML = this.currenttext;
        if(this.temp_lang == "ar"){
          (<HTMLDivElement>document.getElementById("field-"+field.fieldKey)).innerHTML = `<div dir="rtl">${this.currenttext}</div>`;
        }
        this.currenttext = "";
        this.currentSelection = [];  
      }
    }
  }
  float2int(value){
    return value | 0;
  }
  checkFieldExists(obj){
    for(let lab=0;lab<this.labelsJson["labels"].length;lab++){
      if(this.labelsJson["labels"][lab]["value"].findIndex(x => JSON.stringify(x) == JSON.stringify(obj)) != -1){
        return true;
      }
    }
    return false;
  }
  async SetField(i,field){
    this.loadingIndex = i;
      if(field.fieldType == 'string'){
        let found = this.labelsJson["labels"].some(el => el.label === field.fieldKey);
        let index =  this.labelsJson["labels"].findIndex(el => el.label === field.fieldKey);
        if(!found){
          this.labelsJson["labels"].push({"label":field.fieldKey,"key":null,"value":[]});
          index = this.labelsJson["labels"].length - 1;
        }
        let arr = this.currentSelection;
        for(let j=0;j<arr.length;j++){
          let boundingbox = [arr[j].x,arr[j].y,arr[j].x2,arr[j].y2,arr[j].w,arr[j].h,arr[j].x4,arr[j].y4];
          if(this.currentfiletype == 'application/pdf'){
            boundingbox = this.convertPixelToInch(boundingbox);
          }else{
            boundingbox = this.convertPixeltoImagePixel(boundingbox);
          }
          if(!this.checkFieldExists({"page":this.currentindex,"text":arr[j].text,"boundingBoxes":[boundingbox]})){
            this.labelsJson["labels"][index]["value"].push({"page":this.currentindex,"text":arr[j].text,"boundingBoxes":[boundingbox]})
            let divid = "rect"+this.currentindex+arr[j].text+Math.round(arr[j].x)+Math.round(arr[j].y);
            let bestmatch = this.bestMatch(divid)
            if(bestmatch){
              let div = (<HTMLDivElement>document.getElementById(String(bestmatch["item"])));
              if(div){
                div.style.backgroundColor = 'transparent';
                div.setAttribute("selected","false");
                div.setAttribute("fieldid","field-"+field.fieldKey);
                div.style.borderColor = 'rgb(9, 179, 60)';
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '2px';
                (<HTMLDivElement>document.getElementById("hidden"+this.currentindex)).style.display = 'none';
              }
            }
          }
        }
        let unsorted = this.labelsJson["labels"][index]["value"];
        for(let o=0;o<unsorted.length;o++){
          let boundingBox;
          if(this.currentfiletype == 'application/pdf'){
            boundingBox = this.convertInchToPixel(unsorted[o].boundingBoxes[0]);
          }else{
            boundingBox = this.convertImagePixelToPixel(unsorted[o].boundingBoxes[0]);
          }
          boundingBox[0] = Math.round(boundingBox[0]*this.currentwidth);
          boundingBox[1] = Math.round(boundingBox[1]*this.currentheight);
          let divid = "rect"+this.currentindex+unsorted[o].text+boundingBox[0]+boundingBox[1];
          let bestmatch = this.bestMatch(divid)
          if(bestmatch)
          unsorted[o].line = Number((<HTMLDivElement>document.getElementById(String(bestmatch["item"]))).getAttribute("line"));
        }
        unsorted = unsorted.sort((a:any,b:any) => {
          return a.line - b.line || a.boundingBoxes[0][0] - b.boundingBoxes[0][0]; 
        })
        this.labelsJson["labels"][index]["value"] = unsorted.map(s => ({
          page : s.page,
          text : s.text,
          boundingBoxes : s.boundingBoxes
        }))
        this.labelsJson = await this.customMizeLabels(this.labelsJson);
        let frobj = {
          'documentId':this.modelData.idDocumentModel,
          'container':this.frConfigData[0].ContainerName,
          'connstr':this.frConfigData[0].ConnectionString,
          'filename':this.modelData.folderPath+"/"+this.currentfile,
          'saveJson':null,
          'labelJson':this.labelsJson
        }
        this.sharedService.saveLabelsFile(frobj).subscribe((data:any) => {
          this.loadingIndex = null; 
        })
        this.currenttext = this.labelsJson["labels"][index]["value"].map(function(element){return element.text}).join(" ");
        (<HTMLDivElement>document.getElementById("field-"+field.fieldKey)).innerHTML = this.currenttext;
        if(this.temp_lang == "ar"){
          (<HTMLDivElement>document.getElementById("field-"+field.fieldKey)).innerHTML = `<div dir="rtl"> ${this.currenttext}</div>`;
        }
        this.currenttext = "";
        this.currentSelection = [];
    }
  }
  zoomOut(){
    this.zoomVal = this.zoomVal - 0.08;
    if(this.zoomVal <= 0.1){
      this.zoomVal = 1;
    }
    let scaletransform = (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform;
    let res = scaletransform.split("scale")[0];
    res = res + 'scale('+this.zoomVal+')';
    (<HTMLDivElement>document.getElementById("parentcanvas"+this.currentindex)).style.transform = res;
  }
  findIndexByKey(array, key) {
    for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        if (key in obj) {
            return i; // Return index if key exists in the object
        }
    }
    return -1; // Return -1 if key doesn't exist in any object
  }
  //Auto tagging function start
  tagValues(e) {
      let value = e.target.id;
      let filename = this.currentfile;
      let index = this.findIndexByKey(this.thumbnails, filename);
      if (value === "currentFile") {
        this.analyzing = true;
        this.layouttext = "Getting Labels for Current File"
        this.ready = false;
        this.sharedService.tagValuesToFields(this.modelData.folderPath, filename).subscribe((data: any) => {
          this.SelectDoc(index);
          this.analyzing = false;
          this.ready = true;
        });
      }
      else if(value === "allFiles"){
        this.analyzing = true;
        this.ready = false;
        this.layouttext = "Getting Labels for All Files"
        this.sharedService.tagValuesToFields(this.modelData.folderPath).subscribe((data: any) => {
          this.SelectDoc(0);
          this.ready = true;
          this.analyzing = false;
        });
      }   
  }
  runLayout() {
    this.analyzing = true;
    this.ready = false;
    this.layouttext = "Running Layout for all files. Please Wait!"
    this.sharedService.runLayout(this.modelData.folderPath, this.ocr_version).subscribe((data:any) =>{
      this.ready = true;
      this.analyzing = false;
      location.reload();
    })
  }
}
//Auto tagging function end
