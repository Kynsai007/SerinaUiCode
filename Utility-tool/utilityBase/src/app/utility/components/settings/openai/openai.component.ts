import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OpenAIService } from 'src/app/services/openAI/open-ai.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-openai',
  templateUrl: './openai.component.html',
  styleUrls: ['./openai.component.scss']
})
export class OpenaiComponent implements OnInit {
  tags = [
    { Name: 'Tag 1', Description: 'tag1 Description', Ismandatory: true, isUsed: true }
  ];
  filterTags:any[];
  dialogList: any[];
  isImgBoolean;
  isLoaded:boolean;
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  zoomX = 1;
  orgX = '0px';
  orgY = '0px';
  showInvoice: string | null = null;
  content_type: any;
  imageCanvas: HTMLImageElement;
  isPdfAvailable: boolean;
  zoomVal: number = 0.8;
  zoom: number = 1;
  rotation = 0;
  page: number = 1;
  totalPages: number;
  panX: number;   
  panY: number;
  zoomdata: number = 1; 
  testingMode = false;
  file: File;
  file_url: string;
  dragging: boolean;
  isServiceProvider = false;
  isHeader = false;
  isTagDialog: boolean;
  prompt:string = '';
  isVendorLevel: boolean;
  isServiceLevel: boolean;
  ven_ser_id:any;
  name: string;
  isGlobal: boolean;
  constructor(private router: Router,
    private openAIService : OpenAIService,
    private sanitizer: DomSanitizer,
    private mat_dlg: MatDialog,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.ven_ser_id = this.router?.url?.split('/')[4];
    this.name = decodeURIComponent(this.router?.url?.split('/')[5]);
    this.isGlobal = this.router?.url?.split('/')[6] == 'Global';
    if(this.router.url.includes('vendors')){
      this.isVendorLevel = true;
    } else if(this.router.url.includes('open_ai_service_provider')){
      this.isServiceLevel = true;
    }
    this.applyFilters();
    // this.filterTags = this.tags;
    // this.dialogList = this.tags;
    this.readAllTags();

    
  }
  applyFilters() {
    this.router.navigate([], {
      queryParams: {
        isServiceProvider: this.isServiceProvider || null, 
        isHeader: this.isHeader || null,
      },
      queryParamsHandling: 'merge', 
    });
  }
  openFilterDialog(event,text){
    let top = event.clientY + 10 + "px";
    let left = event.clientX - 540 + "px";
    const dialog = document.querySelector('dialog');
    dialog.style.top = top;
    dialog.style.left = left;
    if(dialog){
      dialog.showModal();
    }
  }

  closeDialog(){
    const dialog = document.querySelector('dialog');
    if(dialog){
      dialog.close();
    }
  }
  saveTags(){
    // this.sharedService.saveTags(this.tags);
  }
  searchTags(key){
    this.dialogList = this.filterTags;
    this.dialogList = this.dialogList.filter(el=> el.Name.toLowerCase().includes(key.toLowerCase()));
  }
  searchGlobalTags(key){
    this.tags = this.filterTags;
    this.tags = this.tags.filter(el=> el.Name.toLowerCase().includes(key.toLowerCase()));
  }
  checkTag(isChecked,tagData,tagName){
    console.log(tagData,tagName)
    let apiParams = {
      "tagid": 0,
      "isMandatory": true,
      "isActive": true,
      "isglobal": this.isVendorLevel || this.isServiceLevel ? false : true,
      "description": "string"
    }

    apiParams.tagid = tagData.idDefaultFields || tagData.idOpenaiFields;
    apiParams.isMandatory = tagData.Ismandatory || false;
    apiParams.isActive = tagData.isUsed || false;
    apiParams.description = tagData.Description|| '';
    if(tagName == 'Ismandatory'){
      apiParams.isMandatory = isChecked;
    } else if(tagName == 'isActive'){
      apiParams.isActive = isChecked;
    }
    this.openAIService.updateTags(apiParams).subscribe((data)=>{
      this.alertService.success_alert("Tag info updated successfully");
      // this.readAllTags();
    }, err=>{
      this.alertService.error_alert("Server error");
    });
  }
  updateTag(value,tagData,tagName){
    if(value == '' || tagData.Description == value.trim()){
      return;
    }
    let apiParams = {
      "tagid": tagData.idDefaultFields || tagData.idOpenaiFields,
      "isMandatory": tagData.Ismandatory || false,
      "isActive": tagData.isUsed || false,
      "isglobal": this.isVendorLevel || this.isServiceLevel ? false : true,
      "description": value
    }

    this.openAIService.updateTags(apiParams).subscribe((data)=>{
      this.alertService.success_alert("Tag info updated successfully");
      // this.readAllTags();
    }, err=>{
      this.alertService.error_alert("Server error");
    });
  }
 
  loadImage() {
    if (this.isImgBoolean == true) {
      console.log('image');
      setTimeout(() => {
        this.zoomVal = 1;
        this.panX = 0;
        this.panY = 0;
        this.canvasRef.nativeElement.style.transform =
          'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.canvasRef.nativeElement.width = window.innerWidth;
        this.canvasRef.nativeElement.height = window.innerHeight;
        this.drawImagein();
        this.addEventListeners();
      }, 50);

    }
  }

  drawImagein() {
    this.imageCanvas = new Image();
    this.imageCanvas.src = this.showInvoice;
    let imageWidth, imageHeight;
    this.imageCanvas.onload = () => {
      const imageAspectRatio = this.imageCanvas.width / this.imageCanvas.height;
      const canvasAspectRatio = this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height;

      if (imageAspectRatio > canvasAspectRatio) {
        imageWidth = this.canvasRef.nativeElement.width;
        imageHeight = imageWidth / imageAspectRatio;
      } else {
        imageHeight = this.canvasRef.nativeElement.height;
        imageWidth = imageHeight * imageAspectRatio;
      }
      this.ctx.drawImage(this.imageCanvas, 0, 0, imageWidth, imageHeight);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    };
  }

  addEventListeners() {
    this.canvasRef.nativeElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const zoomFactor = 1.1;
      const zoom = this.zoomVal;
      if (delta < 0) {
        this.zoomVal = zoom * zoomFactor;
      } else {
        this.zoomVal = zoom / zoomFactor;
      }
      this.canvasRef.nativeElement.style.transform =
        'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
      this.drawImagein();
    });

    this.canvasRef.nativeElement.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      const startZoom = this.zoomVal;
      const startPanX = this.panX;
      const startPanY = this.panY;

      const mouseMove = (e) => {
        e.preventDefault();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        this.panX = startPanX + (endX - startX) / startZoom;
        this.panY = startPanY + (endY - startY) / startZoom;
        this.canvasRef.nativeElement.style.transform =
          'scale(' + this.zoomVal + ') translate(' + this.panX + 'px, ' + this.panY + 'px)';
      };

      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });
  }
  zoomIn() {
    if(this.isImgBoolean){
      this.zoomVal = this.zoomVal + 0.2;
      this.zoomX = this.zoomX + 0.05;
      this.orgX = this.orgX + '50px';
      this.orgY = this.orgY + '50px';
      if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
        this.zoomVal = 1;
        this.zoomX = 1;
        this.orgX = '0px';
        this.orgY = '0px';
      }
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
    } else {
      this.zoomdata = this.zoomdata + 0.1;
    }
  }

  zoomOut() {
    if(this.isImgBoolean) {
      this.zoomVal = this.zoomVal - 0.2;
      this.zoomX = this.zoomX - 0.05;
      // this.orgX  = this.orgX - '50px';
      // this.orgY  = this.orgY - '50px';
      if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
        this.zoomVal = 1;
        this.zoomX = 1;
        this.orgX = '0px';
        this.orgY = '0px';
      }
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
      (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
    } else {
      this.zoomdata = this.zoomdata - 0.1;
    }
  }
  afterLoadComplete(pdfData) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  // onDrop(event) {
  //   event.preventDefault();
  //   console.log(event);
  //   const files = event.dataTransfer.files;
  //   this.onFileChange(files);
  // }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.onFileChange(event.dataTransfer.files);
    }
  }
  onFileChange(event: any) {
    this.clearPreview();
    const fileInput = event?.target?.files || event;
    if (fileInput && fileInput?.length > 0) {
      const file = fileInput[0];

      // Validate file type
      if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
        alert('Unsupported file type. Please upload a PDF or an image.');
        return;
      }

       if (file?.type === 'application/pdf') {
          this.isImgBoolean = false;
          // this.loadPDFtest(this.showInvoice);
                // Read the file as a data URL
          const blob = new Blob([file], { type: file.type });
          this.showInvoice = URL.createObjectURL(blob);
        } else{
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.showInvoice = e.target.result;
            
            this.isImgBoolean = true;
            this.loadImage();
          };
          reader.readAsDataURL(file);

        }


    }
  }

    // Clean up the blob URL to avoid memory leaks
    clearPreview() {
      if (this.showInvoice) {
        URL.revokeObjectURL(this.showInvoice);
        this.showInvoice = null;
      }
    }

  loadPDFtest(fileUrl: string): void {
    // Implement the logic to load and display the PDF
    // console.log('Loading PDF from URL:', fileUrl);
  }
  updateCharacterCount(event){
    this.prompt = event.target.value;
    if (this.prompt.length > 250) {
      this.prompt = this.prompt.substring(0, 250);
      event.target.value = this.prompt;
    }
  }
  savePrompt(){
    let context = 'vendor';
    if(this.isServiceProvider || this.isServiceLevel){
      context = 'sp';
    }
    this.openAIService.updatePrompt(null,context,this.prompt).subscribe((data)=>{
      this.alertService.success_alert("Prompt updated successfully");
      this.closeDialog();
    }, err=>{
      this.alertService.error_alert("Server error");
    });
  }
  readAllTags(){
    let context = 'vendor';
    if(this.isServiceProvider || this.isServiceLevel){
      context = 'sp';
    }
    let id = null;
    if(this.ven_ser_id){
      id = this.ven_ser_id;
    }
    this.openAIService.readAllTags(id,context,!this.isHeader).subscribe((data)=>{
      this.tags = data.fields;
      this.prompt = data.tail_prompt;
      this.filterTags = this.tags;
    })
  }
  changeServiceProvider(){
    this.readAllTags();
  }
  changeHeader(){
    this.readAllTags();
  }
  confirmFun(body, type, head) {
    return this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: body, type: type, heading: head, icon: 'assets/Group 1336.svg' }
    })
  }

  delete_tag(tagData){
    const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to delete this tag?', 'confirmation', 'Confirmation')
    drf.afterClosed().subscribe((bool:boolean)=>{
      if(bool){
        this.openAIService.deleteTags(tagData.idDefaultFields).subscribe((data:any)=>{
          if(data.status == 'success'){
            this.readAllTags();
          }
        })
      }
    })
  }
}
